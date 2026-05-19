import Common "common";

module {
  public type WeeklyUploadPoint = {
    weekLabel : Text; // e.g. "2026-W20"
    count : Nat;
  };

  public type SubjectDownloadStat = {
    subject : Text;
    downloadCount : Nat;
  };

  public type TopContributor = {
    principal : Common.UserId;
    name : Text;
    totalUploads : Nat;
    totalEarned : Nat;
    avgAIScore : ?Nat;
  };

  public type AnalyticsData = {
    weeklyUploads : [WeeklyUploadPoint];
    downloadsPerSubject : [SubjectDownloadStat];
    topContributors : [TopContributor];
    totalNotes : Nat;
    totalUsers : Nat;
    totalDownloads : Nat;
    totalCreditsAwarded : Nat;
    flaggedNotes : Nat;
    removedNotes : Nat;
  };
};
