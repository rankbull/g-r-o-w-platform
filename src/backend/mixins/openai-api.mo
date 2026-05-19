import Map "mo:core/Map";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import AccessControl "mo:caffeineai-authorization/access-control";
import OpenAILib "../lib/openai";
import NoteTypes "../types/notes";
import AdminTypes "../types/admin";
import Common "../types/common";
import OutCall "mo:caffeineai-http-outcalls/outcall";

mixin (
  accessControlState : AccessControl.AccessControlState,
  notes : Map.Map<Common.NoteId, NoteTypes.Note>,
  aiResults : Map.Map<Common.NoteId, NoteTypes.AIAnalysisResult>,
  aiLogs : List.List<AdminTypes.AILogEntry>,
  openAIApiKey : { var value : ?Text },
  transform : OutCall.Transform,
) {
  // ---------- configuration (admin only) ----------

  public shared ({ caller }) func setOpenAIKey(key : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Admin access required");
    };
    openAIApiKey.value := ?key;
  };

  public query ({ caller }) func getOpenAIKey() : async Bool {
    // Returns Bool (whether configured) — NEVER the key itself
    ignore caller;
    openAIApiKey.value != null;
  };

  // ---------- analysis ----------

  public shared ({ caller }) func analyzeNoteQuality(noteId : Common.NoteId) : async NoteTypes.AIAnalysisResult {
    ignore caller;
    let key = switch (openAIApiKey.value) {
      case (?k) k;
      case null Runtime.trap("OpenAI API key not configured");
    };
    let note = switch (notes.get(noteId)) {
      case (?n) n;
      case null Runtime.trap("Note not found");
    };
    let result = await* OpenAILib.analyzeNote(key, transform, noteId, note.title, note.description, note.subject);
    aiResults.add(noteId, result);
    let logEntry : AdminTypes.AILogEntry = {
      noteId;
      score = result.score;
      flags = result.flags;
      similarNoteId = result.similarNoteId;
      similarityPercent = result.similarityPercent;
      timestamp = Time.now();
    };
    aiLogs.add(logEntry);
    result;
  };

  public query ({ caller }) func getAIAnalysisResult(noteId : Common.NoteId) : async ?NoteTypes.AIAnalysisResult {
    ignore caller;
    aiResults.get(noteId);
  };
};
