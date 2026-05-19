import Map "mo:core/Map";
import List "mo:core/List";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Types "../types/admin";
import Common "../types/common";
import AnalyticsTypes "../types/analytics";
import NoteTypes "../types/notes";
import Order "mo:core/Order";
import Array "mo:core/Array";

module {
  // ---------- user management ----------

  public func banUser(
    statuses : Map.Map<Common.UserId, Common.AccountStatus>,
    target : Common.UserId,
    reason : Text,
    admin : Common.UserId,
  ) : () {
    let status : Common.AccountStatus = #banned {
      reason;
      adminPrincipal = admin;
      timestamp = Time.now();
    };
    statuses.add(target, status);
  };

  public func suspendUser(
    statuses : Map.Map<Common.UserId, Common.AccountStatus>,
    target : Common.UserId,
    reason : Text,
    until : ?Common.Timestamp,
  ) : () {
    let status : Common.AccountStatus = #suspended { reason; until };
    statuses.add(target, status);
  };

  public func unsuspendUser(
    statuses : Map.Map<Common.UserId, Common.AccountStatus>,
    target : Common.UserId,
  ) : () {
    statuses.add(target, #active);
  };

  // ---------- action log ----------

  public func logAction(
    actionLog : List.List<Types.AdminAction>,
    state : { var nextActionId : Nat },
    kind : Types.AdminActionKind,
    target : Types.AdminActionTarget,
    reason : Text,
    admin : Common.UserId,
  ) : () {
    let action : Types.AdminAction = {
      id = state.nextActionId;
      kind;
      target;
      reason;
      adminPrincipal = admin;
      timestamp = Time.now();
    };
    state.nextActionId += 1;
    actionLog.add(action);
  };

  // ---------- analytics ----------

  // One nanosecond week = 7 * 24 * 3600 * 1_000_000_000
  let nanosecondsPerWeek : Int = 604_800_000_000_000;

  func weekLabel(ts : Common.Timestamp) : Text {
    // ISO week approximation: count weeks since Unix epoch (1970-01-01 was a Thursday)
    // Shift so Monday = start of week: epoch Monday offset = -3 days
    let mondayOffsetNs : Int = 3 * 24 * 3600 * 1_000_000_000;
    let shifted = ts + mondayOffsetNs;
    let weeksSinceEpoch : Int = shifted / nanosecondsPerWeek;
    // Approximate year and week number
    // Use a simple rolling year approximation: 52.1775 weeks per year
    let approxYear : Int = 1970 + weeksSinceEpoch / 52;
    let weekOfYear : Int = (weeksSinceEpoch % 52) + 1;
    let y = approxYear.toText();
    let w = if (weekOfYear < 10) { "0" # weekOfYear.toText() } else { weekOfYear.toText() };
    y # "-W" # w;
  };

  public func buildAnalytics(
    notes : Map.Map<Common.NoteId, NoteTypes.Note>,
    userStatuses : Map.Map<Common.UserId, Common.AccountStatus>,
    _aiLogs : List.List<Types.AILogEntry>,
    totalCreditsAwarded : Nat,
  ) : AnalyticsTypes.AnalyticsData {
    // --- counts ---
    var totalDownloads : Nat = 0;
    var flaggedNotes : Nat = 0;
    var removedNotes : Nat = 0;

    // downloads per subject: accumulate in a Map
    let subjectMap = Map.empty<Text, Nat>();

    // weekly uploads: accumulate in a Map keyed by week label
    let weekMap = Map.empty<Text, Nat>();

    // contributor stats: uploads, earned, ai score sum, ai score count
    let uploaderUploads = Map.empty<Common.UserId, Nat>();
    let uploaderEarned  = Map.empty<Common.UserId, Nat>();
    let uploaderAISum   = Map.empty<Common.UserId, Nat>();
    let uploaderAICnt   = Map.empty<Common.UserId, Nat>();
    let uploaderName    = Map.empty<Common.UserId, Text>();

    notes.forEach(func(_id, note) {
      totalDownloads += note.downloadCount;
      if (note.isFlagged) { flaggedNotes += 1 };
      if (note.isRemoved) { removedNotes += 1 };

      // subject downloads
      let prevDl = switch (subjectMap.get(note.subject)) {
        case (?v) v;
        case null 0;
      };
      subjectMap.add(note.subject, prevDl + note.downloadCount);

      // weekly uploads
      let wk = weekLabel(note.timestamp);
      let prevWk = switch (weekMap.get(wk)) {
        case (?v) v;
        case null 0;
      };
      weekMap.add(wk, prevWk + 1);

      // contributor stats
      let uid = note.uploaderPrincipal;
      let prevUploads = switch (uploaderUploads.get(uid)) { case (?v) v; case null 0 };
      uploaderUploads.add(uid, prevUploads + 1);

      let prevEarned = switch (uploaderEarned.get(uid)) { case (?v) v; case null 0 };
      uploaderEarned.add(uid, prevEarned + note.creditsAwarded);

      switch (note.aiScore) {
        case (?score) {
          let prevSum = switch (uploaderAISum.get(uid)) { case (?v) v; case null 0 };
          uploaderAISum.add(uid, prevSum + score);
          let prevCnt = switch (uploaderAICnt.get(uid)) { case (?v) v; case null 0 };
          uploaderAICnt.add(uid, prevCnt + 1);
        };
        case null {};
      };

      // store uploader name (last wins — same uploader always has same name)
      uploaderName.add(uid, note.uploaderName);
    });

    // build downloadsPerSubject array
    let downloadsPerSubjectBuf = List.empty<AnalyticsTypes.SubjectDownloadStat>();
    for ((subj, cnt) in subjectMap.entries()) {
      downloadsPerSubjectBuf.add({ subject = subj; downloadCount = cnt });
    };
    let downloadsPerSubject : [AnalyticsTypes.SubjectDownloadStat] = downloadsPerSubjectBuf.toArray();

    // build weeklyUploads array sorted by week label
    let weeklyUploadsBuf = List.empty<AnalyticsTypes.WeeklyUploadPoint>();
    for ((lbl, cnt) in weekMap.entries()) {
      weeklyUploadsBuf.add({ weekLabel = lbl; count = cnt });
    };
    let weeklyUploads : [AnalyticsTypes.WeeklyUploadPoint] = weeklyUploadsBuf.toArray();

    // build topContributors — collect all uploaders, sort by credits descending, take 10
    let allContributorsBuf = List.empty<AnalyticsTypes.TopContributor>();
    for ((uid, uploads) in uploaderUploads.entries()) {
      let earned = switch (uploaderEarned.get(uid)) { case (?v) v; case null 0 };
      let aiSum = switch (uploaderAISum.get(uid)) { case (?v) v; case null 0 };
      let aiCnt = switch (uploaderAICnt.get(uid)) { case (?v) v; case null 0 };
      let avgScore : ?Nat = if (aiCnt == 0) null else ?(aiSum / aiCnt);
      let name = switch (uploaderName.get(uid)) { case (?n) n; case null "" };
      allContributorsBuf.add({ principal = uid; name; totalUploads = uploads; totalEarned = earned; avgAIScore = avgScore });
    };
    let allContributors : [AnalyticsTypes.TopContributor] = allContributorsBuf.toArray();

    // sort descending by totalEarned
    let sorted = allContributors.sort(
      func(a : AnalyticsTypes.TopContributor, b : AnalyticsTypes.TopContributor) : Order.Order {
        if (a.totalEarned > b.totalEarned) #less
        else if (a.totalEarned < b.totalEarned) #greater
        else #equal;
      }
    );

    let top10Size = if (sorted.size() < 10) sorted.size() else 10;
    let top10 = Array.tabulate(top10Size, func(i) { sorted[i] });

    {
      weeklyUploads;
      downloadsPerSubject;
      topContributors = top10;
      totalNotes = notes.size();
      totalUsers = userStatuses.size();
      totalDownloads;
      totalCreditsAwarded;
      flaggedNotes;
      removedNotes;
    };
  };

  // ---------- AI log ----------

  public func appendAILog(
    aiLogs : List.List<Types.AILogEntry>,
    entry : Types.AILogEntry,
  ) : () {
    aiLogs.add(entry);
  };
};
