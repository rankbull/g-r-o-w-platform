import Debug "mo:core/Debug";
import Common "common";

module {
  public type Note = {
    id : Common.NoteId;
    title : Text;
    subject : Text;
    description : Text;
    uploaderPrincipal : Common.UserId;
    uploaderName : Text;
    qualityStars : Nat;
    creditsAwarded : Nat;
    downloadCount : Nat;
    timestamp : Common.Timestamp;
    fileRef : Text;
    price : Nat;
    aiScore : ?Nat;
    isFlagged : Bool;
    isRemoved : Bool;
  };

  public type NoteInput = {
    title : Text;
    subject : Text;
    description : Text;
    uploaderName : Text;
    fileRef : Text;
    price : Nat;
  };

  public type AIAnalysisResult = {
    noteId : Common.NoteId;
    score : Nat; // 0-100
    flags : [Text]; // e.g. ["low_quality", "possible_duplicate"]
    suggestedTitle : Text;
    suggestedTags : [Text];
    similarNoteId : ?Common.NoteId;
    similarityPercent : ?Nat;
    timestamp : Common.Timestamp;
  };
};
