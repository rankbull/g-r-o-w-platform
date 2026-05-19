import { GraduationCap, Search, Upload, Users } from "lucide-react";
import { useScrollReveal } from "../hooks/useScrollReveal";

const steps = [
  {
    number: "01",
    icon: Upload,
    title: "Upload & Share Resources",
    description:
      "Upload notes, PDFs, study guides, and sell or donate them to peers across the platform.",
    color: "text-primary",
    neonClass: "neon-text-cyan",
    bg: "bg-primary/10",
    border: "border-primary/20",
    glow: "hover:shadow-glow-cyan",
  },
  {
    number: "02",
    icon: Search,
    title: "Discover & Purchase",
    description:
      "Browse and buy or download premium resources, or find free materials shared by top students.",
    color: "text-secondary",
    neonClass: "neon-text-violet",
    bg: "bg-secondary/10",
    border: "border-secondary/20",
    glow: "hover:shadow-glow-violet",
  },
  {
    number: "03",
    icon: GraduationCap,
    title: "Live Webinars & Courses",
    description:
      "Attend live webinars hosted by experts and enroll in structured online courses for any subject.",
    color: "text-accent",
    neonClass: "neon-text-green",
    bg: "bg-accent/10",
    border: "border-accent/20",
    glow: "hover:glow-green",
  },
  {
    number: "04",
    icon: Users,
    title: "Grow Together",
    description:
      "Build your academic network, connect with peers, and grow with 5,000+ students worldwide.",
    color: "text-chart-4",
    neonClass: "",
    bg: "bg-chart-4/10",
    border: "border-chart-4/20",
    glow: "",
  },
];

export default function HowItWorks() {
  const ref = useScrollReveal<HTMLElement>();

  return (
    <section
      id="how-it-works"
      ref={ref}
      className="py-24 relative overflow-hidden"
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, oklch(0.78 0.18 200 / 0.04) 0%, transparent 70%)",
        }}
      />

      <div className="container mx-auto px-4">
        <div className="text-center mb-16 scroll-reveal">
          <p className="text-sm font-mono font-semibold text-primary uppercase tracking-widest mb-3">
            ✦ PROCESS
          </p>
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-foreground">
            How It <span className="neon-text-cyan">Works</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Four steps to start learning, earning, and growing with G.R.O.W
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connector line */}
          <div
            className="hidden lg:block absolute top-16 left-[12.5%] right-[12.5%] h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, oklch(0.78 0.18 200 / 0.4), oklch(0.65 0.22 290 / 0.4), transparent)",
            }}
          />

          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className={`scroll-reveal scroll-reveal-delay-${Math.min(i + 1, 3)} relative`}
              >
                <div
                  className={`bg-card rounded-2xl p-6 border ${step.border} grow-card-hover holo-card relative overflow-hidden ${step.glow} transition-shadow`}
                >
                  {/* Giant step number */}
                  <span
                    className={`absolute -top-3 -right-2 font-display font-extrabold text-8xl leading-none select-none pointer-events-none opacity-10 font-mono ${step.color}`}
                  >
                    {step.number}
                  </span>

                  <div
                    className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${step.bg} mb-5 relative z-10`}
                  >
                    <Icon size={22} className={step.color} />
                  </div>
                  <h3 className="font-display text-lg font-bold text-foreground mb-3 relative z-10">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed relative z-10">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
