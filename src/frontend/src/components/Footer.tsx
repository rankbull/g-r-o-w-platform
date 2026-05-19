import { Heart, Sprout } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`;

  return (
    <footer
      className="border-t py-12"
      style={{
        borderColor: "oklch(0.78 0.18 200 / 0.2)",
        background: "oklch(0.08 0.012 260)",
      }}
    >
      <div className="container mx-auto px-4">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-display font-bold text-xl text-foreground">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground glow-cyan">
                <Sprout size={16} />
              </span>
              <span className="neon-text-cyan">G.R.O.W</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Global Resource of Online Wisdom — empowering students through
              shared knowledge, live webinars, and online courses.
            </p>
          </div>

          {/* Platform links */}
          <div>
            <h4 className="font-mono font-semibold text-primary mb-3 text-sm tracking-wider uppercase">
              Platform
            </h4>
            <ul className="space-y-2">
              {[
                { label: "Browse Notes", href: "#browse" },
                { label: "Upload Notes", href: "#upload" },
                { label: "How It Works", href: "#how-it-works" },
                { label: "Webinars", href: "#community" },
                { label: "Courses", href: "#features" },
              ].map((l) => (
                <li key={l.href + l.label}>
                  <a
                    href={l.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-mono font-semibold text-primary mb-3 text-sm tracking-wider uppercase">
              Company
            </h4>
            <ul className="space-y-2">
              {[
                { label: "About G.R.O.W", href: "#" },
                { label: "Contact", href: "#" },
                { label: "Privacy Policy", href: "#" },
                { label: "Help Center", href: "#" },
              ].map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-mono font-semibold text-primary mb-3 text-sm tracking-wider uppercase">
              Subjects
            </h4>
            <ul className="space-y-2">
              {[
                "Computer Science",
                "Mathematics",
                "Engineering",
                "Business",
                "Cybersecurity",
              ].map((s) => (
                <li key={s}>
                  <a
                    href="#browse"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className="border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderColor: "oklch(0.78 0.18 200 / 0.15)" }}
        >
          <p className="text-xs text-muted-foreground font-mono">
            G.R.O.W — Democratizing education worldwide.
          </p>
          <p className="text-xs text-muted-foreground">
            © {year}. Built with{" "}
            <Heart size={10} className="inline text-chart-5" /> using{" "}
            <a
              href={caffeineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
