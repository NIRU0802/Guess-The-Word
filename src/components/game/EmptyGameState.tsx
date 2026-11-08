
"use client";

import { ArrowLeft, Sparkles, Library } from "lucide-react";

type EmptyGameStateProps = {
  onExit: () => void;
};

export default function EmptyGameState({
  onExit,
}: EmptyGameStateProps) {
  return (
    <section className="mobile-empty-game forge-empty-game">
      <div className="forge-empty-visual">
        <div className="mobile-empty-icon forge-empty-icon">
          <Library size={30} strokeWidth={1.7} />
        </div>

        <span className="forge-empty-sparkle forge-sparkle-one">
          <Sparkles size={17} />
        </span>

        <span className="forge-empty-sparkle forge-sparkle-two">
          <Sparkles size={12} />
        </span>
      </div>

      <span className="mobile-section-label">
        SOMETHING IS MISSING
      </span>

      <h1>No words available</h1>

      <p>
        The selected categories don&apos;t currently contain any words.
        Choose another category to get your game started.
      </p>

      <button
        type="button"
        className="primary-button forge-empty-button"
        onClick={onExit}
      >
        <ArrowLeft size={17} />
        Back to setup
      </button>
    </section>
  );
}
