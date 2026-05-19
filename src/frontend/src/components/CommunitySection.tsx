import { GraduationCap, ShoppingCart, Video } from "lucide-react";
import { useScrollReveal } from "../hooks/useScrollReveal";

const highlights = [
  {
    icon: ShoppingCart,
    title: "Marketplace",
    description:
      "Buy, sell, and donate academic resources securely with peer-to-peer transactions.",
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/20",
  },
  {
    icon: Video,
    title: "Live Webinars",
    description:
      "Join expert-led live sessions and interactive workshops across every discipline.",
    color: "text-secondary",
    bg: "bg-secondary/10",
    border: "border-secondary/20",
  },
  {
    icon: GraduationCap,
    title: "Online Courses",
    description:
      "Access structured learning paths and certifications across all subjects and skills.",
    color: "text-accent",
    bg: "bg-accent/10",
    border: "border-accent/20",
  },
];

export default function CommunitySection() {
  const ref = useScrollReveal<HTMLElement>();

  return (
    <section
      id="community"
      ref={ref}
      className="py-24 relative overflow-hidden"
      style={{ background: "oklch(0.12 0.02 260)" }}
    >
      {/* Decorative orb */}
      <div
        className="absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at right, oklch(0.65 0.22 290 / 0.06) 0%, transparent 60%)",
        }}
      />
      <div
        className="absolute left-0 bottom-0 w-[300px] h-[300px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, oklch(0.78 0.18 200 / 0.06) 0%, transparent 60%)",
        }}
      />

      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="scroll-reveal">
            <p className="text-sm font-mono font-semibold text-primary uppercase tracking-widest mb-3">
              ✦ COMMUNITY
            </p>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              Join the <span className="neon-text-cyan">G.R.O.W</span> Community
            </h2>
            <p className="text-muted-foreground leading-relaxed text-lg">
              G.R.O.W empowers students to collaborate by sharing study
              materials, attending live webinars, enrolling in courses, and
              making education more accessible to everyone — regardless of
              background or resources.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                { value: "5K+", label: "Students" },
                { value: "200+", label: "Courses" },
                { value: "50+", label: "Webinars" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="text-center p-3 rounded-xl bg-muted/20 border border-border/50"
                >
                  <div className="font-mono text-2xl font-bold neon-text-cyan">
                    {stat.value}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {highlights.map((h, i) => {
              const Icon = h.icon;
              return (
                <div
                  key={h.title}
                  className={`scroll-reveal scroll-reveal-delay-${i + 1} flex items-start gap-4 bg-card rounded-xl p-5 border ${h.border} grow-card-hover holo-card`}
                >
                  <div
                    className={`flex items-center justify-center w-11 h-11 rounded-xl ${h.bg} flex-shrink-0`}
                  >
                    <Icon size={20} className={h.color} />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-foreground text-base mb-1">
                      {h.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {h.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
