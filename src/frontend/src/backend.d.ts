import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Note {
    id: NoteId;
    creditsAwarded: bigint;
    title: string;
    uploaderName: string;
    subject: string;
    description: string;
    qualityStars: bigint;
    uploaderPrincipal: UserId;
    timestamp: Timestamp;
    downloadCount: bigint;
    price: bigint;
    aiScore?: bigint;
    isFlagged: boolean;
    isRemoved: boolean;
    fileRef: string;
}
export type NoteId = bigint;
export interface UserAdminView {
    status: AccountStatus;
    principal: UserId;
    credits: bigint;
    name: string;
    joinedAt: Timestamp;
    totalEarned: bigint;
    totalUploads: bigint;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface TopContributor {
    principal: UserId;
    name: string;
    totalEarned: bigint;
    avgAIScore?: bigint;
    totalUploads: bigint;
}
export type Timestamp = bigint;
export interface ModerationItem {
    noteId: NoteId;
    flagReason: string;
    noteTitle: string;
    aiFlags: Array<string>;
    uploaderPrincipal: UserId;
    flaggedAt: Timestamp;
}
export interface AnalyticsData {
    topContributors: Array<TopContributor>;
    removedNotes: bigint;
    downloadsPerSubject: Array<SubjectDownloadStat>;
    totalCreditsAwarded: bigint;
    totalNotes: bigint;
    weeklyUploads: Array<WeeklyUploadPoint>;
    totalUsers: bigint;
    totalDownloads: bigint;
    flaggedNotes: bigint;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export type UserId = Principal;
export interface AIAnalysisResult {
    flags: Array<string>;
    noteId: NoteId;
    suggestedTitle: string;
    similarityPercent?: bigint;
    score: bigint;
    suggestedTags: Array<string>;
    similarNoteId?: NoteId;
    timestamp: Timestamp;
}
export interface NoteInput {
    title: string;
    uploaderName: string;
    subject: string;
    description: string;
    price: bigint;
    fileRef: string;
}
export type AccountStatus = {
    __kind__: "active";
    active: null;
} | {
    __kind__: "banned";
    banned: {
        adminPrincipal: UserId;
        timestamp: Timestamp;
        reason: string;
    };
} | {
    __kind__: "suspended";
    suspended: {
        until?: Timestamp;
        reason: string;
    };
};
export interface AILogEntry {
    flags: Array<string>;
    noteId: NoteId;
    similarityPercent?: bigint;
    score: bigint;
    similarNoteId?: NoteId;
    timestamp: Timestamp;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface WeeklyUploadPoint {
    count: bigint;
    weekLabel: string;
}
export interface UserProfile {
    principal: UserId;
    credits: bigint;
    name: string;
    joinedAt: Timestamp;
    totalEarned: bigint;
    totalUploads: bigint;
}
export interface SubjectDownloadStat {
    subject: string;
    downloadCount: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addCredits(user: UserId, amount: bigint): Promise<void>;
    analyzeNoteQuality(noteId: NoteId): Promise<AIAnalysisResult>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    banUser(target: UserId, reason: string): Promise<void>;
    downloadNote(noteId: NoteId): Promise<void>;
    flagNote(noteId: NoteId, reason: string): Promise<void>;
    getAIAnalysisResult(noteId: NoteId): Promise<AIAnalysisResult | null>;
    getAILogs(): Promise<Array<AILogEntry>>;
    getAdminAnalytics(): Promise<AnalyticsData>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getLeaderboard(): Promise<Array<UserProfile>>;
    getModerationQueue(): Promise<Array<ModerationItem>>;
    getMyCredits(): Promise<bigint>;
    getNote(noteId: NoteId): Promise<Note | null>;
    getNotes(): Promise<Array<Note>>;
    getOpenAIKey(): Promise<boolean>;
    getPlatformStats(): Promise<{
        totalCreditsAwarded: bigint;
        totalDownloads: bigint;
        totalUploads: bigint;
    }>;
    getRecentUploads(limit: bigint): Promise<Array<Note>>;
    getUserList(): Promise<Array<UserAdminView>>;
    getUserProfile(user: UserId): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    removeNote(noteId: NoteId): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setOpenAIKey(key: string): Promise<void>;
    suspendUser(target: UserId, reason: string, until: Timestamp | null): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    unsuspendUser(target: UserId): Promise<void>;
    updateQuality(noteId: NoteId, stars: bigint): Promise<void>;
    uploadNoteWithFile(input: NoteInput): Promise<NoteId>;
}
