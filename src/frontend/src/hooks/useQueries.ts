import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  AILogEntry,
  AnalyticsData,
  ModerationItem,
  Note,
  NoteInput,
  UserAdminView,
  UserProfile,
} from "../backend.d";
import { useActor } from "./useActor";

type PlatformStats = {
  totalCreditsAwarded: bigint;
  totalDownloads: bigint;
  totalUploads: bigint;
};

export function useGetNotes() {
  const { actor, isFetching } = useActor();
  return useQuery<Note[]>({
    queryKey: ["notes"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getNotes();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetRecentUploads(limit: number) {
  const { actor, isFetching } = useActor();
  return useQuery<Note[]>({
    queryKey: ["recentUploads", limit],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getRecentUploads(BigInt(limit));
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 8000,
  });
}

export function useGetPlatformStats() {
  const { actor, isFetching } = useActor();
  return useQuery<PlatformStats>({
    queryKey: ["platformStats"],
    queryFn: async () => {
      if (!actor)
        return {
          totalCreditsAwarded: BigInt(0),
          totalDownloads: BigInt(0),
          totalUploads: BigInt(0),
        };
      return actor.getPlatformStats();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 10000,
  });
}

export function useGetLeaderboard() {
  const { actor, isFetching } = useActor();
  return useQuery<UserProfile[]>({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLeaderboard();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetMyCredits() {
  const { actor, isFetching } = useActor();
  return useQuery<bigint>({
    queryKey: ["myCredits"],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getMyCredits();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 15000,
  });
}

export function useGetCallerProfile() {
  const { actor, isFetching } = useActor();
  return useQuery<UserProfile | null>({
    queryKey: ["callerProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUploadNote() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: NoteInput) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.uploadNoteWithFile(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.invalidateQueries({ queryKey: ["recentUploads"] });
      queryClient.invalidateQueries({ queryKey: ["platformStats"] });
      queryClient.invalidateQueries({ queryKey: ["myCredits"] });
      queryClient.invalidateQueries({ queryKey: ["callerProfile"] });
    },
  });
}

export function useDownloadNote() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (noteId: bigint) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.downloadNote(noteId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.invalidateQueries({ queryKey: ["myCredits"] });
    },
  });
}

export function useUpdateQuality() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      noteId,
      stars,
    }: { noteId: bigint; stars: bigint }) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.updateQuality(noteId, stars);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
    },
  });
}

export function useInitializeSeedData() {
  return useMutation({
    mutationFn: async () => {
      return Promise.resolve();
    },
  });
}

export function useGetAdminAnalytics() {
  const { actor, isFetching } = useActor();
  return useQuery<AnalyticsData | null>({
    queryKey: ["adminAnalytics"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getAdminAnalytics();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30000,
  });
}

export function useGetModerationQueue() {
  const { actor, isFetching } = useActor();
  return useQuery<ModerationItem[]>({
    queryKey: ["moderationQueue"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getModerationQueue();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetUserList() {
  const { actor, isFetching } = useActor();
  return useQuery<UserAdminView[]>({
    queryKey: ["userList"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUserList();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAILogs() {
  const { actor, isFetching } = useActor();
  return useQuery<AILogEntry[]>({
    queryKey: ["aiLogs"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAILogs();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useBanUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      target,
      reason,
    }: { target: string; reason: string }) => {
      if (!actor) throw new Error("Not authenticated");
      const { Principal } = await import("@icp-sdk/core/principal");
      return actor.banUser(Principal.fromText(target), reason);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userList"] });
      queryClient.invalidateQueries({ queryKey: ["adminAnalytics"] });
    },
  });
}

export function useSuspendUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      target,
      reason,
    }: { target: string; reason: string }) => {
      if (!actor) throw new Error("Not authenticated");
      const { Principal } = await import("@icp-sdk/core/principal");
      return actor.suspendUser(Principal.fromText(target), reason, null);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userList"] });
    },
  });
}

export function useUnsuspendUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (target: string) => {
      if (!actor) throw new Error("Not authenticated");
      const { Principal } = await import("@icp-sdk/core/principal");
      return actor.unsuspendUser(Principal.fromText(target));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userList"] });
    },
  });
}

export function useRemoveNote() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (noteId: bigint) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.removeNote(noteId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.invalidateQueries({ queryKey: ["moderationQueue"] });
      queryClient.invalidateQueries({ queryKey: ["adminAnalytics"] });
    },
  });
}

export function useFlagNote() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      noteId,
      reason,
    }: { noteId: bigint; reason: string }) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.flagNote(noteId, reason);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["moderationQueue"] });
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
}

export function useAnalyzeNote() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (noteId: bigint) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.analyzeNoteQuality(noteId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.invalidateQueries({ queryKey: ["aiLogs"] });
    },
  });
}

export function useSaveCallerProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["callerProfile"] });
    },
  });
}

export function useSetOpenAIKey() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (key: string) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.setOpenAIKey(key);
    },
  });
}

export function useGetOpenAIKey() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["openAIKey"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.getOpenAIKey();
    },
    enabled: !!actor && !isFetching,
  });
}
