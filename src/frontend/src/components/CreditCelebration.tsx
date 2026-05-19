import { Coins, Sparkles } from "lucide-react";
import { useEffect, useRef } from "react";
import { useSound } from "../hooks/useSound";

interface CreditCelebrationProps {
  credits: number;
  onDismiss: () => void;
}

export default function CreditCelebration({
  credits,
  onDismiss,
}: CreditCelebrationProps) {
  const { playCreditEarned } = useSound();
  const played = useRef(false);

  useEffect(() => {
    if (!played.current) {
      played.current = true;
      playCreditEarned();
    }
    const timer = setTimeout(onDismiss, 2500);
    return () => clearTimeout(timer);
  }, [playCreditEarned, onDismiss]);

  const particles = Array.from({ length: 12 }).map((_, i) => ({
    id: i,
    left: `${10 + ((i * 7) % 80)}%`,
    delay: `${(i * 0.12).toFixed(2)}s`,
    emoji: ["✦", "◆", "★", "●"][i % 4],
  }));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center fade-out-delayed"
      style={{
        background: "oklch(0.08 0.015 265 / 0.85)",
        backdropFilter: "blur(8px)",
      }}
      onClick={onDismiss}
      onKeyDown={(e) => e.key === "Escape" && onDismiss()}
      aria-label="Dismiss credit celebration"
    >
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute bottom-1/2 particle text-accent font-mono text-sm pointer-events-none"
          style={{ left: p.left, animationDelay: p.delay }}
        >
          {p.emoji}
        </div>
      ))}

      <div className="credit-burst text-center">
        <div
          className="inline-flex flex-col items-center gap-4 px-12 py-10 rounded-3xl border border-accent/40 bg-card"
          style={{
            boxShadow:
              "0 0 60px oklch(0.72 0.22 155 / 0.4), 0 0 120px oklch(0.72 0.22 155 / 0.15)",
          }}
        >
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 border border-accent/30">
            <Coins size={32} className="text-accent" />
          </div>
          <div>
            <p className="font-mono text-sm text-muted-foreground uppercase tracking-widest mb-2">
              Credits Earned!
            </p>
            <p className="font-display text-6xl font-extrabold neon-text-green">
              +{credits}
            </p>
            <p className="font-mono text-base text-accent mt-1">GROW Credits</p>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground text-xs font-mono">
            <Sparkles size={12} />
            Quality bonus applied
          </div>
        </div>
      </div>
    </div>
  );
}
