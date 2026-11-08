import type {
  WordDrawResult,
  WordEntry,
  WordHistory,
} from "@/data/word-library/types";

export function normalizeWord(value: string): string {
  return value
    .normalize("NFKC")
    .trim()
    .replace(/\s+/g, " ")
    .toLocaleUpperCase("en");
}

export function buildWordPool(
  words: WordEntry[],
  selectedCategoryIds: string[],
  selectedSubcategoryIds: string[] = [],
): WordEntry[] {
  const selectedCategories = new Set(selectedCategoryIds);
  const selectedSubcategories = new Set(selectedSubcategoryIds);
  const filterSubcategories = selectedSubcategories.size > 0;

  const seenWords = new Set<string>();
  const seenIds = new Set<string>();
  const pool: WordEntry[] = [];

  for (const entry of words) {
    if (!selectedCategories.has(entry.categoryId)) continue;

    if (
      filterSubcategories &&
      (!entry.subcategoryId ||
        !selectedSubcategories.has(entry.subcategoryId))
    ) {
      continue;
    }

    if (
      typeof entry.id !== "string" ||
      typeof entry.word !== "string" ||
      !entry.id.trim() ||
      !entry.word.trim()
    ) {
      continue;
    }

    const normalized = normalizeWord(entry.word);

    if (
      !normalized ||
      seenWords.has(normalized) ||
      seenIds.has(entry.id)
    ) {
      continue;
    }

    seenWords.add(normalized);
    seenIds.add(entry.id);

    pool.push({
      ...entry,
      word: normalized,
    });
  }

  return pool;
}

export function drawNextWord(
  pool: WordEntry[],
  previousHistory: WordHistory,
  random: () => number = Math.random,
): WordDrawResult {
  if (pool.length === 0) {
    throw new Error(
      "Cannot draw a word because the selected categories have no eligible words.",
    );
  }

  const validIds = new Set(pool.map((entry) => entry.id));
  const history = previousHistory.filter((id) => validIds.has(id));
  const usedIds = new Set(history);

  let available = pool.filter((entry) => !usedIds.has(entry.id));
  let nextHistory = history;
  let cycleReset = false;

  if (available.length === 0) {
    cycleReset = true;

    const lastUsedId = history[history.length - 1];
    nextHistory = lastUsedId ? [lastUsedId] : [];

    available =
      pool.length > 1
        ? pool.filter((entry) => entry.id !== lastUsedId)
        : [...pool];
  }

  const randomValue = random();

  const safeRandom = Number.isFinite(randomValue)
    ? Math.min(Math.max(randomValue, 0), 0.999999999999)
    : 0;

  const index = Math.floor(safeRandom * available.length);
  const selectedWord = available[index];

  return {
    word: selectedWord,
    history: [...nextHistory, selectedWord.id],
    cycleReset,
  };
}

export function createPoolKey(
  categoryIds: string[],
  subcategoryIds: string[] = [],
): string {
  const categoriesKey = [...new Set(categoryIds)].sort().join(",");
  const subcategoriesKey = [...new Set(subcategoryIds)].sort().join(",");

  return `${categoriesKey}::${subcategoriesKey}`;
}