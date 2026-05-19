import { Star, TrendingUp } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { LocalNote } from "../context/AppContext";
import { useAppContext } from "../context/AppContext";
import { useScrollReveal } from "../hooks/useScrollReveal";

function timeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  if (diff < 60000) return `${Math.floor(diff / 1000)}s ago`;
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
}

const AVATAR_COLORS = [
  "bg-primary/20 text-primary",
  "bg-secondary/20 text-secondary",
  "bg-accent/20 text-accent",
  "bg-chart-4/20 text-chart-4",
  "bg-chart-5/20 text-chart-5",
];

const SUBJECT_COLORS: Record<string, string> = {
  Math: "text-secondary",
  Science: "text-accent",
  History: "text-chart-4",
  English: "text-chart-5",
  "Computer Science": "text-primary",
  Other: "text-muted-foreground",
};

const MOCK_NEW_UPLOADS: Omit<LocalNote, "id" | "timestamp">[] = [
  {
    title: "Differential Equations Cheat Sheet",
    uploaderName: "Ravi S.",
    subject: "Math",
    qualityStars: 4,
    creditsAwarded: 70,
    downloadCount: 0,
    price: 5,
    description: "",
    fileId: "",
  },
  {
    title: "Network Protocols Deep Dive",
    uploaderName: "Zeynep A.",
    subject: "Computer Science",
    qualityStars: 5,
    creditsAwarded: 90,
    downloadCount: 0,
    price: 10,
    description: "",
    fileId: "",
  },
  {
    title: "The French Revolution Notes",
    uploaderName: "Hugo B.",
    subject: "History",
    qualityStars: 3,
    creditsAwarded: 50,
    downloadCount: 0,
    price: 0,
    description: "",
    fileId: "",
  },
  {
    title: "Electromagnetic Waves Summary",
    uploaderName: "Aisha M.",
    subject: "Science",
    qualityStars: 4,
    creditsAwarded: 70,
    downloadCount: 0,
    price: 5,
    description: "",
    fileId: "",
  },
  {
    title: "Python Algorithms Cookbook",
    uploaderName: "Luca R.",
    subject: "Computer Science",
    qualityStars: 5,
    creditsAwarded: 100,
    downloadCount: 0,
    price: 15,
    description: "",
    fileId: "",
  },
];

const STAR_INDICES = [0, 1, 2, 3, 4];

function FeedItem({
  note,
  isNew,
  index,
}: { note: LocalNote; isNew: boolean; index: number }) {
  const avatarColor = AVATAR_COLORS[index % AVATAR_COLORS.length];
  const subjectColor = SUBJECT_COLORS[note.subject] ?? SUBJECT_COLORS.Other;
  const starCount = Math.min(note.qualityStars, 5);
  return (
    <div
      data-ocid={`feed.upload.item.${index + 1}`}
      className={`flex items-center gap-4 bg-card border border-border rounded-xl p-4 transition-all duration-300 hover:border-primary/30 ${isNew ? "slide-in-right border-primary/20" : ""}`}
      style={
        isNew
          ? { boxShadow: "0 0 20px oklch(0.78 0.18 200 / 0.15)" }
          : undefined
      }
    >
      <div
        className={`flex items-center justify-center w-10 h-10 rounded-xl font-mono font-bold text-sm flex-shrink-0 ${avatarColor}`}
      >
        {note.uploaderName.charAt(0).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-sm text-foreground truncate">
            {note.uploaderName}
          </span>
          <span className="text-xs text-muted-foreground">uploaded</span>
          <span className={`text-xs font-mono font-semibold ${subjectColor}`}>
            {note.subject}
          </span>
        </div>
        <p className="text-xs text-muted-foreground truncate mt-0.5">
          {note.title}
        </p>
      </div>
      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        {note.creditsAwarded > 0 && (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent/10 border border-accent/30">
            <span className="font-mono text-xs font-bold neon-text-green">
              +{note.creditsAwarded}
            </span>
          </div>
        )}
        {starCount > 0 && (
          <div className="flex items-center gap-0.5">
            {STAR_INDICES.slice(0, starCount).map((sn) => (
              <Star
                key={`star-${sn}`}
                size={8}
                className="text-chart-4 fill-chart-4"
              />
            ))}
          </div>
        )}
        <span className="font-mono text-[10px] text-muted-foreground">
          {timeAgo(note.timestamp)}
        </span>
      </div>
    </div>
  );
}

export default function LiveUploadFeed() {
  const ref = useScrollReveal<HTMLElement>();
  const { notes } = useAppContext();
  const [extraNotes, setExtraNotes] = useState<LocalNote[]>([]);
  const [newIds, setNewIds] = useState<Set<number>>(new Set());
  const [mockIdx, setMockIdx] = useState(0);

  const sortedNotes = useMemo(
    () => [...notes].sort((a, b) => b.timestamp - a.timestamp).slice(0, 10),
    [notes],
  );

  // Add a new mock entry every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const mock = MOCK_NEW_UPLOADS[mockIdx % MOCK_NEW_UPLOADS.length];
      const newNote: LocalNote = {
        ...mock,
        id: Date.now(),
        timestamp: Date.now(),
      };
      setExtraNotes((prev) => [newNote, ...prev.slice(0, 4)]);
      setNewIds(new Set([newNote.id]));
      setMockIdx((i) => i + 1);
      setTimeout(() => setNewIds(new Set()), 3000);
    }, 8000);
    return () => clearInterval(interval);
  }, [mockIdx]);

  const displayNotes = useMemo(() => {
    const combined = [...extraNotes, ...sortedNotes];
    const seen = new Set<number>();
    return combined
      .filter((n) => {
        if (seen.has(n.id)) return false;
        seen.add(n.id);
        return true;
      })
      .slice(0, 10);
  }, [extraNotes, sortedNotes]);

  return (
    <section
      id="live-feed"
      ref={ref}
      className="py-24 relative overflow-hidden"
      style={{ background: "oklch(0.10 0.018 265)" }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, oklch(0.72 0.22 155 / 0.06) 0%, transparent 60%)",
        }}
      />
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 scroll-reveal">
          <p className="text-sm font-mono font-semibold text-accent uppercase tracking-widest mb-3">
            ✦ LIVE FEED
          </p>
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-foreground">
            Recent <span className="neon-text-green">Uploads</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Watch students earn credits in real-time as they share their
            knowledge
          </p>
        </div>
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-4 scroll-reveal">
            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
              <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              Live — updates every 8 seconds
            </div>
            <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground">
              <TrendingUp size={12} />
              {displayNotes.length} recent uploads
            </div>
          </div>
          <div className="space-y-3">
            {displayNotes.map((note, i) => (
              <div
                key={note.id}
                className={`scroll-reveal scroll-reveal-delay-${Math.min(i + 1, 4)}`}
              >
                <FeedItem note={note} isNew={newIds.has(note.id)} index={i} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
