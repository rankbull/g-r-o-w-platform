import {
  DollarSign,
  Gift,
  GraduationCap,
  ShoppingCart,
  Users2,
  Video,
} from "lucide-react";
import { useScrollReveal } from "../hooks/useScrollReveal";

const features = [
  {
    icon: ShoppingCart,
    title: "Buy Resources",
    description:
      "Purchase premium study materials crafted by top-performing students in your field.",
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/20",
  },
  {
    icon: DollarSign,
    title: "Sell Your Notes",
    description:
      "Turn your academic knowledge into income by selling your study materials to peers.",
    color: "text-secondary",
    bg: "bg-secondary/10",
    border: "border-secondary/20",
  },
  {
    icon: Gift,
    title: "Donate Freely",
    description:
      "Share your notes for free to help underprivileged students access quality education.",
    color: "text-accent",
    bg: "bg-accent/10",
    border: "border-accent/20",
  },
  {
    icon: Video,
    title: "Live Webinars",
    description:
      "Join real-time expert sessions and interactive workshops from anywhere in the world.",
    color: "text-chart-4",
    bg: "bg-chart-4/10",
    border: "border-chart-4/20",
  },
  {
    icon: GraduationCap,
    title: "Online Courses",
    description:
      "Enroll in structured learning paths to master any subject at your own pace.",
    color: "text-chart-5",
    bg: "bg-chart-5/10",
    border: "border-chart-5/20",
  },
  {
    icon: Users2,
    title: "Peer Community",
    description:
      "Connect, collaborate, and learn with 5,000+ motivated students worldwide.",
    color: "text-chart-2",
    bg: "bg-chart-2/10",
    border: "border-chart-2/20",
  },
];

export default function FeaturesSection() {
  const ref = useScrollReveal<HTMLElement>();

  return (
    <section id="features" ref={ref} className="py-24 relative">
      {/* Background accent */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 80% 50%, oklch(0.65 0.22 290 / 0.04) 0%, transparent 60%)",
        }}
      />

      <div className="container mx-auto px-4">
        <div className="text-center mb-16 scroll-reveal">
          <p className="text-sm font-mono font-semibold text-primary uppercase tracking-widest mb-3">
            ✦ FEATURES
          </p>
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-foreground">
            Why <span className="neon-text-cyan">G.R.O.W</span>?
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Everything you need to learn, earn, and grow — all in one platform
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className={`scroll-reveal scroll-reveal-delay-${Math.min(i + 1, 3)} bg-card rounded-2xl border ${feature.border} p-6 grow-card-hover holo-card`}
              >
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${feature.bg} mb-5`}
                >
                  <Icon size={22} className={feature.color} />
                </div>
                <h3 className="font-display font-bold text-foreground text-lg mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
