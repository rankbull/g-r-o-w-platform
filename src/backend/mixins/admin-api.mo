import Map "mo:core/Map";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import AccessControl "mo:caffeineai-authorization/access-control";
import AdminLib "../lib/admin";
import NotesLib "../lib/notes";
import AdminTypes "../types/admin";
import AnalyticsTypes "../types/analytics";
import NoteTypes "../types/notes";
import Common "../types/common";
import Array "mo:core/Array";

mixin (
  accessControlState : AccessControl.AccessControlState,
  notes : Map.Map<Common.NoteId, NoteTypes.Note>,
  userStatuses : Map.Map<Common.UserId, Common.AccountStatus>,
  actionLog : List.List<AdminTypes.AdminAction>,
  aiLogs : List.List<AdminTypes.AILogEntry>,
  counters : { var nextNoteId : Nat; var totalCreditsAwarded : Nat; var nextActionId : Nat },
) {
  func requireAdmin(caller : Common.UserId) {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Admin access required");
    };
  };

  // ---------- user management ----------

  public shared ({ caller }) func banUser(
    target : Common.UserId,
    reason : Text,
  ) : async () {
    requireAdmin(caller);
    AdminLib.banUser(userStatuses, target, reason, caller);
    AdminLib.logAction(actionLog, counters, #banUser, #user target, reason, caller);
  };

  public shared ({ caller }) func suspendUser(
    target : Common.UserId,
    reason : Text,
    until : ?Common.Timestamp,
  ) : async () {
    requireAdmin(caller);
    AdminLib.suspendUser(userStatuses, target, reason, until);
    AdminLib.logAction(actionLog, counters, #suspendUser, #user target, reason, caller);
  };

  public shared ({ caller }) func unsuspendUser(target : Common.UserId) : async () {
    requireAdmin(caller);
    AdminLib.unsuspendUser(userStatuses, target);
    AdminLib.logAction(actionLog, counters, #unsuspendUser, #user target, "", caller);
  };

  public query ({ caller }) func getUserList() : async [AdminTypes.UserAdminView] {
    requireAdmin(caller);
    // Collect all known principals from userStatuses.
    // Count uploads per user from notes map.
    let statusEntries = userStatuses.entries().toArray();
    statusEntries.map<(Common.UserId, Common.AccountStatus), AdminTypes.UserAdminView>(
      func((principal, status)) {
        var uploadCount = 0;
        for ((_, note) in notes.entries()) {
          if (note.uploaderPrincipal == principal and not note.isRemoved) {
            uploadCount += 1;
          };
        };
        {
          principal;
          name = "";
          credits = 0;
          totalUploads = uploadCount;
          totalEarned = 0;
          status;
          joinedAt = Time.now();
        };
      },
    );
  };

  // ---------- note moderation ----------

  public shared ({ caller }) func flagNote(
    noteId : Common.NoteId,
    reason : Text,
  ) : async () {
    requireAdmin(caller);
    NotesLib.flagNote(notes, noteId, reason);
    AdminLib.logAction(actionLog, counters, #flagNote, #note noteId, reason, caller);
  };

  public shared ({ caller }) func removeNote(noteId : Common.NoteId) : async () {
    requireAdmin(caller);
    NotesLib.removeNote(notes, noteId);
    AdminLib.logAction(actionLog, counters, #removeNote, #note noteId, "", caller);
  };

  public query ({ caller }) func getModerationQueue() : async [AdminTypes.ModerationItem] {
    requireAdmin(caller);
    let flagged = NotesLib.getModerationQueue(notes);
    flagged.map<NoteTypes.Note, AdminTypes.ModerationItem>(
      func(note) {
        {
          noteId = note.id;
          noteTitle = note.title;
          uploaderPrincipal = note.uploaderPrincipal;
          flagReason = "flagged";
          flaggedAt = note.timestamp;
          aiFlags = switch (note.aiScore) {
            case null { [] };
            case (?score) {
              if (score < 50) { ["low_quality"] } else { [] };
            };
          };
        };
      },
    );
  };

  // ---------- analytics ----------

  public query ({ caller }) func getAdminAnalytics() : async AnalyticsTypes.AnalyticsData {
    requireAdmin(caller);
    AdminLib.buildAnalytics(notes, userStatuses, aiLogs, counters.totalCreditsAwarded);
  };

  // ---------- AI logs ----------

  public query ({ caller }) func getAILogs() : async [AdminTypes.AILogEntry] {
    requireAdmin(caller);
    aiLogs.toArray();
  };
};
