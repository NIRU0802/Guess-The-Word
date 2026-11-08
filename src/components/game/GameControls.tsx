
"use client";

import {
  Pause,
  Play,
  RotateCcw,
  SkipForward,
} from "lucide-react";

type GameControlsProps = {
  isRunning: boolean;
  remainingSeconds: number;
  totalSeconds: number;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onNext: () => void;
};

export default function GameControls({
  isRunning,
  remainingSeconds,
  totalSeconds,
  onStart,
  onPause,
  onReset,
  onNext,
}: GameControlsProps) {
  return (
    <footer className="mobile-game-controls">
      <div className="mobile-primary-controls">
        {isRunning ? (
          <button
            type="button"
            className="mobile-control-button mobile-control-primary"
            onClick={onPause}
          >
            <Pause size={19} />
            Pause
          </button>
        ) : (
          <button
            type="button"
            className="mobile-control-button mobile-control-primary"
            onClick={onStart}
            disabled={remainingSeconds === 0}
          >
            <Play size={19} fill="currentColor" />

            {remainingSeconds === totalSeconds
              ? "Start round"
              : remainingSeconds === 0
                ? "Time up"
                : "Resume"}
          </button>
        )}

        <button
          type="button"
          className="mobile-control-button mobile-control-secondary"
          onClick={onReset}
          aria-label="Reset timer"
        >
          <RotateCcw size={19} />
        </button>

        <button
          type="button"
          className="mobile-control-button mobile-control-secondary"
          onClick={onNext}
          aria-label="Next word"
        >
          <SkipForward size={19} />
        </button>
      </div>

      <p className="mobile-controls-caption">
        {isRunning
          ? "Give clues. Beat the clock."
          : "Ready when your team is."}
      </p>
    </footer>
  );
}
