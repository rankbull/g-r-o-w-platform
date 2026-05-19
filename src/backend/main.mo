import Map "mo:core/Map";
import List "mo:core/List";
import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import MixinObjectStorage "mo:caffeineai-object-storage/Mixin";
import Common "types/common";
import NoteTypes "types/notes";
import AdminTypes "types/admin";
import ProfileMixin "mixins/profile-api";
import NotesMixin "mixins/notes-api";
import AdminMixin "mixins/admin-api";
import OpenAIMixin "mixins/openai-api";
import OutCall "mo:caffeineai-http-outcalls/outcall";
import Migration "migration";


(with migration = Migration.run)
actor {
  // ── Infrastructure ──────────────────────────────────────────────
  include MixinObjectStorage();
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // ── Counters / scalar state ──────────────────────────────────────
  let counters = {
    var nextNoteId : Nat = 1;
    var totalCreditsAwarded : Nat = 0;
    var nextActionId : Nat = 1;
  };

  // ── Collections ──────────────────────────────────────────────────
  let notes = Map.empty<Common.NoteId, NoteTypes.Note>();
  let userProfiles = Map.empty<Common.UserId, Common.UserProfile>();
  let userStatuses = Map.empty<Common.UserId, Common.AccountStatus>();
  let aiResults = Map.empty<Common.NoteId, NoteTypes.AIAnalysisResult>();
  let actionLog = List.empty<AdminTypes.AdminAction>();
  let aiLogs = List.empty<AdminTypes.AILogEntry>();

  // ── OpenAI key (admin-managed, single slot) ───────────────────────
  let openAIApiKey = { var value : ?Text = null };

  // ── HTTP outcalls transform (required by openai-client) ─────────────
  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  // ── Mixins ───────────────────────────────────────────────────────
  include ProfileMixin(accessControlState, notes, userProfiles, userStatuses, counters);
  include NotesMixin(accessControlState, notes, userProfiles, userStatuses, aiResults, aiLogs, counters);
  include AdminMixin(accessControlState, notes, userStatuses, actionLog, aiLogs, counters);
  include OpenAIMixin(accessControlState, notes, aiResults, aiLogs, openAIApiKey, transform);
};

