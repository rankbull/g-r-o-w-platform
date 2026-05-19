import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, Lock, Star, User } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useAppContext } from "../context/AppContext";
import { SUBJECTS } from "../data/subjectsData";

interface SubjectPreviewPageProps {
  subjectKey: string;
  onBack: () => void;
  onLoginRequired: () => void;
}

function StarRating({ stars }: { stars: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[0, 1, 2, 3, 4].map((i) => (
        <Star
          key={i}
          size={11}
          className={i < stars ? "text-chart-4 fill-chart-4" : "text-muted"}
        />
      ))}
    </div>
  );
}

export default function SubjectPreviewPage({
  subjectKey,
  onBack,
  onLoginRequired,
}: SubjectPreviewPageProps) {
  const { user } = useAppContext();
  const subject = SUBJECTS.find((s) => s.key === subjectKey);

  if (!subject) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground font-mono">Subject not found.</p>
      </div>
    );
  }

  const handleLoginCTA = () => {
    if (!user) {
      onLoginRequired();
    } else {
      // Scroll to browse section
      document.getElementById("browse")?.scrollIntoView({ behavior: "smooth" });
      onBack();
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={subjectKey}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.35 }}
        className="min-h-screen bg-background relative overflow-hidden"
      >
        {/* Background atmosphere */}
        <div
          className="fixed inset-0 pointer-events-none z-0"
          style={{
            background:
              "radial-gradient(ellipse at 20% 20%, oklch(0.6 0.28 300 / 0.07) 0%, transparent 55%), radial-gradient(ellipse at 80% 80%, oklch(0.78 0.18 200 / 0.07) 0%, transparent 55%)",
          }}
        />

        {/* Cyber grid */}
        <div
          className="fixed inset-0 pointer-events-none z-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(oklch(0.78 0.18 200) 1px, transparent 1px), linear-gradient(90deg, oklch(0.78 0.18 200) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative z-10 container mx-auto px-4 pt-24 pb-40">
          {/* Back button */}
          <motion.button
            type="button"
            data-ocid="subject_preview.back.button"
            onClick={onBack}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-2 text-sm font-mono text-muted-foreground hover:text-primary transition-colors mb-10 group"
          >
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Back to Home
          </motion.button>

          {/* Header */}
          <motion.div
            className="mb-14"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <div className="flex items-center gap-4 mb-4">
              <span className="text-6xl select-none">{subject.icon}</span>
              <div>
                <h1
                  className={`font-display text-4xl lg:text-6xl font-bold ${subject.color} leading-tight`}
                >
                  {subject.label}
                </h1>
                <p className="font-mono text-sm text-muted-foreground mt-1">
                  Preview — Login to unlock full access
                </p>
              </div>
            </div>
            <p className="text-muted-foreground max-w-2xl mt-3">
              {subject.description}
            </p>
            <div
              className={`mt-4 h-px w-full bg-gradient-to-r from-transparent via-current to-transparent ${subject.color} opacity-30`}
            />
          </motion.div>

          {/* Sample Notes Grid */}
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Lock size={18} className="text-muted-foreground" />
              Sample Notes
              <Badge
                variant="outline"
                className="font-mono text-xs border-border ml-2"
              >
                Preview Only
              </Badge>
            </h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {subject.sampleNotes.map((note, index) => (
                <motion.div
                  key={note.title}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + index * 0.07 }}
                  className={`relative bg-card border ${subject.borderColor} rounded-xl p-4 overflow-hidden`}
                >
                  {/* Preview blur overlay on the summary */}
                  <div className="mb-3">
                    <h3 className="font-display font-semibold text-sm text-foreground leading-snug mb-2">
                      {note.title}
                    </h3>
                    <div className="relative">
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                        {note.summary}
                      </p>
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-card/60 to-card/95 flex items-end pb-0.5">
                        <span className="font-mono text-[10px] text-muted-foreground/60 italic">
                          🔒 Login to read full notes
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border/40">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <User size={10} />
                      <span className="font-mono">{note.author}</span>
                    </div>
                    <StarRating stars={note.stars} />
                  </div>

                  {/* Preview badge */}
                  <div className="absolute top-2 right-2">
                    <span className="font-mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border">
                      Preview
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* External Resources */}
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <ExternalLink size={18} className="text-muted-foreground" />
              External Learning Resources
            </h2>

            <div className="grid sm:grid-cols-3 gap-4">
              {subject.externalResources.map((resource, index) => (
                <motion.a
                  key={resource.name}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 + index * 0.06 }}
                  whileHover={{ scale: 1.02 }}
                  data-ocid={`subject_preview.resource.link.${index + 1}`}
                  className={`group flex flex-col gap-2 bg-card border ${subject.borderColor} rounded-xl p-4 hover:bg-card/80 transition-all duration-200 cursor-pointer`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`font-display font-semibold text-sm ${subject.color}`}
                    >
                      {resource.name}
                    </span>
                    <ExternalLink
                      size={13}
                      className="text-muted-foreground group-hover:text-primary transition-colors"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {resource.description}
                  </p>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Sticky CTA Bar */}
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-t border-primary/20">
          <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <p className="font-display font-bold text-foreground text-sm">
                {user
                  ? `Welcome back, ${user.username}!`
                  : "Unlock the full study library"}
              </p>
              <p className="font-mono text-xs text-muted-foreground">
                {user
                  ? `You have ${user.credits} GROW credits — browse all ${subject.label} notes now.`
                  : `Get unlimited access to all ${subject.label} notes and more.`}
              </p>
            </div>
            <Button
              type="button"
              data-ocid="subject_preview.login.primary_button"
              onClick={handleLoginCTA}
              size="lg"
              className="glow-cyan font-mono text-sm whitespace-nowrap shrink-0"
            >
              {user
                ? `Browse Full ${subject.label} Notes →`
                : "Login to Access Full Notes"}
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
