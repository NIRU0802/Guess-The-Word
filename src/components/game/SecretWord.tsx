
"use client";

import { Eye, EyeOff, LockKeyhole } from "lucide-react";

type SecretWordProps = {
  word: string;
  visible: boolean;
  onToggle: () => void;
};

export default function SecretWord({
  word,
  visible,
  onToggle,
}: SecretWordProps) {
  return (
    <section className="mobile-secret-section forge-secret-section">
      <div className="forge-secret-heading">
        <span className="mobile-section-label">
          SECRET WORD
        </span>

        <span className="forge-secret-private">
          <LockKeyhole size={12} />
          PRIVATE
        </span>
      </div>

      <button
        type="button"
        className={`mobile-secret-word forge-secret-word ${
          visible ? "visible" : "hidden"
        }`}
        onClick={onToggle}
        aria-label={visible ? "Hide secret word" : "Reveal secret word"}
        aria-pressed={visible}
      >
        {visible ? word : "••••••••"}
      </button>

      <button
        type="button"
        className="mobile-reveal-control forge-reveal-control"
        onClick={onToggle}
        aria-pressed={visible}
      >
        {visible ? (
          <>
            <EyeOff size={16} />
            Hide word and clues
          </>
        ) : (
          <>
            <Eye size={16} />
            Reveal word and clues
          </>
        )}
      </button>
    </section>
  );
}
