import { useCallback, useEffect, useRef } from "react";

export function useSound(enabled) {
  const context = useRef(null);
  useEffect(
    () => () => {
      context.current?.close();
    },
    [],
  );
  return useCallback(
    (error = false) => {
      if (!enabled) return;
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        context.current ||= new AudioContext();
        const audio = context.current;
        if (audio.state === "suspended") audio.resume().catch(() => {});
        const oscillator = audio.createOscillator();
        const gain = audio.createGain();
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(
          error ? 160 : 630,
          audio.currentTime,
        );
        gain.gain.setValueAtTime(0.035, audio.currentTime);
        gain.gain.exponentialRampToValueAtTime(
          0.001,
          audio.currentTime + 0.045,
        );
        oscillator.connect(gain);
        gain.connect(audio.destination);
        oscillator.start();
        oscillator.stop(audio.currentTime + 0.05);
      } catch {
        /* Audio is optional when the browser disallows it. */
      }
    },
    [enabled],
  );
}
