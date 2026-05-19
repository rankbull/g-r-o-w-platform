import Map "mo:core/Map";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import NoteTypes "../types/notes";
import Common "../types/common";

mixin (
  accessControlState : AccessControl.AccessControlState,
  notes : Map.Map<Common.NoteId, NoteTypes.Note>,
  userProfiles : Map.Map<Common.UserId, Common.UserProfile>,
  userStatuses : Map.Map<Common.UserId, Common.AccountStatus>,
  counters : { var nextNoteId : Nat; var totalCreditsAwarded : Nat; var nextActionId : Nat },
) {
  public query ({ caller }) func getCallerUserProfile() : async ?Common.UserProfile {
    userProfiles.get(caller);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : Common.UserProfile) : async () {
    // Sanitize: ensure principal matches caller, preserve joinedAt if already set
    let existing = userProfiles.get(caller);
    let joinedAt = switch (existing) {
      case (?p) p.joinedAt;
      case null profile.joinedAt;
    };
    userProfiles.add(caller, { profile with principal = caller; joinedAt });
  };

  public query ({ caller }) func getUserProfile(user : Common.UserId) : async ?Common.UserProfile {
    ignore caller;
    userProfiles.get(user);
  };

  public query ({ caller }) func getLeaderboard() : async [Common.UserProfile] {
    ignore caller;
    let all = userProfiles.toArray();
    let profiles = all.map(func((_, p)) { p });
    let sorted = profiles.sort(func(a, b) {
      if (a.credits > b.credits) #less
      else if (a.credits < b.credits) #greater
      else #equal;
    });
    let limit = if (sorted.size() < 10) sorted.size() else 10;
    Array.tabulate<Common.UserProfile>(limit, func(i) { sorted[i] });
  };

  public query ({ caller }) func getMyCredits() : async Nat {
    switch (userProfiles.get(caller)) {
      case (?p) p.credits;
      case null 0;
    };
  };

  public shared ({ caller }) func addCredits(user : Common.UserId, amount : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Admin access required");
    };
    switch (userProfiles.get(user)) {
      case (?p) {
        userProfiles.add(user, { p with credits = p.credits + amount });
        counters.totalCreditsAwarded += amount;
      };
      case null {};
    };
  };

  public query ({ caller }) func getPlatformStats() : async {
    totalUploads : Nat;
    totalCreditsAwarded : Nat;
    totalDownloads : Nat;
  } {
    ignore caller;
    var totalDownloads : Nat = 0;
    notes.forEach(func(_, note) {
      totalDownloads += note.downloadCount;
    });
    {
      totalUploads = notes.size();
      totalCreditsAwarded = counters.totalCreditsAwarded;
      totalDownloads;
    };
  };
};
