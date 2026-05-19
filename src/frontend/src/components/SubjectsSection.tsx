import { motion } from "motion/react";
import { SUBJECTS } from "../data/subjectsData";

interface SubjectsSectionProps {
  onSubjectClick: (key: string) => void;
}

export default function SubjectsSection({
  onSubjectClick,
}: SubjectsSectionProps) {
  return (
    <section id="subjects" className="py-24 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 30% 60%, oklch(0.6 0.28 300 / 0.05) 0%, transparent 60%), radial-gradient(ellipse at 70% 30%, oklch(0.78 0.18 200 / 0.05) 0%, transparent 60%)",
        }}
      />
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-sm font-mono font-semibold text-secondary uppercase tracking-widest mb-3">
            ✦ SUBJECT LIBRARY
          </p>
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-foreground">
            Browse by <span className="neon-text-cyan">Subject</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Click any subject to preview curated study notes and unlock full
            access
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SUBJECTS.map((subject, index) => (
            <motion.button
              key={subject.key}
              type="button"
              data-ocid={`subjects.item.${index + 1}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06, duration: 0.4 }}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSubjectClick(subject.key)}
              className={`group relative bg-card border ${subject.borderColor} rounded-2xl p-6 text-left cursor-pointer transition-all duration-300 hover:${subject.glowClass} hover:bg-card/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary`}
            >
              {/* Icon */}
              <div className="mb-4">
                <span className="text-4xl leading-none select-none">
                  {subject.icon}
                </span>
              </div>

              {/* Label */}
              <h3
                className={`font-display font-bold text-lg ${subject.color} mb-1 leading-tight`}
              >
                {subject.label}
              </h3>

              {/* Description */}
              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-4">
                {subject.description}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-muted-foreground">
                  {subject.sampleNotes.length} preview notes
                </span>
                <span
                  className={`font-mono text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${subject.borderColor} ${subject.color} opacity-0 group-hover:opacity-100 transition-opacity duration-200`}
                >
                  Preview →
                </span>
              </div>

              {/* Corner glow accent */}
              <div
                className={`absolute top-0 right-0 w-16 h-16 rounded-bl-3xl rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${subject.color.replace("text-", "bg-")}/5`}
              />
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
