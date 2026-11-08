"use client";

import { useEffect } from "react";

type UseGameTimerProps = {
  isRunning: boolean;
  remainingSeconds: number;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  warningSeconds: number[];
  onTick: (seconds: number) => void;
  onComplete: () => void;
};

function playTimerSound(isFinal: boolean) {
  if (
    typeof window === "undefined" ||
    !window.AudioContext
  ) {
    return;
  }

  try {
    const context = new window.AudioContext();
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = isFinal ? 880 : 660;

    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      isFinal ? 0.18 : 0.09,
      context.currentTime + 0.015,
    );
    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      context.currentTime + (isFinal ? 0.35 : 0.14),
    );

    oscillator.connect(gain);
    gain.connect(context.destination);

    oscillator.start();
    oscillator.stop(
      context.currentTime + (isFinal ? 0.36 : 0.15),
    );

    oscillator.onended = () => {
      void context.close();
    };
  } catch {
    // Audio is optional.
  }
}

function vibrateDevice(pattern: number | number[]) {
  if (
    typeof navigator !== "undefined" &&
    "vibrate" in navigator
  ) {
    navigator.vibrate(pattern);
  }
}

export function useGameTimer({
  isRunning,
  remainingSeconds,
  soundEnabled,
  hapticsEnabled,
  warningSeconds,
  onTick,
  onComplete,
}: UseGameTimerProps) {
  useEffect(() => {
    if (!isRunning) return;

    const timeout = window.setTimeout(() => {
      const nextSeconds = Math.max(0, remainingSeconds - 1);

      if (nextSeconds === 0) {
        if (soundEnabled) {
          playTimerSound(true);
        }

        if (hapticsEnabled) {
          vibrateDevice([180, 80, 180]);
        }

        onComplete();
        return;
      }

      if (warningSeconds.includes(nextSeconds)) {
        if (soundEnabled) {
          playTimerSound(false);
        }

        if (hapticsEnabled) {
          vibrateDevice(
            nextSeconds <= 3 ? [100, 50, 100] : 100,
          );
        }
      }

      onTick(nextSeconds);
    }, 1000);

    return () => window.clearTimeout(timeout);
  }, [
    isRunning,
    remainingSeconds,
    soundEnabled,
    hapticsEnabled,
    warningSeconds,
    onTick,
    onComplete,
  ]);
}