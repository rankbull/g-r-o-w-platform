import Map "mo:core/Map";
import List "mo:core/List";
import Debug "mo:core/Debug";
import Types "../types/notes";
import Common "../types/common";
import Time "mo:core/Time";

module {
  // ---------- note CRUD ----------

  public func newNote(
    id : Common.NoteId,
    input : Types.NoteInput,
    caller : Common.UserId,
  ) : Types.Note {
    let credits = if (input.price > 0) 0 else 30; // free notes award 30 base credits
    {
      id;
      title = input.title;
      subject = input.subject;
      description = input.description;
      uploaderPrincipal = caller;
      uploaderName = input.uploaderName;
      qualityStars = 3;
      creditsAwarded = credits;
      downloadCount = 0;
      timestamp = Time.now();
      fileRef = input.fileRef;
      price = input.price;
      aiScore = null;
      isFlagged = false;
      isRemoved = false;
    };
  };

  public func flagNote(
    notes : Map.Map<Common.NoteId, Types.Note>,
    noteId : Common.NoteId,
    _reason : Text,
  ) : () {
    switch (notes.get(noteId)) {
      case (?note) {
        notes.add(noteId, { note with isFlagged = true });
      };
      case null {};
    };
  };

  public func removeNote(
    notes : Map.Map<Common.NoteId, Types.Note>,
    noteId : Common.NoteId,
  ) : () {
    switch (notes.get(noteId)) {
      case (?note) {
        notes.add(noteId, { note with isRemoved = true });
      };
      case null {};
    };
  };

  // ---------- AI score ----------

  public func applyAIScore(
    notes : Map.Map<Common.NoteId, Types.Note>,
    noteId : Common.NoteId,
    score : Nat,
  ) : () {
    switch (notes.get(noteId)) {
      case (?note) {
        notes.add(noteId, { note with aiScore = ?score });
      };
      case null {};
    };
  };

  // ---------- deduplication ----------

  /// Returns (similarNoteId, similarityPercent) if a near-duplicate is found.
  /// Returns (similarNoteId, similarityPercent) if a near-duplicate is found.
  /// Uses word-overlap heuristic — threshold 80%.
  public func findSimilar(
    notes : Map.Map<Common.NoteId, Types.Note>,
    title : Text,
    description : Text,
  ) : ?(Common.NoteId, Nat) {
    let queryText = (title.toLower() # " " # description.toLower());
    let queryWords = queryText.split(#char ' ').filter(func(w) { w.size() > 2 });
    let queryArr = queryWords.toArray();
    let querySize = queryArr.size();
    if (querySize == 0) { return null };

    var bestId : ?Common.NoteId = null;
    var bestPct : Nat = 0;

    for ((id, note) in notes.entries()) {
      if (not note.isRemoved) {
        let noteText = (note.title.toLower() # " " # note.description.toLower());
        let noteWords = noteText.split(#char ' ').filter(func(w) { w.size() > 2 });
        let noteArr = noteWords.toArray();
        let noteSize = noteArr.size();

        // count overlap
        var overlap = 0;
        for (qw in queryArr.values()) {
          let found = noteArr.find(func(nw : Text) : Bool { nw == qw });
          switch (found) {
            case (?_) { overlap += 1 };
            case null {};
          };
        };

        let denom = if (querySize > noteSize) { querySize } else { noteSize };
        let pct = if (denom == 0) { 0 } else { (overlap * 100) / denom };
        if (pct > bestPct) {
          bestPct := pct;
          bestId := ?id;
        };
      };
    };

    switch (bestId) {
      case (?id) {
        if (bestPct >= 80) { ?(id, bestPct) } else { null };
      };
      case null null;
    };
  };

  // ---------- read helpers ----------

  public func getModerationQueue(
    notes : Map.Map<Common.NoteId, Types.Note>,
  ) : [Types.Note] {
    Iter.toArray(Iter.filter(notes.values(), func(n : Types.Note) : Bool {
      n.isFlagged and not n.isRemoved
    }));
  };
};
