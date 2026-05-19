import Common "common";

module {
  public type AdminActionKind = {
    #banUser;
    #suspendUser;
    #unsuspendUser;
    #unbanUser;
    #flagNote;
    #removeNote;
    #setOpenAIKey;
    #updateQuality;
  };

  public type AdminActionTarget = {
    #user : Common.UserId;
    #note : Common.NoteId;
    #systemAction;
  };

  public type AdminAction = {
    id : Nat;
    kind : AdminActionKind;
    target : AdminActionTarget;
    reason : Text;
    adminPrincipal : Common.UserId;
    timestamp : Common.Timestamp;
  };

  public type ModerationItem = {
    noteId : Common.NoteId;
    noteTitle : Text;
    uploaderPrincipal : Common.UserId;
    flagReason : Text;
    flaggedAt : Common.Timestamp;
    aiFlags : [Text];
  };

  public type AILogEntry = {
    noteId : Common.NoteId;
    score : Nat;
    flags : [Text];
    similarNoteId : ?Common.NoteId;
    similarityPercent : ?Nat;
    timestamp : Common.Timestamp;
  };

  public type UserAdminView = {
    principal : Common.UserId;
    name : Text;
    credits : Nat;
    totalUploads : Nat;
    totalEarned : Nat;
    status : Common.AccountStatus;
    joinedAt : Common.Timestamp;
  };
};
