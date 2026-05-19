import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, Download, FileText, Star, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { LocalNote } from "../context/AppContext";
import { useAppContext } from "../context/AppContext";
import { useSound } from "../hooks/useSound";
import SoundButton from "./SoundButton";

const SUBJECTS = [
  "All",
  "Math",
  "Science",
  "English",
  "History",
  "Computer Science",
  "Other",
];

const subjectColors: Record<string, string> = {
  Math: "bg-secondary/10 text-secondary border-secondary/30",
  Science: "bg-accent/10 text-accent border-accent/30",
  History: "bg-chart-4/10 text-chart-4 border-chart-4/30",
  English: "bg-chart-5/10 text-chart-5 border-chart-5/30",
  "Computer Science": "bg-primary/10 text-primary border-primary/30",
  Other: "bg-muted text-muted-foreground border-border",
};

function triggerFileDownload(note: LocalNote) {
  const stars =
    "★".repeat(note.qualityStars) + "☆".repeat(5 - note.qualityStars);
  const content = [
    "================================================================",
    "  G.R.O.W — GLOBAL RESOURCE OF ONLINE WISDOM",
    "================================================================",
    "",
    `Title   : ${note.title}`,
    `Subject : ${note.subject}`,
    `Author  : ${note.uploaderName}`,
    `Quality : ${stars} (${note.qualityStars}/5)`,
    "",
    "----------------------------------------------------------------",
    "DESCRIPTION",
    "----------------------------------------------------------------",
    `${note.description}`,
    "",
    "----------------------------------------------------------------",
    "STUDY NOTES",
    "----------------------------------------------------------------",
    "",
    "These notes were shared by a fellow student on the G.R.O.W",
    "platform. Use them to supplement your own learning.",
    "",
    "Key Topics Covered:",
    "  • Core concepts and fundamentals",
    "  • Step-by-step explanations",
    "  • Practice examples and worked problems",
    "  • Summary and revision tips",
    "",
    "================================================================",
    "Downloaded from G.R.O.W Platform",
    "================================================================",
  ].join("\n");

  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${note.title.replace(/[^a-z0-9]/gi, "_")}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function NoteCard({ note, index }: { note: LocalNote; index: number }) {
  const { downloadNote, user } = useAppContext();
  const { playClick, playError } = useSound();

  const handleDownload = () => {
    if (!user) {
      playError();
      toast.error("Please login to download notes.");
      return;
    }
    const ok = downloadNote(note.id);
    if (ok) {
      playClick();
      triggerFileDownload(note);
      toast.success(
        `Downloaded "${note.title}"!${note.price > 0 ? ` -${note.price} credits` : " Free!"}`,
      );
    } else {
      playError();
      toast.error("Not enough credits to download this note.");
    }
  };

  const subjectColor = subjectColors[note.subject] ?? subjectColors.Other;

  return (
    <article
      data-ocid={`browse.note.card.${index + 1}`}
      className="bg-card border border-border rounded-2xl p-5 holo-card grow-card-hover flex flex-col gap-3 transition-all duration-300 hover:border-primary/40"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 flex-shrink-0">
          <FileText size={18} className="text-primary" />
        </div>
        <div className="flex flex-col items-end gap-1">
          <Badge
            variant="outline"
            className={`text-xs font-mono font-semibold border ${subjectColor}`}
          >
            {note.subject}
          </Badge>
          {note.aiScore !== undefined && note.aiScore !== null && (
            <div
              data-ocid={`browse.note.ai_score.${index + 1}`}
              className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-mono font-bold border ${
                Number(note.aiScore) >= 75
                  ? "bg-accent/10 border-accent/30 text-accent"
                  : Number(note.aiScore) >= 50
                    ? "bg-chart-4/10 border-chart-4/30 text-chart-4"
                    : "bg-destructive/10 border-destructive/30 text-destructive"
              }`}
            >
              <Bot size={9} />
              {Number(note.aiScore)}
            </div>
          )}
        </div>
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
      <div className="space-y-1.5 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <User size={11} />
          <span>{note.uploaderName}</span>
        </div>
        <div className="flex items-center gap-1">
          {[0, 1, 2, 3, 4].map((sn) => (
            <Star
              key={sn}
              size={11}
              className={
                sn < note.qualityStars
                  ? "text-chart-4 fill-chart-4"
                  : "text-muted"
              }
            />
          ))}
          <span className="ml-1 font-mono">{note.qualityStars}/5</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Download size={11} />
          <span>{note.downloadCount} downloads</span>
        </div>
      </div>
      <div className="flex items-center justify-between pt-1 border-t border-border/50">
        <div className="flex items-center gap-1 font-mono text-sm font-bold text-accent">
          {note.price === 0 ? (
            <span className="neon-text-green text-xs">FREE</span>
          ) : (
            <span>{note.price} credits</span>
          )}
        </div>
        <SoundButton
          size="sm"
          onClick={handleDownload}
          data-ocid={`browse.note.download_button.${index + 1}`}
          className="text-xs font-mono"
        >
          <Download size={12} className="mr-1" />
          Download
        </SoundButton>
      </div>
    </article>
  );
}

export default function BrowseNotes() {
  const [subject, setSubject] = useState("All");
  const { notes } = useAppContext();
  const { playTabSwitch } = useSound();

  const filtered =
    subject === "All" ? notes : notes.filter((n) => n.subject === subject);

  return (
    <section id="browse" className="py-24 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, oklch(0.78 0.18 200 / 0.04) 0%, transparent 70%)",
        }}
      />
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-sm font-mono font-semibold text-primary uppercase tracking-widest mb-3">
            ✦ MARKETPLACE
          </p>
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-foreground">
            Browse <span className="neon-text-cyan">Notes</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Discover premium study materials from top students worldwide
          </p>
        </div>
        <div className="flex justify-center mb-10">
          <Tabs
            value={subject}
            onValueChange={(v) => {
              setSubject(v);
              playTabSwitch();
            }}
          >
            <TabsList className="bg-muted/40 border border-border flex-wrap h-auto gap-1 p-1">
              {SUBJECTS.map((s) => (
                <TabsTrigger
                  key={s}
                  value={s}
                  data-ocid={`browse.${s.toLowerCase().replace(" ", "-")}.tab`}
                  className="font-mono text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  {s}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
        {filtered.length === 0 ? (
          <div
            data-ocid="browse.notes.empty_state"
            className="text-center py-20"
          >
            <FileText
              size={40}
              className="mx-auto text-muted-foreground mb-4"
            />
            <p className="text-muted-foreground font-mono">
              No notes found for this subject yet.
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Be the first to upload!
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((note, i) => (
              <NoteCard key={note.id} note={note} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
