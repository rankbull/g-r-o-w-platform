import { useCallback, useRef } from "react";

export function useSound() {
  const ctxRef = useRef<AudioContext | null>(null);

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      try {
        ctxRef.current = new AudioContext();
      } catch {
        return null;
      }
    }
    // Resume if suspended (browser autoplay policy)
    if (ctxRef.current.state === "suspended") {
      ctxRef.current.resume();
    }
    return ctxRef.current;
  }, []);

  const playTone = useCallback(
    (
      freqStart: number,
      freqEnd: number,
      duration: number,
      gain: number,
      type: OscillatorType = "sine",
      startTime?: number,
    ) => {
      const ctx = getCtx();
      if (!ctx) return;
      try {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        osc.type = type;
        const t = startTime ?? ctx.currentTime;
        osc.frequency.setValueAtTime(freqStart, t);
        if (freqEnd !== freqStart) {
          osc.frequency.exponentialRampToValueAtTime(
            freqEnd,
            t + duration / 1000,
          );
        }
        gainNode.gain.setValueAtTime(gain, t);
        gainNode.gain.exponentialRampToValueAtTime(0.001, t + duration / 1000);
        osc.start(t);
        osc.stop(t + duration / 1000);
      } catch {
        /* silent fail */
      }
    },
    [getCtx],
  );

  // Very subtle tick on hover
  const playHover = useCallback(() => {
    playTone(800, 800, 30, 0.05, "sine");
  }, [playTone]);

  // Synth blip on click
  const playClick = useCallback(() => {
    playTone(200, 400, 80, 0.08, "square");
  }, [playTone]);

  // Ascending 3-note chime: C5→E5→G5
  const playUploadSuccess = useCallback(() => {
    const ctx = getCtx();
    if (!ctx) return;
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
    notes.forEach((freq, i) => {
      playTone(freq, freq, 150, 0.07, "sine", ctx.currentTime + i * 0.18);
    });
  }, [getCtx, playTone]);

  // Coin shimmer: 1200Hz + harmonics
  const playCreditEarned = useCallback(() => {
    const ctx = getCtx();
    if (!ctx) return;
    try {
      // Base shimmer
      playTone(1200, 1200, 400, 0.06, "sine");
      // Harmonic at 2400Hz
      playTone(2400, 2400, 300, 0.03, "sine");
      // Descending tail
      playTone(900, 600, 200, 0.04, "sine", ctx.currentTime + 0.15);
    } catch {
      /* silent */
    }
  }, [getCtx, playTone]);

  // Quick whoosh on tab switch
  const playTabSwitch = useCallback(() => {
    playTone(400, 800, 100, 0.05, "sine");
  }, [playTone]);

  // Low power tone for admin actions
  const playAdminAction = useCallback(() => {
    playTone(80, 80, 200, 0.07, "sine");
  }, [playTone]);

  // Descending buzz for errors
  const playError = useCallback(() => {
    playTone(300, 150, 150, 0.06, "square");
  }, [playTone]);

  // Success alias
  const playSuccess = playUploadSuccess;

  return {
    playHover,
    playClick,
    playUploadSuccess,
    playCreditEarned,
    playTabSwitch,
    playAdminAction,
    playError,
    playSuccess,
  };
}
