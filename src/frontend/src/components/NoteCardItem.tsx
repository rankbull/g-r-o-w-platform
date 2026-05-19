import { Badge } from "@/components/ui/badge";
import { FileText, User } from "lucide-react";
import type { Note } from "../backend.d";

interface NoteCardItemProps {
  note: Note;
  index: number;
}

export default function NoteCardItem({ note, index }: NoteCardItemProps) {
  return (
    <article
      data-ocid={`browse.note.card.${index + 1}`}
      className="bg-card border border-border rounded-xl p-5 holo-card grow-card-hover flex flex-col gap-3 transition-all duration-300 hover:border-primary/50"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10">
          <FileText size={16} className="text-primary" />
        </div>
        <Badge variant="outline" className="text-xs font-mono">
          {note.subject}
        </Badge>
      </div>
      <div>
        <h3 className="font-display font-bold text-foreground text-base leading-snug line-clamp-2">
          {note.title}
        </h3>
        {note.description && (
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {note.description}
          </p>
        )}
      </div>
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <User size={11} />
        <span>{note.uploaderName}</span>
      </div>
    </article>
  );
}
