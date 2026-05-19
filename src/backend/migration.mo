import Map "mo:core/Map";
import Time "mo:core/Time";

module {
  // ── Old types (inlined from .old/src/backend/main.mo) ─────────────────
  type OldNote = {
    id : Nat;
    title : Text;
    subject : Text;
    description : Text;
    uploaderPrincipal : Principal;
    uploaderName : Text;
    qualityStars : Nat;
    creditsAwarded : Nat;
    downloadCount : Nat;
    timestamp : Int;
    fileId : Text;
    price : Nat;
  };

  type OldUserProfile = {
    principal : Principal;
    credits : Nat;
    totalUploads : Nat;
    totalEarned : Nat;
  };

  // ── New types (matching new actor fields) ─────────────────────────────
  type NewNote = {
    id : Nat;
    title : Text;
    subject : Text;
    description : Text;
    uploaderPrincipal : Principal;
    uploaderName : Text;
    qualityStars : Nat;
    creditsAwarded : Nat;
    downloadCount : Nat;
    timestamp : Int;
    fileRef : Text;
    price : Nat;
    aiScore : ?Nat;
    isFlagged : Bool;
    isRemoved : Bool;
  };

  type NewUserProfile = {
    principal : Principal;
    name : Text;
    credits : Nat;
    totalUploads : Nat;
    totalEarned : Nat;
    joinedAt : Int;
  };

  // ── OldActor: stable fields from previous deployment ─────────────────
  type OldActor = {
    notes : Map.Map<Nat, OldNote>;
    userProfiles : Map.Map<Principal, OldUserProfile>;
    var nextNoteId : Nat;
    var totalCreditsAwarded : Nat;
  };

  // ── NewActor: stable fields expected by new actor ─────────────────────
  type NewActor = {
    notes : Map.Map<Nat, NewNote>;
    userProfiles : Map.Map<Principal, NewUserProfile>;
    counters : { var nextNoteId : Nat; var totalCreditsAwarded : Nat; var nextActionId : Nat };
  };

  public func run(old : OldActor) : NewActor {
    // Migrate notes: add new fields with safe defaults
    let newNotes = old.notes.map<Nat, OldNote, NewNote>(
      func(_id, n) {
        {
          id = n.id;
          title = n.title;
          subject = n.subject;
          description = n.description;
          uploaderPrincipal = n.uploaderPrincipal;
          uploaderName = n.uploaderName;
          qualityStars = n.qualityStars;
          creditsAwarded = n.creditsAwarded;
          downloadCount = n.downloadCount;
          timestamp = n.timestamp;
          fileRef = n.fileId; // rename fileId → fileRef
          price = n.price;
          aiScore = null;
          isFlagged = false;
          isRemoved = false;
        };
      }
    );

    // Migrate user profiles: add name and joinedAt fields
    let newUserProfiles = old.userProfiles.map<Principal, OldUserProfile, NewUserProfile>(
      func(_p, u) {
        {
          principal = u.principal;
          name = "";
          credits = u.credits;
          totalUploads = u.totalUploads;
          totalEarned = u.totalEarned;
          joinedAt = Time.now();
        };
      }
    );

    {
      notes = newNotes;
      userProfiles = newUserProfiles;
      counters = {
        var nextNoteId = old.nextNoteId;
        var totalCreditsAwarded = old.totalCreditsAwarded;
        var nextActionId = 1;
      };
    };
  };
};
