import OutCall "mo:caffeineai-http-outcalls/outcall";
import NoteTypes "../types/notes";
import Common "../types/common";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Text "mo:core/Text";

module {
  let OPENAI_URL = "https://api.openai.com/v1/chat/completions";

  public func configForKey(key : Text) : Text {
    key;
  };

  /// Analyze a note and return a quality score 0-100, flags, and suggestions.
  public func analyzeNote(
    apiKey : Text,
    transform : OutCall.Transform,
    noteId : Common.NoteId,
    title : Text,
    description : Text,
    subject : Text,
  ) : async* NoteTypes.AIAnalysisResult {
    let prompt = "You are an academic note quality evaluator for the G.R.O.W platform.\n\n" #
      "Evaluate the following student note and respond with JSON only (no markdown, no extra text).\n" #
      "Fields required:\n" #
      "- score: integer 0-100 (overall quality)\n" #
      "- flags: array of strings (e.g. ['low_quality','possible_duplicate','incomplete'])\n" #
      "- suggestedTitle: improved title string\n" #
      "- suggestedTags: array of 3-5 tag strings\n\n" #
      "Note subject: " # subject # "\n" #
      "Note title: " # title # "\n" #
      "Note description: " # description;

    let body = "{\"model\":\"gpt-4o-mini\",\"messages\":[{\"role\":\"user\",\"content\":" # jsonString(prompt) # "}]}";
    let headers : [OutCall.Header] = [
      { name = "Authorization"; value = "Bearer " # apiKey },
      { name = "Content-Type"; value = "application/json" },
    ];
    let rawResp = await OutCall.httpPostRequest(OPENAI_URL, headers, body, transform);
    let rawText = extractChoiceContent(rawResp);

    let score = extractNatField(rawText, "score");
    let flags = extractStringArray(rawText, "flags");
    let suggestedTitle = extractStringField(rawText, "suggestedTitle");
    let suggestedTags = extractStringArray(rawText, "suggestedTags");

    {
      noteId;
      score;
      flags;
      suggestedTitle;
      suggestedTags;
      similarNoteId = null;
      similarityPercent = null;
      timestamp = Time.now();
    };
  };

  /// Compute rough similarity between two texts (0-100).
  public func computeSimilarity(
    apiKey : Text,
    transform : OutCall.Transform,
    textA : Text,
    textB : Text,
  ) : async* Nat {
    let prompt = "Rate the semantic similarity between these two academic note descriptions on a scale of 0 to 100. " #
      "Reply with a single integer only, nothing else.\n\n" #
      "Text A: " # textA # "\n\n" #
      "Text B: " # textB;
    let body = "{\"model\":\"gpt-4o-mini\",\"messages\":[{\"role\":\"user\",\"content\":" # jsonString(prompt) # "}]}";
    let headers : [OutCall.Header] = [
      { name = "Authorization"; value = "Bearer " # apiKey },
      { name = "Content-Type"; value = "application/json" },
    ];
    let rawResp = await OutCall.httpPostRequest(OPENAI_URL, headers, body, transform);
    let rawText = extractChoiceContent(rawResp).trim(#char ' ').trim(#char '\n');
    switch (Nat.fromText(rawText)) {
      case (?n) { if (n > 100) { 100 } else { n } };
      case null 0;
    };
  };

  // ── private JSON helpers ──────────────────────────────────────────────

  /// Escape a Text value so it can be safely embedded in a JSON string literal.
  func jsonString(t : Text) : Text {
    var out = "\"";
    for (c in t.toIter()) {
      if (c == '\\') {
        out #= "\\\\";
      } else if (c == '\"') {
        out #= "\\\"";
      } else if (c == '\n') {
        out #= "\\n";
      } else if (c == '\r') {
        out #= "\\r";
      } else if (c == '\t') {
        out #= "\\t";
      } else {
        out #= Text.fromChar(c);
      };
    };
    out # "\"";
  };

  /// Extract choices[0].message.content from an OpenAI JSON response.
  func extractChoiceContent(json : Text) : Text {
    // Find "content" field inside the choices array
    switch (findAfter(json, "\"content\"")) {
      case null "";
      case (?rest) {
        let afterColon = switch (findAfter(rest, ":")) {
          case null { return "" };
          case (?s) s;
        };
        let trimmed = afterColon.trim(#char ' ').trim(#char '\n');
        // Check if value is a JSON string (starts with quote)
        if (trimmed.startsWith(#text "\"")) {
          let afterOpen = switch (findAfter(trimmed, "\"")) {
            case null { return "" };
            case (?s) s;
          };
          var result = "";
          var closed = false;
          var escaped = false;
          for (c in afterOpen.toIter()) {
            if (not closed) {
              if (escaped) {
                result #= Text.fromChar(c);
                escaped := false;
              } else if (c == '\\') {
                escaped := true;
              } else if (c == '\"') {
                closed := true;
              } else {
                result #= Text.fromChar(c);
              };
            };
          };
          result;
        } else {
          // Not a string — return as-is for numeric/bool
          var result = "";
          for (c in trimmed.toIter()) {
            if (c != ',' and c != '}' and c != ']') {
              result #= Text.fromChar(c);
            };
          };
          result.trim(#char ' ');
        };
      };
    };
  };

  // ── private JSON parse helpers ────────────────────────────────────────

  func extractNatField(json : Text, field : Text) : Nat {
    let needle = "\"" # field # "\"";
    switch (findAfter(json, needle)) {
      case null 50;
      case (?rest) {
        // skip whitespace, colon, whitespace to reach the digits
        let afterColon = switch (findAfter(rest, ":")) {
          case null { return 50 };
          case (?s) s;
        };
        var numStr = "";
        var started = false;
        for (c in afterColon.toIter()) {
          if (c >= '0' and c <= '9') {
            started := true;
            numStr #= Text.fromChar(c);
          } else if (started) {
            // stop at first non-digit after we started collecting
          };
        };
        switch (Nat.fromText(numStr)) {
          case (?n) { if (n > 100) { 100 } else { n } };
          case null 50;
        };
      };
    };
  };

  func extractStringField(json : Text, field : Text) : Text {
    let needle = "\"" # field # "\"";
    switch (findAfter(json, needle)) {
      case null "";
      case (?rest) {
        // find first quote after colon
        let afterColon = switch (findAfter(rest, ":")) {
          case null { return "" };
          case (?s) s;
        };
        let afterOpen = switch (findAfter(afterColon, "\"")) {
          case null { return "" };
          case (?s) s;
        };
        // collect chars until closing quote
        var result = "";
        var closed = false;
        for (c in afterOpen.toIter()) {
          if (not closed) {
            if (c == '\"') {
              closed := true;
            } else {
              result #= Text.fromChar(c);
            };
          };
        };
        result;
      };
    };
  };

  func extractStringArray(json : Text, field : Text) : [Text] {
    let needle = "\"" # field # "\"";
    switch (findAfter(json, needle)) {
      case null [];
      case (?rest) {
        let afterOpen = switch (findAfter(rest, "[")) {
          case null { return [] };
          case (?s) s;
        };
        // collect everything until ]
        var inside = "";
        var closed = false;
        for (c in afterOpen.toIter()) {
          if (not closed) {
            if (c == ']') { closed := true } else { inside #= Text.fromChar(c) };
          };
        };
        // split by comma, extract quoted values
        let items = inside.split(#char ',');
        items.filterMap<Text, Text>(func(item : Text) {
          let t = item.trim(#char ' ').trim(#char '\n').trim(#char '\r');
          // strip surrounding quotes
          if (t.startsWith(#text "\"") and t.size() > 1) {
            let inner = Text.fromIter(t.toIter().drop(1).take(t.size() - 2));
            ?inner
          } else if (not t.isEmpty()) {
            ?t
          } else {
            null
          };
        }).toArray();
      };
    };
  };

  /// Find the text after the first occurrence of needle in haystack.
  func findAfter(haystack : Text, needle : Text) : ?Text {
    let needleSize = needle.size();
    let haySize = haystack.size();
    if (needleSize == 0 or needleSize > haySize) { return null };
    let chars = haystack.toArray();
    let needleChars = needle.toArray();
    let limit = haySize - needleSize;
    var i = 0;
    label search while (i <= limit) {
      var match = true;
      var j = 0;
      while (j < needleSize) {
        if (chars[i + j] != needleChars[j]) { match := false };
        j += 1;
      };
      if (match) {
        return ?Text.fromIter(chars.values().drop(i + needleSize));
      };
      i += 1;
    };
    null;
  };
};
