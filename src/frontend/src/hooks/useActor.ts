import { createActor } from "@/backend";
import { useActor as useCaffeineActor } from "@caffeineai/core-infrastructure";

/**
 * Provides the typed backend actor for the G.R.O.W platform.
 * Wraps @caffeineai/core-infrastructure's useActor with the generated createActor.
 */
export function useActor() {
  return useCaffeineActor(createActor);
}
