import { Award, Coins, FileText, Medal, Trophy } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { useScrollReveal } from "../hooks/useScrollReveal";

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1)
    return (
      <div
        className="flex items-center justify-center w-9 h-9 rounded-full bg-chart-4/20 border border-chart-4/40"
        style={{ boxShadow: "0 0 12px oklch(0.80 0.18 75 / 0.4)" }}
      >
        <Trophy size={16} className="text-chart-4" />
      </div>
    );
  if (rank === 2)
    return (
      <div className="flex items-center justify-center w-9 h-9 rounded-full bg-muted border border-muted-foreground/30">
        <Medal size={16} className="text-foreground" />
      </div>
    );
  if (rank === 3)
    return (
      <div className="flex items-center justify-center w-9 h-9 rounded-full bg-chart-5/20 border border-chart-5/40">
        <Award size={16} className="text-chart-5" />
      </div>
    );
  return (
    <div className="flex items-center justify-center w-9 h-9 rounded-full bg-muted/50">
      <span className="font-mono text-sm font-bold text-muted-foreground">
        #{rank}
      </span>
    </div>
  );
}

export default function Leaderboard() {
  const ref = useScrollReveal<HTMLElement>();
  const { leaderboard } = useAppContext();
  const maxEarned =
    leaderboard.length > 0
      ? Math.max(...leaderboard.map((p) => p.totalEarned))
      : 1;

  return (
    <section
      id="leaderboard"
      ref={ref}
      className="py-24 relative overflow-hidden"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 70% 50%, oklch(0.80 0.18 75 / 0.05) 0%, transparent 60%)",
        }}
      />
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 scroll-reveal">
          <p className="text-sm font-mono font-semibold text-chart-4 uppercase tracking-widest mb-3">
            ✦ TOP EARNERS
          </p>
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-foreground">
            Credit <span className="neon-text-amber">Leaderboard</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            The students earning the most credits through quality note sharing
          </p>
        </div>
        <div className="max-w-3xl mx-auto space-y-3">
          {leaderboard.slice(0, 10).map((profile, i) => {
            const rank = i + 1;
            const barPct =
              maxEarned > 0 ? (profile.totalEarned / maxEarned) * 100 : 0;
            const isTop3 = rank <= 3;
            return (
              <div
                key={rank}
                data-ocid={`leaderboard.item.${rank}`}
                className={`scroll-reveal scroll-reveal-delay-${Math.min(i + 1, 4)} flex items-center gap-4 bg-card border rounded-xl p-4 transition-all duration-300 grow-card-hover holo-card ${isTop3 ? "border-chart-4/30" : "border-border"}`}
                style={
                  rank === 1
                    ? { boxShadow: "0 0 20px oklch(0.80 0.18 75 / 0.15)" }
                    : undefined
                }
              >
                <RankBadge rank={rank} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`font-display font-bold text-sm ${rank === 1 ? "neon-text-amber" : "text-foreground"}`}
                    >
                      {profile.name}
                    </span>
                    <div className="flex items-center gap-3 text-xs font-mono">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <FileText size={10} />
                        {profile.totalUploads} notes
                      </div>
                      <div className="flex items-center gap-1 text-accent font-bold">
                        <Coins size={10} />
                        {profile.totalEarned.toLocaleString()} earned
                      </div>
                    </div>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${barPct}%`,
                        background:
                          rank === 1
                            ? "oklch(0.80 0.18 75)"
                            : rank === 2
                              ? "oklch(0.85 0.01 265)"
                              : rank === 3
                                ? "oklch(0.60 0.22 27)"
                                : "oklch(0.78 0.18 200)",
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
