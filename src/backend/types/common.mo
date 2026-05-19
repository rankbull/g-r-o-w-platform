import Time "mo:core/Time";

module {
  public type UserId = Principal;
  public type NoteId = Nat;
  public type Timestamp = Int; // Time.now() returns Int (nanoseconds)

  public type UserRole = {
    #admin;
    #student;
    #guest;
  };

  public type AccountStatus = {
    #active;
    #suspended : { reason : Text; until : ?Timestamp };
    #banned : { reason : Text; adminPrincipal : UserId; timestamp : Timestamp };
  };
  public type UserProfile = {
    principal : UserId;
    name : Text;
    credits : Nat;
    totalUploads : Nat;
    totalEarned : Nat;
    joinedAt : Timestamp;
  };
};
