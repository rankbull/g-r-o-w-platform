import { Badge } from "@/components/ui/badge";
import { BookOpen, GraduationCap, Star, Users } from "lucide-react";
import { toast } from "sonner";
import { useAppContext } from "../context/AppContext";
import { COURSES } from "../data/coursesData";
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

const levelColors: Record<string, string> = {
  Beginner: "text-accent",
  Intermediate: "text-primary",
  Advanced: "text-secondary",
};

export default function CoursesSection() {
  const ref = useScrollReveal<HTMLElement>();
  const { user } = useAppContext();
  const { playClick, playError } = useSound();

  const handleEnroll = (title: string, isFree: boolean, creditCost: number) => {
    if (!user && !isFree) {
      playError();
      toast.error("Please login to enroll in paid courses.");
      return;
    }
    playClick();
    toast.success(
      `Enrolled in "${title}"!${!isFree ? ` -${creditCost} credits` : " (Free)"} Good luck!`,
    );
  };

  return (
    <section id="courses" ref={ref} className="py-24 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 30% 70%, oklch(0.72 0.22 155 / 0.05) 0%, transparent 60%)",
        }}
      />
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 scroll-reveal">
          <p className="text-sm font-mono font-semibold text-accent uppercase tracking-widest mb-3">
            ✦ STRUCTURED LEARNING
          </p>
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-foreground">
            Online <span className="neon-text-green">Courses</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Structured learning paths to master any subject at your own pace
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {COURSES.map((course, i) => {
            const subjectColor =
              subjectColors[course.subject] ??
              "bg-muted text-muted-foreground border-border";
            const levelColor =
              levelColors[course.level] ?? "text-muted-foreground";
            return (
              <article
                key={course.id}
                data-ocid={`courses.course.card.${i + 1}`}
                className={`scroll-reveal scroll-reveal-delay-${Math.min(i + 1, 3)} bg-card border border-border rounded-2xl p-6 holo-card grow-card-hover flex flex-col gap-4 hover:border-accent/40 transition-all duration-300`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-accent/10 flex-shrink-0">
                    <GraduationCap size={20} className="text-accent" />
                  </div>
                  <div className="flex gap-2">
                    {course.isFree ? (
                      <span className="px-2 py-0.5 rounded-full bg-accent/10 border border-accent/30 font-mono text-xs font-bold neon-text-green">
                        FREE
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-accent/10 border border-accent/30 font-mono text-xs font-bold text-accent">
                        {course.creditCost} credits
                      </span>
                    )}
                    <Badge
                      variant="outline"
                      className={`text-xs font-mono border ${subjectColor}`}
                    >
                      {course.subject}
                    </Badge>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-display font-bold text-foreground text-base leading-snug mb-1">
                    {course.title}
                  </h3>
                  <p className="text-xs font-mono text-muted-foreground">
                    by {course.instructor}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <BookOpen size={10} />
                    {course.lessons} lessons
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Users size={10} />
                    {course.enrolled.toLocaleString()} enrolled
                  </div>
                  <div className={`flex items-center gap-1.5 ${levelColor}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    {course.level}
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={9}
                        className={
                          s <= Math.round(course.rating)
                            ? "text-chart-4 fill-chart-4"
                            : "text-muted"
                        }
                      />
                    ))}
                    <span className="text-muted-foreground ml-1">
                      {course.rating}
                    </span>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground font-mono border-t border-border/50 pt-3">
                  {course.duration}
                </div>
                <SoundButton
                  size="sm"
                  onClick={() =>
                    handleEnroll(course.title, course.isFree, course.creditCost)
                  }
                  data-ocid={`courses.course.button.${i + 1}`}
                  className="w-full font-mono text-xs"
                  style={{ boxShadow: "0 0 12px oklch(0.72 0.22 155 / 0.25)" }}
                >
                  {course.isFree
                    ? "Enroll Free"
                    : `Enroll — ${course.creditCost} credits`}
                </SoundButton>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
