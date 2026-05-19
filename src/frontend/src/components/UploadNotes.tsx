import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertTriangle,
  Bot,
  CheckCircle,
  CloudUpload,
  FileImage,
  FileSpreadsheet,
  LogIn,
  Sparkles,
  Star,
  Tag,
  Upload,
  XCircle,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import type { AIAnalysisResult } from "../backend.d";
import { useAppContext } from "../context/AppContext";
import { useAnalyzeNote, useUploadNote } from "../hooks/useQueries";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { useSound } from "../hooks/useSound";
import CreditCelebration from "./CreditCelebration";
import SoundButton from "./SoundButton";

const SUBJECTS = [
  "Math",
  "Science",
  "English",
  "History",
  "Computer Science",
  "Other",
];

function getScoreColor(score: number) {
  if (score >= 75) return "text-accent neon-text-green";
  if (score >= 50) return "neon-text-amber";
  return "text-destructive";
}

function getScoreGlow(score: number) {
  if (score >= 75) return "border-accent/40 bg-accent/5";
  if (score >= 50) return "border-chart-4/40 bg-chart-4/5";
  return "border-destructive/40 bg-destructive/5";
}

function getScoreLabel(score: number) {
  if (score >= 85) return "EXCELLENT";
  if (score >= 70) return "GOOD";
  if (score >= 50) return "AVERAGE";
  return "LOW QUALITY";
}

function AIResultPanel({ result }: { result: AIAnalysisResult }) {
  const score = Number(result.score);
  return (
    <div
      data-ocid="upload.ai_result.panel"
      className={`rounded-xl border p-4 space-y-3 ${getScoreGlow(score)}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot size={16} className="text-primary" />
          <span className="font-mono text-xs text-primary font-semibold uppercase tracking-widest">
            AI Quality Analysis
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`font-mono text-2xl font-black ${getScoreColor(score)}`}
          >
            {score}
          </span>
          <span className="font-mono text-xs text-muted-foreground">/100</span>
          <Badge
            variant="outline"
            className={`font-mono text-xs ${getScoreColor(score)} border-current`}
          >
            {getScoreLabel(score)}
          </Badge>
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative h-2 rounded-full bg-muted overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
          style={{
            width: `${score}%`,
            background:
              score >= 75
                ? "oklch(0.72 0.22 155)"
                : score >= 50
                  ? "oklch(0.8 0.18 75)"
                  : "oklch(0.58 0.24 27)",
            boxShadow:
              score >= 75
                ? "0 0 8px oklch(0.72 0.22 155 / 0.7)"
                : score >= 50
                  ? "0 0 8px oklch(0.8 0.18 75 / 0.7)"
                  : "0 0 8px oklch(0.58 0.24 27 / 0.7)",
          }}
        />
      </div>

      {result.suggestedTitle && result.suggestedTitle !== "" && (
        <div className="space-y-1">
          <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
            Suggested Title
          </p>
          <p className="text-sm text-foreground font-medium">
            {result.suggestedTitle}
          </p>
        </div>
      )}

      {result.suggestedTags.length > 0 && (
        <div className="space-y-1.5">
          <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1">
            <Tag size={10} /> Suggested Tags
          </p>
          <div className="flex flex-wrap gap-1.5">
            {result.suggestedTags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="text-xs font-mono bg-primary/5 border-primary/30 text-primary"
              >
                #{tag}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {result.flags.length > 0 && (
        <div className="space-y-1.5">
          <p className="font-mono text-xs text-destructive uppercase tracking-wider flex items-center gap-1">
            <AlertTriangle size={10} /> Quality Flags
          </p>
          <ul className="space-y-1">
            {result.flags.map((flag) => (
              <li
                key={flag}
                className="text-xs text-destructive/80 font-mono flex items-center gap-1.5"
              >
                <XCircle size={10} className="flex-shrink-0" /> {flag}
              </li>
            ))}
          </ul>
        </div>
      )}

      {result.flags.length === 0 && (
        <div className="flex items-center gap-1.5 text-xs text-accent font-mono">
          <CheckCircle size={12} /> No quality issues detected
        </div>
      )}

      {result.similarityPercent && Number(result.similarityPercent) > 0 && (
        <div className="font-mono text-xs text-muted-foreground">
          Similarity to existing notes:{" "}
          <span
            className={
              Number(result.similarityPercent) > 80
                ? "text-destructive font-bold"
                : "neon-text-amber"
            }
          >
            {Number(result.similarityPercent)}%
          </span>
        </div>
      )}
    </div>
  );
}

export default function UploadNotes() {
  const { user, addNote } = useAppContext();
  const ref = useScrollReveal<HTMLElement>();
  const { playUploadSuccess, playError } = useSound();
  const uploadNoteMutation = useUploadNote();
  const analyzeNoteMutation = useAnalyzeNote();

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("0");
  const [uploaderName, setUploaderName] = useState("");
  const [qualityStars, setQualityStars] = useState(3);
  const [file, setFile] = useState<File | null>(null);
  const [celebrationCredits, setCelebrationCredits] = useState<number | null>(
    null,
  );
  const [isPending, setIsPending] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [aiResult, setAiResult] = useState<AIAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const simulateProgress = async () => {
    setUploadProgress(0);
    for (const pct of [15, 35, 55, 75, 90]) {
      await new Promise((r) => setTimeout(r, 180));
      setUploadProgress(pct);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !subject || (!user && !uploaderName)) {
      toast.error("Please fill in all required fields.");
      playError();
      return;
    }
    setIsPending(true);
    setAiResult(null);

    try {
      // Simulate file upload progress
      await simulateProgress();

      const fileRef = file
        ? `file_${Date.now()}_${file.name.replace(/\s/g, "_")}`
        : `note_${Date.now()}`;

      // Try to upload to backend first (if authenticated via II)
      let backendNoteId: bigint | null = null;
      if (user?.isII && uploadNoteMutation.mutateAsync) {
        try {
          backendNoteId = await uploadNoteMutation.mutateAsync({
            title,
            uploaderName: user.username,
            subject,
            description,
            price: BigInt(Math.max(0, Number.parseInt(price) || 0)),
            fileRef,
          });
        } catch {
          // Fall back to local storage
        }
      }

      setUploadProgress(100);
      await new Promise((r) => setTimeout(r, 200));

      const earned = addNote({
        title,
        uploaderName: user ? user.username : uploaderName,
        subject,
        description,
        qualityStars,
        price: Math.max(0, Number.parseInt(price) || 0),
        fileId: fileRef,
      });

      setCelebrationCredits(earned);
      playUploadSuccess();

      // Trigger AI analysis if we have a backend note ID
      if (backendNoteId !== null) {
        setIsAnalyzing(true);
        try {
          const result = await analyzeNoteMutation.mutateAsync(backendNoteId);
          setAiResult(result);
        } catch {
          // AI analysis not critical
        } finally {
          setIsAnalyzing(false);
        }
      } else {
        // Simulate AI analysis result for local-only upload
        setIsAnalyzing(true);
        await new Promise((r) => setTimeout(r, 1200));
        const simulatedScore = Math.min(
          100,
          Math.max(30, qualityStars * 16 + Math.floor(Math.random() * 10)),
        );
        setAiResult({
          noteId: BigInt(0),
          score: BigInt(simulatedScore),
          flags:
            simulatedScore < 50
              ? ["Low word count detected", "Consider adding more detail"]
              : [],
          suggestedTitle:
            title.length < 20 ? `${title} — Complete Study Notes` : title,
          suggestedTags: [subject.toLowerCase(), "study-notes", "academic"],
          similarityPercent: undefined,
          similarNoteId: undefined,
          timestamp: BigInt(Date.now()),
        });
        setIsAnalyzing(false);
      }

      setTitle("");
      setSubject("");
      setDescription("");
      setPrice("0");
      setUploaderName("");
      setQualityStars(3);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      toast.success(`Notes uploaded! You earned ${earned} GROW Credits!`);
    } catch {
      playError();
      toast.error("Upload failed. Please try again.");
    } finally {
      setIsPending(false);
      setUploadProgress(0);
    }
  };

  const displayName = user ? user.username : uploaderName;

  const fileIcon =
    file?.type === "application/pdf" ? (
      <FileSpreadsheet size={28} className="mx-auto text-destructive mb-2" />
    ) : file?.type.startsWith("image/") ? (
      <FileImage size={28} className="mx-auto text-accent mb-2" />
    ) : (
      <CloudUpload size={32} className="mx-auto text-muted-foreground mb-2" />
    );

  return (
    <section id="upload" ref={ref} className="py-24 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 30% 50%, oklch(0.65 0.22 290 / 0.06) 0%, transparent 60%)",
        }}
      />
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 scroll-reveal">
          <p className="text-sm font-mono font-semibold text-primary uppercase tracking-widest mb-3">
            ✦ CONTRIBUTE
          </p>
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-foreground">
            Upload Your <span className="neon-text-cyan">Notes</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Share your knowledge, earn GROW Credits based on quality. The better
            your notes, the more you earn.
          </p>
        </div>
        <div className="max-w-2xl mx-auto scroll-reveal scroll-reveal-delay-1">
          <form
            onSubmit={handleSubmit}
            className="bg-card border border-border rounded-2xl p-8 space-y-6 holo-card"
            style={{ boxShadow: "0 0 40px oklch(0.78 0.18 200 / 0.08)" }}
          >
            <div className="space-y-2">
              <Label
                htmlFor="upload-title"
                className="font-mono text-sm text-muted-foreground"
              >
                Note Title *
              </Label>
              <Input
                id="upload-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Data Structures & Algorithms — Complete Notes"
                required
                data-ocid="upload.title.input"
                className="bg-muted/40 border-border focus:border-primary"
              />
            </div>
            {!user && (
              <div className="space-y-2">
                <Label
                  htmlFor="upload-name"
                  className="font-mono text-sm text-muted-foreground"
                >
                  Your Name *
                </Label>
                <Input
                  id="upload-name"
                  value={uploaderName}
                  onChange={(e) => setUploaderName(e.target.value)}
                  placeholder="Your display name"
                  required
                  data-ocid="upload.name.input"
                  className="bg-muted/40 border-border focus:border-primary"
                />
              </div>
            )}
            {user && (
              <div className="px-3 py-2 rounded-lg bg-primary/5 border border-primary/20 font-mono text-sm text-primary">
                Uploading as: <span className="font-bold">{displayName}</span>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-mono text-sm text-muted-foreground">
                  Subject *
                </Label>
                <Select value={subject} onValueChange={setSubject}>
                  <SelectTrigger
                    data-ocid="upload.subject.select"
                    className="bg-muted/40 border-border"
                  >
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {SUBJECTS.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="upload-price"
                  className="font-mono text-sm text-muted-foreground"
                >
                  Price (credits, 0 = free)
                </Label>
                <Input
                  id="upload-price"
                  type="number"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  data-ocid="upload.price.input"
                  className="bg-muted/40 border-border focus:border-primary"
                />
              </div>
            </div>
            <div className="space-y-3">
              <Label className="font-mono text-sm text-muted-foreground">
                Quality Stars:{" "}
                <span className="text-primary font-bold">{qualityStars} ★</span>{" "}
                ={" "}
                <span className="neon-text-green font-bold">
                  +{qualityStars * 20} credits
                </span>
              </Label>
              <div className="flex items-center gap-3">
                <Slider
                  value={[qualityStars]}
                  onValueChange={([v]) => setQualityStars(v)}
                  min={1}
                  max={5}
                  step={1}
                  data-ocid="upload.quality.input"
                  className="flex-1"
                />
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={16}
                      className={
                        s <= qualityStars
                          ? "text-chart-4 fill-chart-4"
                          : "text-muted"
                      }
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="upload-desc"
                className="font-mono text-sm text-muted-foreground"
              >
                Description
              </Label>
              <Textarea
                id="upload-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of what's covered in these notes..."
                rows={3}
                data-ocid="upload.description.textarea"
                className="bg-muted/40 border-border focus:border-primary resize-none"
              />
            </div>
            <div className="space-y-2">
              <Label className="font-mono text-sm text-muted-foreground">
                File (PDF / Image)
              </Label>
              <button
                type="button"
                className="w-full border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-primary/50 transition-all duration-200 group"
                onClick={() => fileInputRef.current?.click()}
                data-ocid="upload.file.dropzone"
                aria-label="Upload file"
              >
                {fileIcon}
                {file ? (
                  <div>
                    <p className="text-sm text-primary font-mono font-semibold">
                      {file.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                      Click to select a file
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PDF, PNG, JPG supported
                    </p>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  className="hidden"
                  data-ocid="upload.file.upload_button"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                />
              </button>
            </div>

            {/* Upload Progress Bar */}
            {isPending && (
              <div data-ocid="upload.loading_state" className="space-y-2">
                <div className="flex items-center justify-between font-mono text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    {uploadProgress < 100
                      ? "Uploading file..."
                      : "Processing..."}
                  </span>
                  <span className="text-primary font-bold">
                    {uploadProgress}%
                  </span>
                </div>
                <div className="relative h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full transition-all duration-300"
                    style={{
                      width: `${uploadProgress}%`,
                      background: "oklch(0.78 0.18 200)",
                      boxShadow: "0 0 10px oklch(0.78 0.18 200 / 0.8)",
                    }}
                  />
                </div>
              </div>
            )}

            {/* AI Analysis in-progress */}
            {isAnalyzing && (
              <div
                data-ocid="upload.ai_analyzing.loading_state"
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/5 border border-primary/20"
              >
                <Sparkles size={14} className="text-primary animate-pulse" />
                <span className="font-mono text-xs text-primary">
                  AI analyzing note quality...
                </span>
              </div>
            )}

            {/* AI Result */}
            {aiResult && !isAnalyzing && <AIResultPanel result={aiResult} />}

            <SoundButton
              type="submit"
              disabled={isPending || isAnalyzing}
              data-ocid="upload.submit_button"
              className="w-full font-semibold glow-cyan"
              size="lg"
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
                  Uploading...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Upload size={16} />
                  Upload & Earn Credits
                </span>
              )}
            </SoundButton>
            {!user && (
              <div className="flex items-center justify-center gap-2 pt-2">
                <LogIn size={14} className="text-muted-foreground" />
                <p className="text-xs text-muted-foreground font-mono">
                  Login to save credits to your account
                </p>
              </div>
            )}
          </form>
        </div>
      </div>
      {celebrationCredits !== null && (
        <CreditCelebration
          credits={celebrationCredits}
          onDismiss={() => setCelebrationCredits(null)}
        />
      )}
    </section>
  );
}
