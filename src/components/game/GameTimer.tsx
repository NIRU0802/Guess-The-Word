
"use client";

import { Timer } from "lucide-react";

type GameTimerProps = {
  remainingSeconds: number;
  totalSeconds: number;
  isRunning: boolean;
};

export default function GameTimer({
  remainingSeconds,
  totalSeconds,
  isRunning,
}: GameTimerProps) {
  const safeRemaining = Math.max(0, remainingSeconds);
  const safeTotal = Math.max(1, totalSeconds);

  const progress = Math.max(
    0,
    Math.min(100, (safeRemaining / safeTotal) * 100),
  );

  const formattedTime = `${Math.floor(safeRemaining / 60)
    .toString()
    .padStart(2, "0")}:${(safeRemaining % 60)
    .toString()
    .padStart(2, "0")}`;

  const timeIsCritical = safeRemaining <= 5;
  const timeIsLow = safeRemaining <= 10 && !timeIsCritical;

  const timerState = timeIsCritical
    ? "critical"
    : timeIsLow
      ? "warning"
      : "normal";

  // Derived directly from props; no effect or additional state needed.
  const pulse =
    isRunning && safeRemaining > 0 && safeRemaining <= 5;

  const circumference = 2 * Math.PI * 112;
  const dashOffset =
    circumference - (progress / 100) * circumference;

  return (
    <section
      className="mobile-timer forge-premium-timer"
      data-state={timerState}
    >
      <div className="forge-timer-heading">
        <span className="forge-timer-heading-label">
          <Timer size={15} strokeWidth={2.2} />
          TIME REMAINING
        </span>

        <span className="forge-timer-status">
          <span className="forge-timer-status-dot" />
          {safeRemaining === 0
            ? "TIME UP"
            : isRunning
              ? "LIVE"
              : "PAUSED"}
        </span>
      </div>

      <div
        className={`forge-timer-circle ${
          pulse ? "forge-timer-pulse" : ""
        }`}
      >
        <svg
          className="forge-timer-svg"
          viewBox="0 0 240 240"
          role="img"
          aria-label={`${safeRemaining} seconds remaining`}
        >
          <circle
            className="forge-timer-ring-background"
            cx="120"
            cy="120"
            r="112"
            fill="none"
            strokeWidth="5"
          />

          <circle
            className="forge-timer-ring-progress"
            cx="120"
            cy="120"
            r="112"
            fill="none"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            transform="rotate(-90 120 120)"
          />
        </svg>

        <div className="forge-timer-center">
          <span className="forge-timer-caption">
            {safeRemaining === 0
              ? "FINISHED"
              : isRunning
                ? "COUNTDOWN"
                : "READY"}
          </span>

          <div
            className="forge-timer-value"
            aria-live="off"
            aria-label={`${safeRemaining} seconds remaining`}
          >
            {formattedTime}
          </div>

          <span className="forge-timer-subtitle">
            {safeRemaining === 0
              ? "ROUND COMPLETE"
              : "MINUTES : SECONDS"}
          </span>
        </div>
      </div>

      <div className="forge-timer-bottom">
        <span>
          {safeRemaining === 0
            ? "Time is up!"
            : isRunning
              ? "Make every second count"
              : "Ready when your team is"}
        </span>

        <span className="forge-timer-percentage">
          {Math.round(progress)}%
        </span>
      </div>
    </section>
  );
}
