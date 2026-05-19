import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bot,
  CheckCircle,
  Download,
  Eye,
  FileText,
  Key,
  Shield,
  Star,
  Trash2,
  TrendingUp,
  UserCog,
  Users,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type {
  AILogEntry,
  AccountStatus,
  AnalyticsData,
  ModerationItem,
  UserAdminView,
} from "../backend.d";
import { useAppContext } from "../context/AppContext";
import {
  useBanUser,
  useGetAILogs,
  useGetAdminAnalytics,
  useGetModerationQueue,
  useGetOpenAIKey,
  useGetUserList,
  useRemoveNote,
  useSetOpenAIKey,
  useSuspendUser,
  useUnsuspendUser,
} from "../hooks/useQueries";
import { useSound } from "../hooks/useSound";

interface AdminPanelProps {
  open: boolean;
  onClose: () => void;
}

function statusLabel(status: AccountStatus): { label: string; color: string } {
  if (status.__kind__ === "banned")
    return { label: "BANNED", color: "text-destructive" };
  if (status.__kind__ === "suspended")
    return { label: "SUSPENDED", color: "neon-text-amber" };
  return { label: "ACTIVE", color: "neon-text-green" };
}

function formatTs(ts: bigint): string {
  return new Date(Number(ts) / 1_000_000).toLocaleDateString();
}

function BarChartCSS({ data }: { data: { label: string; value: number }[] }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="space-y-2">
      {data.map((d) => (
        <div key={d.label} className="flex items-center gap-3">
          <span className="font-mono text-xs text-muted-foreground w-24 truncate text-right">
            {d.label}
          </span>
          <div className="flex-1 h-5 bg-muted/30 rounded overflow-hidden">
            <div
              className="h-full rounded transition-all duration-700"
              style={{
                width: `${(d.value / max) * 100}%`,
                background:
                  "linear-gradient(90deg, oklch(0.78 0.18 200 / 0.9), oklch(0.65 0.22 290 / 0.9))",
                boxShadow: "0 0 8px oklch(0.78 0.18 200 / 0.5)",
              }}
            />
          </div>
          <span className="font-mono text-xs neon-text-cyan w-10 text-right">
            {d.value}
          </span>
        </div>
      ))}
    </div>
  );
}

function LineChartCSS({ data }: { data: { label: string; value: number }[] }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const pts = data.map((d, i) => ({
    x: (i / Math.max(data.length - 1, 1)) * 100,
    y: 100 - (d.value / max) * 80,
    label: d.label,
    value: d.value,
  }));
  const pathD = pts
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");
  const fillD = `${pathD} L 100 100 L 0 100 Z`;
  return (
    <div className="relative h-32">
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="w-full h-full"
        role="img"
        aria-label="Chart"
      >
        <defs>
          <linearGradient id="lineGrad" x1="0" x2="0" y1="0" y2="1">
            <stop
              offset="0%"
              stopColor="oklch(0.78 0.18 200)"
              stopOpacity="0.3"
            />
            <stop
              offset="100%"
              stopColor="oklch(0.78 0.18 200)"
              stopOpacity="0"
            />
          </linearGradient>
        </defs>
        <path d={fillD} fill="url(#lineGrad)" />
        <path
          d={pathD}
          fill="none"
          stroke="oklch(0.78 0.18 200)"
          strokeWidth="2"
        />
        {pts.map((p, _i) => (
          <circle
            key={`${p.x}-${p.y}`}
            cx={p.x}
            cy={p.y}
            r="2"
            fill="oklch(0.78 0.18 200)"
          />
        ))}
      </svg>
      <div className="flex justify-between mt-1">
        {data.map((d) => (
          <span
            key={d.label}
            className="font-mono text-[9px] text-muted-foreground"
          >
            {d.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  accent,
}: { icon: React.ElementType; label: string; value: string; accent: string }) {
  return (
    <div className="bg-background border border-border rounded-xl p-4 flex items-center gap-3 hover:border-primary/40 transition-colors">
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: `${accent}20`, color: accent }}
      >
        <Icon size={16} />
      </div>
      <div className="min-w-0">
        <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
          {label}
        </p>
        <p className="font-display font-bold text-base text-foreground truncate">
          {value}
        </p>
      </div>
    </div>
  );
}

function DashboardTab({ analytics }: { analytics: AnalyticsData | null }) {
  const { notes } = useAppContext();
  const totalNotes = analytics ? Number(analytics.totalNotes) : notes.length;
  const totalUsers = analytics ? Number(analytics.totalUsers) : 0;
  const totalDownloads = analytics ? Number(analytics.totalDownloads) : 0;
  const flaggedNotes = analytics ? Number(analytics.flaggedNotes) : 0;
  const removedNotes = analytics ? Number(analytics.removedNotes) : 0;
  const totalCredits = analytics ? Number(analytics.totalCreditsAwarded) : 0;
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          icon={FileText}
          label="Total Notes"
          value={totalNotes.toString()}
          accent="oklch(0.78 0.18 200)"
        />
        <StatCard
          icon={Users}
          label="Total Users"
          value={totalUsers.toString()}
          accent="oklch(0.65 0.22 290)"
        />
        <StatCard
          icon={Download}
          label="Downloads"
          value={totalDownloads.toString()}
          accent="oklch(0.72 0.22 155)"
        />
        <StatCard
          icon={AlertTriangle}
          label="Flagged"
          value={flaggedNotes.toString()}
          accent="oklch(0.8 0.18 75)"
        />
        <StatCard
          icon={Trash2}
          label="Removed"
          value={removedNotes.toString()}
          accent="oklch(0.58 0.24 27)"
        />
        <StatCard
          icon={TrendingUp}
          label="Credits"
          value={totalCredits.toLocaleString()}
          accent="oklch(0.78 0.18 200)"
        />
      </div>
      {analytics && analytics.topContributors.length > 0 && (
        <div className="bg-background border border-border rounded-xl p-4">
          <h3 className="font-display font-bold text-sm neon-text-cyan mb-3 flex items-center gap-2">
            <TrendingUp size={14} /> Top Contributors
          </h3>
          <div className="space-y-2">
            {analytics.topContributors.slice(0, 5).map((c, i) => (
              <div
                key={c.name}
                className="flex items-center justify-between text-xs font-mono"
              >
                <span className="flex items-center gap-2">
                  <span className="neon-text-cyan w-4">{i + 1}.</span>
                  <span className="text-foreground truncate max-w-[120px]">
                    {c.name}
                  </span>
                </span>
                <span className="text-muted-foreground">
                  {Number(c.totalEarned)} cr
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function UsersTab({ users }: { users: UserAdminView[] }) {
  const banUser = useBanUser();
  const suspendUser = useSuspendUser();
  const unsuspendUser = useUnsuspendUser();
  const [search, setSearch] = useState("");
  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <div className="space-y-4">
      <Input
        placeholder="Search users…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        data-ocid="admin.users.search_input"
        className="font-mono text-xs h-8 bg-muted/20 border-border focus:border-primary/60"
      />
      {filtered.length === 0 ? (
        <div data-ocid="admin.users.empty_state" className="text-center py-12">
          <Users size={28} className="mx-auto text-muted-foreground mb-2" />
          <p className="font-mono text-xs text-muted-foreground">
            No users found
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((u, i) => {
            const st = statusLabel(u.status);
            const isActive = u.status.__kind__ === "active";
            const isSuspended = u.status.__kind__ === "suspended";
            return (
              <div
                key={u.principal.toString()}
                data-ocid={`admin.users.item.${i + 1}`}
                className="bg-background border border-border rounded-xl p-3 space-y-2 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-display font-bold text-sm text-foreground truncate">
                      {u.name}
                    </p>
                    <p className="font-mono text-[10px] text-muted-foreground truncate">
                      {u.principal.toString().slice(0, 20)}…
                    </p>
                  </div>
                  <span
                    className={`font-mono text-[10px] font-bold shrink-0 ${st.color}`}
                  >
                    {st.label}
                  </span>
                </div>
                <div className="flex gap-3 text-[10px] font-mono text-muted-foreground">
                  <span>⬆ {Number(u.totalUploads)} uploads</span>
                  <span>💰 {Number(u.totalEarned)} earned</span>
                  <span>💳 {Number(u.credits)} credits</span>
                </div>
                <div className="flex gap-2">
                  {isActive && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          suspendUser.mutate(
                            {
                              target: u.principal.toString(),
                              reason: "Admin action",
                            },
                            {
                              onSuccess: () =>
                                toast.success(`Suspended ${u.name}`),
                              onError: () => toast.error("Failed"),
                            },
                          )
                        }
                        disabled={suspendUser.isPending}
                        data-ocid={`admin.users.suspend_button.${i + 1}`}
                        className="h-6 text-[10px] font-mono border-warning/40 text-warning hover:bg-warning/10 px-2"
                      >
                        Suspend
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          banUser.mutate(
                            {
                              target: u.principal.toString(),
                              reason: "Admin action",
                            },
                            {
                              onSuccess: () =>
                                toast.success(`Banned ${u.name}`),
                              onError: () => toast.error("Failed"),
                            },
                          )
                        }
                        disabled={banUser.isPending}
                        data-ocid={`admin.users.ban_button.${i + 1}`}
                        className="h-6 text-[10px] font-mono border-destructive/40 text-destructive hover:bg-destructive/10 px-2"
                      >
                        Ban
                      </Button>
                    </>
                  )}
                  {isSuspended && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        unsuspendUser.mutate(u.principal.toString(), {
                          onSuccess: () =>
                            toast.success(`Unsuspended ${u.name}`),
                          onError: () => toast.error("Failed"),
                        })
                      }
                      disabled={unsuspendUser.isPending}
                      data-ocid={`admin.users.unsuspend_button.${i + 1}`}
                      className="h-6 text-[10px] font-mono border-primary/40 text-primary hover:bg-primary/10 px-2"
                    >
                      Unsuspend
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ModerationTab({
  items,
  localNotes,
  onDeleteLocal,
  onQualityUpdate,
}: {
  items: ModerationItem[];
  localNotes: ReturnType<typeof useAppContext>["notes"];
  onDeleteLocal: (id: number) => void;
  onQualityUpdate: (id: number, stars: string) => void;
}) {
  const removeNote = useRemoveNote();
  return (
    <div className="space-y-5">
      {items.length > 0 && (
        <div>
          <h3 className="font-display font-bold text-sm neon-text-amber mb-3 flex items-center gap-2">
            <AlertTriangle size={14} /> Flagged Notes ({items.length})
          </h3>
          <div className="space-y-2">
            {items.map((item, i) => (
              <div
                key={item.noteId.toString()}
                data-ocid={`admin.moderation.item.${i + 1}`}
                className="bg-background border border-warning/30 rounded-xl p-3 space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-display font-bold text-sm text-foreground truncate">
                      {item.noteTitle}
                    </p>
                    <p className="font-mono text-[10px] text-muted-foreground">
                      {item.flagReason} · {formatTs(item.flaggedAt)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    data-ocid={`admin.moderation.remove_button.${i + 1}`}
                    onClick={() =>
                      removeNote.mutate(item.noteId, {
                        onSuccess: () =>
                          toast.success(`Removed "${item.noteTitle}"`),
                        onError: () => toast.error("Failed"),
                      })
                    }
                    disabled={removeNote.isPending}
                    className="h-7 px-2 text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 size={12} />
                  </Button>
                </div>
                {item.aiFlags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {item.aiFlags.map((f, fi) => (
                      <Badge
                        key={`${item.noteId.toString()}-flag-${fi}`}
                        variant="outline"
                        className="text-[9px] font-mono border-warning/40 text-warning px-1.5"
                      >
                        {f}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      <div>
        <h3 className="font-display font-bold text-sm neon-text-cyan mb-3 flex items-center gap-2">
          <FileText size={14} /> All Notes ({localNotes.length})
        </h3>
        {localNotes.length === 0 ? (
          <div
            data-ocid="admin.moderation.empty_state"
            className="text-center py-8"
          >
            <FileText
              size={24}
              className="mx-auto text-muted-foreground mb-2"
            />
            <p className="font-mono text-xs text-muted-foreground">
              No notes yet
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {localNotes.map((note, ni) => (
              <div
                key={note.id}
                data-ocid={`admin.note.card.${ni + 1}`}
                className="bg-background rounded-xl border border-border p-3 space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h4 className="font-display font-bold text-xs text-foreground line-clamp-1">
                      {note.title}
                    </h4>
                    <p className="text-[10px] text-muted-foreground font-mono">
                      {note.uploaderName} · {note.subject}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Select
                      defaultValue={note.qualityStars.toString()}
                      onValueChange={(v) => onQualityUpdate(note.id, v)}
                    >
                      <SelectTrigger
                        data-ocid={`admin.quality.select.${ni + 1}`}
                        className="w-20 h-6 text-[10px] font-mono bg-muted/40"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5].map((s) => (
                          <SelectItem key={s} value={s.toString()}>
                            {s} ★
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteLocal(note.id)}
                      data-ocid={`admin.note.delete_button.${ni + 1}`}
                      className="h-6 w-6 p-0 text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 size={11} />
                    </Button>
                  </div>
                </div>
                <div className="flex gap-3 text-[10px] font-mono text-muted-foreground">
                  <span className="flex items-center gap-1">
                    {[0, 1, 2, 3, 4].map((s) => (
                      <Star
                        key={s}
                        size={9}
                        className={
                          s < note.qualityStars
                            ? "text-chart-4 fill-chart-4"
                            : "text-muted"
                        }
                      />
                    ))}
                  </span>
                  <span>⬇ {note.downloadCount}</span>
                  <span>💲 {note.price}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AnalyticsTab({ analytics }: { analytics: AnalyticsData | null }) {
  const handleExportCSV = () => {
    if (!analytics) {
      toast.error("No analytics data");
      return;
    }
    const rows = [
      ["Subject", "Downloads"],
      ...analytics.downloadsPerSubject.map((s) => [
        s.subject,
        Number(s.downloadCount).toString(),
      ]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "grow-analytics.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported!");
  };
  const subjectData = analytics
    ? analytics.downloadsPerSubject.map((s) => ({
        label: s.subject,
        value: Number(s.downloadCount),
      }))
    : [];
  const weeklyData = analytics
    ? analytics.weeklyUploads.map((w) => ({
        label: w.weekLabel,
        value: Number(w.count),
      }))
    : [];
  if (!analytics)
    return (
      <div
        data-ocid="admin.analytics.loading_state"
        className="text-center py-16"
      >
        <BarChart3 size={32} className="mx-auto text-muted-foreground mb-3" />
        <p className="font-mono text-xs text-muted-foreground">
          Loading analytics…
        </p>
      </div>
    );
  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={handleExportCSV}
          data-ocid="admin.analytics.export_button"
          className="font-mono text-xs h-7 border-primary/40 text-primary hover:bg-primary/10"
        >
          <Download size={12} className="mr-1" /> Export CSV
        </Button>
      </div>
      {subjectData.length > 0 && (
        <div className="bg-background border border-border rounded-xl p-4">
          <h3 className="font-display font-bold text-sm neon-text-cyan mb-4 flex items-center gap-2">
            <BarChart3 size={14} /> Downloads by Subject
          </h3>
          <BarChartCSS data={subjectData} />
        </div>
      )}
      {weeklyData.length > 0 && (
        <div className="bg-background border border-border rounded-xl p-4">
          <h3 className="font-display font-bold text-sm neon-text-violet mb-4 flex items-center gap-2">
            <TrendingUp size={14} /> Weekly Uploads
          </h3>
          <LineChartCSS data={weeklyData} />
        </div>
      )}
      {analytics.topContributors.length > 0 && (
        <div className="bg-background border border-border rounded-xl p-4">
          <h3 className="font-display font-bold text-sm neon-text-green mb-3 flex items-center gap-2">
            <TrendingUp size={14} /> Top Contributors
          </h3>
          <div className="space-y-2">
            {analytics.topContributors.map((c, i) => (
              <div
                key={c.name}
                className="flex items-center gap-3 text-xs font-mono"
              >
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                  style={{
                    background:
                      i === 0
                        ? "oklch(0.8 0.18 75 / 0.3)"
                        : "oklch(0.78 0.18 200 / 0.15)",
                    color:
                      i === 0 ? "oklch(0.8 0.18 75)" : "oklch(0.78 0.18 200)",
                  }}
                >
                  {i + 1}
                </span>
                <span className="flex-1 text-foreground truncate">
                  {c.name}
                </span>
                <span className="text-muted-foreground">
                  {Number(c.totalUploads)} uploads
                </span>
                <span className="neon-text-cyan">
                  {Number(c.totalEarned)} cr
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      {subjectData.length === 0 &&
        weeklyData.length === 0 &&
        analytics.topContributors.length === 0 && (
          <div
            data-ocid="admin.analytics.empty_state"
            className="text-center py-12"
          >
            <BarChart3
              size={28}
              className="mx-auto text-muted-foreground mb-2"
            />
            <p className="font-mono text-xs text-muted-foreground">
              Analytics will appear as students use the platform
            </p>
          </div>
        )}
    </div>
  );
}

function AILogsTab({ logs }: { logs: AILogEntry[] }) {
  function scoreColor(score: bigint) {
    const n = Number(score);
    if (n >= 80) return "neon-text-green";
    if (n >= 50) return "neon-text-amber";
    return "text-destructive";
  }
  if (logs.length === 0)
    return (
      <div data-ocid="admin.ailogs.empty_state" className="text-center py-16">
        <Bot size={32} className="mx-auto text-muted-foreground mb-3" />
        <p className="font-mono text-xs text-muted-foreground">
          No AI analysis logs yet
        </p>
        <p className="font-mono text-[10px] text-muted-foreground/60 mt-1">
          Logs appear after notes are analyzed
        </p>
      </div>
    );
  return (
    <div className="space-y-2">
      {logs.map((log, i) => (
        <div
          key={log.noteId.toString()}
          data-ocid={`admin.ailogs.item.${i + 1}`}
          className="bg-background border border-border rounded-xl p-3 space-y-2 hover:border-primary/30 transition-colors"
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <Bot size={12} className="text-primary shrink-0" />
              <span className="font-mono text-[10px] text-muted-foreground truncate">
                Note #{log.noteId.toString()}
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span
                className={`font-mono text-xs font-bold ${scoreColor(log.score)}`}
              >
                {Number(log.score)}/100
              </span>
              <span className="font-mono text-[9px] text-muted-foreground">
                {formatTs(log.timestamp)}
              </span>
            </div>
          </div>
          {log.flags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {log.flags.map((f, fi) => (
                <Badge
                  key={`${log.noteId.toString()}-flag-${fi}`}
                  variant="outline"
                  className="text-[9px] font-mono border-warning/40 text-warning px-1.5"
                >
                  {f}
                </Badge>
              ))}
            </div>
          )}
          {log.similarityPercent !== undefined &&
            log.similarityPercent !== null && (
              <p className="font-mono text-[10px] text-muted-foreground">
                Similarity: {Number(log.similarityPercent)}%
                {log.similarNoteId !== undefined && log.similarNoteId !== null
                  ? ` (Note #${log.similarNoteId})`
                  : ""}
              </p>
            )}
        </div>
      ))}
    </div>
  );
}

function SettingsTab() {
  const { data: hasKey } = useGetOpenAIKey();
  const setKey = useSetOpenAIKey();
  const [keyInput, setKeyInput] = useState("");
  const [revealed, setRevealed] = useState(false);
  return (
    <div className="space-y-5">
      <div className="bg-background border border-border rounded-xl p-4 space-y-4">
        <div className="flex items-center gap-2">
          <Key size={14} className="text-primary" />
          <h3 className="font-display font-bold text-sm neon-text-cyan">
            OpenAI API Key
          </h3>
          {hasKey ? (
            <Badge className="text-[9px] font-mono bg-accent/20 text-accent border-accent/30">
              <CheckCircle size={9} className="mr-1" /> Configured
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="text-[9px] font-mono border-destructive/40 text-destructive"
            >
              <XCircle size={9} className="mr-1" /> Not set
            </Badge>
          )}
        </div>
        <p className="font-mono text-[10px] text-muted-foreground">
          Required for AI note quality analysis. Stored securely in the backend
          canister.
        </p>
        <div className="space-y-2">
          <Label
            htmlFor="openai-key"
            className="font-mono text-xs text-muted-foreground"
          >
            {hasKey ? "Update API Key" : "Set API Key"}
          </Label>
          <div className="flex gap-2">
            <Input
              id="openai-key"
              type={revealed ? "text" : "password"}
              placeholder="sk-…"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              data-ocid="admin.settings.openai_key_input"
              className="font-mono text-xs h-8 bg-muted/20 border-border focus:border-primary/60 flex-1"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setRevealed(!revealed)}
              data-ocid="admin.settings.reveal_key_button"
              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
            >
              <Eye size={14} />
            </Button>
          </div>
          <Button
            type="button"
            onClick={() => {
              if (!keyInput.trim()) {
                toast.error("Enter a valid API key");
                return;
              }
              setKey.mutate(keyInput.trim(), {
                onSuccess: () => {
                  toast.success("OpenAI API key saved!");
                  setKeyInput("");
                },
                onError: () => toast.error("Failed"),
              });
            }}
            disabled={setKey.isPending || !keyInput.trim()}
            data-ocid="admin.settings.save_key_button"
            className="w-full h-8 font-mono text-xs bg-primary/20 text-primary border border-primary/40 hover:bg-primary/30"
          >
            {setKey.isPending ? "Saving…" : "Save API Key"}
          </Button>
        </div>
      </div>
      <div className="bg-background border border-border/50 rounded-xl p-4 space-y-2">
        <h3 className="font-display font-bold text-sm text-foreground flex items-center gap-2">
          <Shield size={14} className="text-primary" /> Platform Info
        </h3>
        <div className="space-y-1 font-mono text-[10px] text-muted-foreground">
          <p>• Admin dashboard protected by Internet Identity</p>
          <p>• AI analysis uses admin-configured OpenAI key</p>
          <p>• All data stored on-chain in Motoko canister</p>
          <p>• Duplicate detection threshold: 80% similarity</p>
        </div>
      </div>
    </div>
  );
}

export default function AdminPanel({ open, onClose }: AdminPanelProps) {
  const { notes, updateNoteQuality, deleteNote, isAdmin } = useAppContext();
  const { playAdminAction, playError } = useSound();
  const { data: analytics } = useGetAdminAnalytics();
  const { data: moderationItems = [] } = useGetModerationQueue();
  const { data: userList = [] } = useGetUserList();
  const { data: aiLogs = [] } = useGetAILogs();

  const handleQualityUpdate = (id: number, starsStr: string) => {
    updateNoteQuality(id, Number.parseInt(starsStr));
    playAdminAction();
    toast.success("Quality updated!");
  };

  const handleDelete = (id: number) => {
    const note = notes.find((n) => n.id === id);
    deleteNote(id);
    playError();
    toast.success(`Deleted "${note?.title ?? "note"}"`);
  };

  if (!isAdmin) {
    return (
      <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-xl bg-card border-l border-border"
        >
          <div
            data-ocid="admin.unauthorized_state"
            className="flex flex-col items-center justify-center h-full gap-4"
          >
            <Shield size={40} className="text-destructive" />
            <p className="font-display font-bold text-lg neon-text-cyan">
              Admin Access Required
            </p>
            <p className="font-mono text-xs text-muted-foreground text-center">
              Login with admin credentials to access this panel.
            </p>
            <Button
              variant="outline"
              onClick={onClose}
              data-ocid="admin.unauthorized.close_button"
            >
              Close
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-2xl bg-card border-l border-primary/20 overflow-y-auto flex flex-col"
        data-ocid="admin.panel"
      >
        <SheetHeader className="mb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center">
              <UserCog size={16} className="text-primary" />
            </div>
            <div>
              <SheetTitle className="font-display text-lg neon-text-cyan">
                G.R.O.W Admin Dashboard
              </SheetTitle>
              <SheetDescription className="font-mono text-[10px]">
                Platform management &amp; AI moderation
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>
        <Tabs defaultValue="dashboard" className="flex-1 flex flex-col min-h-0">
          <TabsList
            className="grid grid-cols-6 h-8 bg-muted/30 border border-border/50 rounded-lg mb-4 shrink-0"
            data-ocid="admin.tabs"
          >
            {(
              [
                { value: "dashboard", icon: Activity, label: "Dash" },
                { value: "users", icon: Users, label: "Users" },
                { value: "moderation", icon: Shield, label: "Mod" },
                { value: "analytics", icon: BarChart3, label: "Stats" },
                { value: "ailogs", icon: Bot, label: "AI" },
                { value: "settings", icon: Key, label: "Setup" },
              ] as const
            ).map(({ value, icon: Icon, label }) => (
              <TabsTrigger
                key={value}
                value={value}
                data-ocid={`admin.tab.${value}`}
                className="font-mono text-[10px] h-full data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:shadow-none rounded-md flex items-center gap-1 px-1"
              >
                <Icon size={11} />
                <span className="hidden sm:inline">{label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="flex-1 overflow-y-auto pr-1">
            <TabsContent value="dashboard" className="mt-0">
              <DashboardTab analytics={analytics ?? null} />
            </TabsContent>
            <TabsContent value="users" className="mt-0">
              <UsersTab users={userList} />
            </TabsContent>
            <TabsContent value="moderation" className="mt-0">
              <ModerationTab
                items={moderationItems}
                localNotes={notes}
                onDeleteLocal={handleDelete}
                onQualityUpdate={handleQualityUpdate}
              />
            </TabsContent>
            <TabsContent value="analytics" className="mt-0">
              <AnalyticsTab analytics={analytics ?? null} />
            </TabsContent>
            <TabsContent value="ailogs" className="mt-0">
              <AILogsTab logs={aiLogs} />
            </TabsContent>
            <TabsContent value="settings" className="mt-0">
              <SettingsTab />
            </TabsContent>
          </div>
        </Tabs>
        <div className="mt-4 pt-3 border-t border-border/50 shrink-0">
          <Button
            variant="outline"
            onClick={onClose}
            data-ocid="admin.panel.close_button"
            className="w-full font-mono text-xs h-8 border-border hover:border-primary/40"
          >
            Close Admin Panel
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
