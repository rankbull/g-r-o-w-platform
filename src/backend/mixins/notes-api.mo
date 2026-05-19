import Map "mo:core/Map";
import List "mo:core/List";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import NoteLib "../lib/notes";
import NoteTypes "../types/notes";
import AdminTypes "../types/admin";
import Common "../types/common";
import Iter "mo:core/Iter";
import Time "mo:core/Time";

mixin (
  accessControlState : AccessControl.AccessControlState,
  notes : Map.Map<Common.NoteId, NoteTypes.Note>,
  userProfiles : Map.Map<Common.UserId, Common.UserProfile>,
  userStatuses : Map.Map<Common.UserId, Common.AccountStatus>,
  aiResults : Map.Map<Common.NoteId, NoteTypes.AIAnalysisResult>,
  aiLogs : List.List<AdminTypes.AILogEntry>,
  counters : { var nextNoteId : Nat; var totalCreditsAwarded : Nat },
) {
  // ---------- private helpers ----------

  func isBlocked(user : Common.UserId) : Bool {
    switch (userStatuses.get(user)) {
      case (?(#banned _)) { true };
      case (?(#suspended _)) { true };
      case _ { false };
    };
  };

  func getOrCreateProfile(user : Common.UserId) : Common.UserProfile {
    switch (userProfiles.get(user)) {
      case (?p) { p };
      case null {
        let p : Common.UserProfile = {
          principal = user;
          name = "";
          credits = 0;
          totalUploads = 0;
          totalEarned = 0;
          joinedAt = Time.now();
        };
        p;
      };
    };
  };

  // ---------- uploads ----------

  public shared ({ caller }) func uploadNoteWithFile(input : NoteTypes.NoteInput) : async Common.NoteId {
    if (isBlocked(caller)) {
      Runtime.trap("Account is banned or suspended");
    };
    let noteId = counters.nextNoteId;
    counters.nextNoteId += 1;
    let note = NoteLib.newNote(noteId, input, caller);
    notes.add(noteId, note);
    // award credits to uploader
    let profile = getOrCreateProfile(caller);
    let awarded = note.creditsAwarded;
    userProfiles.add(caller, {
      profile with
      credits = profile.credits + awarded;
      totalUploads = profile.totalUploads + 1;
      totalEarned = profile.totalEarned + awarded;
    });
    counters.totalCreditsAwarded += awarded;
    noteId;
  };

  // ---------- downloads ----------

  public shared ({ caller }) func downloadNote(noteId : Common.NoteId) : async () {
    let minCost : Nat = 10;
    let profile = getOrCreateProfile(caller);
    if (profile.credits < minCost) {
      Runtime.trap("Insufficient credits — need at least 10");
    };
    switch (notes.get(noteId)) {
      case null { Runtime.trap("Note not found") };
      case (?note) {
        if (note.isRemoved) { Runtime.trap("Note not available") };
        notes.add(noteId, { note with downloadCount = note.downloadCount + 1 });
        let newCredits : Nat = if (profile.credits >= minCost) { profile.credits - minCost } else { 0 };
        userProfiles.add(caller, { profile with credits = newCredits });
      };
    };
  };

  // ---------- reads ----------

  public query func getNotes() : async [NoteTypes.Note] {
    let all = notes.values().toArray();
    all.filter<NoteTypes.Note>(func(n) { not n.isRemoved });
  };

  public query func getNote(noteId : Common.NoteId) : async ?NoteTypes.Note {
    switch (notes.get(noteId)) {
      case (?note) {
        if (note.isRemoved) { null } else { ?note };
      };
      case null { null };
    };
  };

  public query func getRecentUploads(limit : Nat) : async [NoteTypes.Note] {
    let all = notes.values().toArray().filter(func(n) { not n.isRemoved });
    let sorted = all.sort(func(a, b) {
      if (a.timestamp > b.timestamp) { #less }
      else if (a.timestamp < b.timestamp) { #greater }
      else { #equal };
    });
    let cap = if (limit < sorted.size()) { limit } else { sorted.size() };
    Array.tabulate<NoteTypes.Note>(cap, func(i) { sorted[i] });
  };

  // ---------- quality ----------

  public shared ({ caller }) func updateQuality(noteId : Common.NoteId, stars : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Admin only");
    };
    switch (notes.get(noteId)) {
      case null { Runtime.trap("Note not found") };
      case (?note) {
        let newCredits = stars * 10;
        notes.add(noteId, { note with qualityStars = stars; creditsAwarded = newCredits });
      };
    };
  };
};
