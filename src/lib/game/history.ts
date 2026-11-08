
import type { WordHistory } from "@/data/word-library/types";
import { createPoolKey } from "./word-engine";

const STORAGE_PREFIX = "guess-the-word:history:v2:";

function getStorageKey(
  categoryIds: string[],
  subcategoryIds: string[] = [],
): string {
  return `${STORAGE_PREFIX}${createPoolKey(
    categoryIds,
    subcategoryIds,
  )}`;
}

export function loadWordHistory(
  categoryIds: string[],
  subcategoryIds: string[] = [],
): WordHistory {
  if (typeof window === "undefined" || categoryIds.length === 0) {
    return [];
  }

  try {
    const stored = window.localStorage.getItem(
      getStorageKey(categoryIds, subcategoryIds),
    );

    if (!stored) {
      return [];
    }

    const parsed: unknown = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      (value): value is string => typeof value === "string",
    );
  } catch {
    return [];
  }
}

export function saveWordHistory(
  categoryIds: string[],
  history: WordHistory,
  subcategoryIds: string[] = [],
): void {
  if (typeof window === "undefined" || categoryIds.length === 0) {
    return;
  }

  try {
    window.localStorage.setItem(
      getStorageKey(categoryIds, subcategoryIds),
      JSON.stringify(history),
    );
  } catch {
    // Gameplay can continue in memory if browser storage is unavailable.
  }
}

export function clearWordHistory(
  categoryIds: string[],
  subcategoryIds: string[] = [],
): void {
  if (typeof window === "undefined" || categoryIds.length === 0) {
    return;
  }

  try {
    window.localStorage.removeItem(
      getStorageKey(categoryIds, subcategoryIds),
    );
  } catch {
    // Clearing local history is best-effort.
  }
}
