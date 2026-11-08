
"use client";

import { ArrowLeft, Settings2 } from "lucide-react";

type GameHeaderProps = {
  roundNumber: number;
  settingsOpen: boolean;
  onExit: () => void;
  onToggleSettings: () => void;
};

export default function GameHeader({
  roundNumber,
  settingsOpen,
  onExit,
  onToggleSettings,
}: GameHeaderProps) {
  return (
    <header className="mobile-game-header forge-game-header">
      <button
        type="button"
        className="mobile-game-header-button forge-header-button"
        onClick={onExit}
        aria-label="End game"
      >
        <ArrowLeft size={19} />
      </button>

      <div className="mobile-game-round forge-game-round">
        <span className="private-dot" />
        ROUND {String(roundNumber).padStart(2, "0")}
      </div>

      <button
        type="button"
        className={`mobile-game-header-button forge-header-button ${
          settingsOpen ? "active" : ""
        }`}
        onClick={onToggleSettings}
        aria-label="Timer settings"
        aria-expanded={settingsOpen}
      >
        <Settings2 size={19} />
      </button>
    </header>
  );
}
