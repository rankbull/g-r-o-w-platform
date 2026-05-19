import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, Video } from "lucide-react";
import { toast } from "sonner";
import { useAppContext } from "../context/AppContext";
import { WEBINARS } from "../data/webinarsData";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { useSound } from "../hooks/useSound";
import SoundButton from "./SoundButton";

const subjectColors: Record<string, string> = {
  Math: "bg-secondary/10 text-secondary border-secondary/30",
  Science: "bg-accent/10 text-accent border-accent/30",
  History: "bg-chart-4/10 text-chart-4 border-chart-4/30",
  English: "bg-chart-5/10 text-chart-5 border-chart-5/30",
  "Computer Science": "bg-primary/10 text-primary border-primary/30",
};

export default function WebinarsSection() {
  const ref = useScrollReveal<HTMLElement>();
  const { user } = useAppContext();
  const { playClick, playError } = useSound();

  const handleJoin = (
    title: string,
    isFree: boolean,
    creditCost: number,
    meetLink: string,
  ) => {
    if (!user && !isFree) {
      playError();
      toast.error("Please login to join paid webinars.");
      return;
    }
    playClick();
    toast.success(
      `Registered for "${title}"!${
        !isFree ? ` -${creditCost} credits` : " (Free)"
      } Connecting to Google Meet...`,
    );
    window.open(meetLink, "_blank", "noopener,noreferrer");
  };

  return (
    <section
      id="webinars"
      ref={ref}
      className="py-24 relative overflow-hidden"
      style={{ background: "oklch(0.09 0.016 265)" }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 60% 30%, oklch(0.65 0.22 290 / 0.06) 0%, transparent 60%)",
        }}
      />
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 scroll-reveal">
          <p className="text-sm font-mono font-semibold text-secondary uppercase tracking-widest mb-3">
            ✦ LIVE SESSIONS
          </p>
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-foreground">
            Upcoming <span className="neon-text-violet">Webinars</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Live expert-led sessions — learn from the best in real time
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {WEBINARS.map((webinar, i) => {
            const subjectColor =
              subjectColors[webinar.subject] ??
              "bg-muted text-muted-foreground border-border";
            return (
              <article
                key={webinar.id}
                data-ocid={`webinars.webinar.card.${i + 1}`}
                className={`scroll-reveal scroll-reveal-delay-${Math.min(i + 1, 3)} bg-card border border-border rounded-2xl p-6 holo-card grow-card-hover flex flex-col gap-4 hover:border-secondary/40 transition-all duration-300`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-secondary/10 flex-shrink-0">
                    <Video size={20} className="text-secondary" />
                  </div>
                  <div className="flex gap-2">
                    {webinar.isFree ? (
                      <span className="px-2 py-0.5 rounded-full bg-accent/10 border border-accent/30 font-mono text-xs font-bold neon-text-green">
                        FREE
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-secondary/10 border border-secondary/30 font-mono text-xs font-bold text-secondary">
                        {webinar.creditCost} credits
                      </span>
                    )}
                    <Badge
                      variant="outline"
                      className={`text-xs font-mono border ${subjectColor}`}
                    >
                      {webinar.subject}
                    </Badge>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-display font-bold text-foreground text-base leading-snug mb-2">
                    {webinar.title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {webinar.topic}
                  </p>
                </div>
                <div className="space-y-1.5 text-xs text-muted-foreground font-mono">
                  <div className="flex items-center gap-1.5">
                    <Users size={11} />
                    <span className="font-semibold text-foreground">
                      {webinar.host}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Calendar size={11} />
                      <span>{webinar.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={11} />
                      <span>{webinar.time}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users size={11} />
                    <span>
                      {webinar.attendeeCount.toLocaleString()} attending
                    </span>
                  </div>
                </div>
                <SoundButton
                  size="sm"
                  onClick={() =>
                    handleJoin(
                      webinar.title,
                      webinar.isFree,
                      webinar.creditCost,
                      webinar.meetLink,
                    )
                  }
                  data-ocid={`webinars.webinar.button.${i + 1}`}
                  className="w-full font-mono text-xs"
                  style={{ boxShadow: "0 0 12px oklch(0.65 0.22 290 / 0.25)" }}
                >
                  {webinar.isFree
                    ? "Join Free → Google Meet"
                    : `Join — ${webinar.creditCost} credits → Google Meet`}
                </SoundButton>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
