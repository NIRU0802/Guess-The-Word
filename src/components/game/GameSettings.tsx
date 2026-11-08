
"use client";

import {
  Bell,
  SkipForward,
  Volume2,
  VolumeX,
  Vibrate,
  X,
  Check,
} from "lucide-react";

const AVAILABLE_WARNINGS = [30, 10, 5, 3, 2, 1];

type GameSettingsProps = {
  open: boolean;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  autoNextEnabled: boolean;
  warningSeconds: number[];
  onSoundChange: (value: boolean) => void;
  onHapticsChange: (value: boolean) => void;
  onAutoNextChange: (value: boolean) => void;
  onToggleWarning: (seconds: number) => void;
  onClose: () => void;
};

export default function GameSettings({
  open,
  soundEnabled,
  hapticsEnabled,
  autoNextEnabled,
  warningSeconds,
  onSoundChange,
  onHapticsChange,
  onAutoNextChange,
  onToggleWarning,
  onClose,
}: GameSettingsProps) {
  if (!open) return null;

  return (
    <div
      className="mobile-settings-backdrop forge-settings-backdrop"
      onClick={onClose}
    >
      <section
        className="mobile-settings-panel forge-settings-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-settings-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mobile-settings-header forge-settings-header">
          <div>
            <span className="mobile-section-label">
              GAME PREFERENCES
            </span>

            <h2 id="mobile-settings-title">
              Timer settings
            </h2>

            <p className="forge-settings-description">
              Customize your game experience.
            </p>
          </div>

          <button
            type="button"
            className="mobile-settings-close forge-settings-close"
            onClick={onClose}
            aria-label="Close settings"
          >
            <X size={19} />
          </button>
        </div>

        <div className="mobile-settings-options forge-settings-options">
          <label className="mobile-setting-row forge-setting-row">
            <span className="mobile-setting-icon">
              {soundEnabled ? (
                <Volume2 size={19} />
              ) : (
                <VolumeX size={19} />
              )}
            </span>

            <span className="mobile-setting-copy">
              <strong>Sound effects</strong>
              <small>Countdown and time-up sounds</small>
            </span>

            <span className="forge-switch">
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={(event) =>
                  onSoundChange(event.target.checked)
                }
              />
              <span className="forge-switch-track" />
            </span>
          </label>

          <label className="mobile-setting-row forge-setting-row">
            <span className="mobile-setting-icon">
              <Vibrate size={19} />
            </span>

            <span className="mobile-setting-copy">
              <strong>Haptic feedback</strong>
              <small>Vibration on supported devices</small>
            </span>

            <span className="forge-switch">
              <input
                type="checkbox"
                checked={hapticsEnabled}
                onChange={(event) =>
                  onHapticsChange(event.target.checked)
                }
              />
              <span className="forge-switch-track" />
            </span>
          </label>

          <label className="mobile-setting-row forge-setting-row">
            <span className="mobile-setting-icon">
              <SkipForward size={19} />
            </span>

            <span className="mobile-setting-copy">
              <strong>Automatic next word</strong>
              <small>Move on when the timer expires</small>
            </span>

            <span className="forge-switch">
              <input
                type="checkbox"
                checked={autoNextEnabled}
                onChange={(event) =>
                  onAutoNextChange(event.target.checked)
                }
              />
              <span className="forge-switch-track" />
            </span>
          </label>
        </div>

        <div className="mobile-warning-settings forge-warning-settings">
          <div className="mobile-warning-heading forge-warning-heading">
            <span className="forge-warning-icon">
              <Bell size={17} />
            </span>

            <strong>Countdown warnings</strong>
          </div>

          <p>
            Choose which remaining times trigger a warning.
          </p>

          <div className="mobile-warning-options forge-warning-options">
            {AVAILABLE_WARNINGS.map((seconds) => {
              const active = warningSeconds.includes(seconds);

              return (
                <button
                  type="button"
                  key={seconds}
                  className={active ? "active" : ""}
                  onClick={() => onToggleWarning(seconds)}
                  aria-pressed={active}
                >
                  {active && <Check size={12} />}
                  {seconds}s
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          className="forge-settings-done"
          onClick={onClose}
        >
          Done
        </button>
      </section>
    </div>
  );
}
