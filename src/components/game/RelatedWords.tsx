
"use client";

import { Lightbulb, LockKeyhole } from "lucide-react";

type RelatedWordsProps = {
  words: string[];
  visible: boolean;
};

export default function RelatedWords({
  words,
  visible,
}: RelatedWordsProps) {
  return (
    <section className="mobile-related-section forge-related-section">
      <div className="mobile-related-heading forge-related-heading">
        <div className="forge-related-title">
          <span className="mobile-section-label">
            CLUE SUGGESTIONS
          </span>

          <span className="forge-related-icon">
            <Lightbulb size={14} />
          </span>
        </div>

        <span className="mobile-related-caption">
          {visible
            ? "Use these to describe the word"
            : "Hidden with the secret word"}
        </span>
      </div>

      {visible ? (
        words.length > 0 ? (
          <div className="mobile-related-list forge-related-list">
            {words.map((word, index) => (
              <span
                className="mobile-related-chip forge-related-chip"
                key={`${word}-${index}`}
              >
                <span className="forge-related-chip-index">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {word}
              </span>
            ))}
          </div>
        ) : (
          <p className="mobile-related-empty">
            No clue suggestions available.
          </p>
        )
      ) : (
        <div
          className="mobile-related-list mobile-related-placeholder forge-related-placeholder"
          aria-hidden="true"
        >
          {Array.from({ length: 5 }, (_, index) => (
            <span key={index}>
              <LockKeyhole size={11} />
              ••••••
            </span>
          ))}
        </div>
      )}
    </section>
  );
}
