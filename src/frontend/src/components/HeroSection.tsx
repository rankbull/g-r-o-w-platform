import { ArrowRight, BookOpen, Coins, Download, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import SoundButton from "./SoundButton";

function useCountUp(target: number, duration = 1400) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (target === 0) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setValue(target);
        clearInterval(timer);
      } else setValue(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return value;
}

export default function HeroSection() {
  const { notes } = useAppContext();
  const totalUploads = useCountUp(notes.length + 1229);
  const totalStudents = useCountUp(8432);
  const totalCredits = useCountUp(
    notes.reduce((a, n) => a + n.creditsAwarded, 0) + 90000,
  );

  const recentActivity = [
    "Sarah K. uploaded Data Structures Guide",
    "Calculus II Notes — +90 GROW Credits",
    "Machine Learning Fundamentals — 55 downloads",
    "Organic Chemistry Reactions — 5★ rated",
  ];

  const subjectStats = [
    { label: "CS", pct: 78, color: "oklch(0.78 0.18 200)" },
    { label: "Math", pct: 55, color: "oklch(0.65 0.22 290)" },
    { label: "Science", pct: 62, color: "oklch(0.72 0.22 155)" },
    { label: "Other", pct: 41, color: "oklch(0.80 0.18 75)" },
  ];

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden pt-16 bg-background"
    >
      <div className="absolute inset-0 cyber-grid-bg opacity-40 pointer-events-none" />
      <div
        className="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full pointer-events-none animate-pulse-glow"
        style={{
          background:
            "radial-gradient(circle, oklch(0.78 0.18 200 / 0.12) 0%, transparent 65%)",
        }}
      />
      <div
        className="absolute bottom-0 -left-32 w-[500px] h-[500px] rounded-full pointer-events-none animate-pulse-glow"
        style={{
          background:
            "radial-gradient(circle, oklch(0.65 0.22 290 / 0.10) 0%, transparent 65%)",
          animationDelay: "1.5s",
        }}
      />

      <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center py-20">
        <div
          className="space-y-7"
          style={{ animation: "fade-up 0.7s ease forwards", opacity: 0 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-mono font-semibold tracking-wider uppercase glow-cyan">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            GLOBAL RESOURSE OF ONLINE WISDOM
          </div>
          <h1 className="font-display text-5xl lg:text-6xl xl:text-7xl font-extrabold text-foreground leading-[1.0] tracking-tight">
            <span className="neon-text-cyan">Learn.</span>
            <br />
            <span className="text-foreground">Share.</span>
            <br />
            <span className="neon-text-green">Earn.</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
            Upload your notes, earn{" "}
            <span className="text-accent font-semibold">GROW Credits</span>{" "}
            based on quality. The smarter you share, the more you earn.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            <SoundButton
              size="lg"
              asChild
              data-ocid="hero.upload.primary_button"
              className="font-semibold glow-cyan"
            >
              <a href="#upload">
                <Upload size={16} className="mr-2" />
                Start Uploading
              </a>
            </SoundButton>
            <SoundButton
              size="lg"
              variant="outline"
              asChild
              data-ocid="hero.browse.secondary_button"
              className="font-semibold neon-border"
            >
              <a href="#browse">
                Browse Notes <ArrowRight size={16} className="ml-1" />
              </a>
            </SoundButton>
          </div>
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/50">
            {[
              {
                icon: Upload,
                label: "Notes Uploaded",
                value: totalUploads,
                color: "neon-text-cyan",
              },
              {
                icon: Coins,
                label: "Active Students",
                value: totalStudents,
                color: "neon-text-green",
              },
              {
                icon: Download,
                label: "Credits Distributed",
                value: totalCredits,
                color: "neon-text-violet",
              },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="text-center">
                <Icon
                  size={14}
                  className="mx-auto mb-1 text-muted-foreground"
                />
                <div
                  className={`font-mono text-xl font-bold ${color} animate-count-up`}
                >
                  {value.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          className="flex justify-center lg:justify-end"
          style={{ animation: "fade-up 0.7s 0.2s ease forwards", opacity: 0 }}
        >
          <div className="relative w-full max-w-lg">
            <div className="relative bg-card border border-primary/20 rounded-2xl overflow-hidden glow-cyan">
              <div className="bg-muted/40 border-b border-border px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-destructive opacity-70" />
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ background: "oklch(0.80 0.18 75)" }}
                  />
                  <div className="w-3 h-3 rounded-full bg-accent opacity-70" />
                </div>
                <span className="font-mono text-xs text-primary/60">
                  G.R.O.W — DASHBOARD v3.0
                </span>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                  <span className="font-mono text-xs text-accent">LIVE</span>
                </div>
              </div>
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    {
                      label: "Uploads",
                      value: totalUploads.toLocaleString(),
                      color: "neon-text-cyan",
                      icon: Upload,
                    },
                    {
                      label: "Credits",
                      value: totalCredits.toLocaleString(),
                      color: "neon-text-green",
                      icon: Coins,
                    },
                    {
                      label: "Students",
                      value: totalStudents.toLocaleString(),
                      color: "neon-text-violet",
                      icon: Download,
                    },
                  ].map(({ label, value, color, icon: Icon }) => (
                    <div
                      key={label}
                      className="bg-background/60 rounded-xl p-3 border border-border/50"
                    >
                      <Icon size={14} className="text-muted-foreground mb-1" />
                      <div className={`font-mono text-sm font-bold ${color}`}>
                        {value}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {label}
                      </div>
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs text-muted-foreground">
                      LIVE ACTIVITY
                    </span>
                    <div className="flex items-center gap-1">
                      <div className="w-1 h-1 rounded-full bg-accent animate-pulse" />
                      <span className="font-mono text-[10px] text-accent">
                        LIVE
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    {recentActivity.map((t) => (
                      <div
                        key={t}
                        className="flex items-center gap-2 py-1.5 px-3 rounded-lg bg-background/40 border border-border/30"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                        <span className="text-xs text-foreground/80 flex-1 truncate">
                          {t}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {subjectStats.map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between mb-0.5">
                        <span className="font-mono text-[10px] text-muted-foreground">
                          {item.label}
                        </span>
                        <span
                          className="font-mono text-[10px]"
                          style={{ color: item.color }}
                        >
                          {item.pct}%
                        </span>
                      </div>
                      <div className="h-1 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${item.pct}%`,
                            background: item.color,
                            boxShadow: `0 0 6px ${item.color}`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div
              className="absolute -top-4 -right-4 px-3 py-1.5 rounded-full bg-primary text-primary-foreground font-mono text-xs font-bold glow-cyan"
              style={{ animation: "float 4s ease-in-out infinite" }}
            >
              ✓ LIVE DATA
            </div>
            <div
              className="absolute -bottom-4 -left-4 px-3 py-1.5 rounded-full border border-accent/50 text-accent font-mono text-xs font-bold bg-background"
              style={{
                animation: "float 5s ease-in-out infinite",
                animationDelay: "1s",
              }}
            >
              <BookOpen size={10} className="inline mr-1" />
              NOTES LIVE
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
