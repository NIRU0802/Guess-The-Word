const fs = require("node:fs");
const path = require("node:path");

const DIR = path.join(
  process.cwd(),
  "src/data/word-library/packs"
);

const categories = [
  "animals", "food", "entertainment", "technology",
  "sports", "geography", "everyday", "music"
];

const globalWords = new Map();
let total = 0;
let duplicateCount = 0;
let invalidCount = 0;
let missingIds = 0;
let missingClues = 0;

for (const category of categories) {
  const file = path.join(DIR, `${category}.json`);
  const pack = JSON.parse(fs.readFileSync(file, "utf8"));
  const words = pack.words || [];

  const samples = words.filter(w => w.id.includes("-wn-")).slice(0, 25);

  console.log(`\n========== ${category.toUpperCase()} ==========`);
  console.log(`Total entries: ${words.length}`);
  console.log("Sample imported words:");
  console.log(samples.map(w => w.word).join(" | "));

  for (const entry of words) {
    total++;

    if (!entry.id || !entry.id.trim()) missingIds++;

    if (
      typeof entry.word !== "string" ||
      !entry.word.trim() ||
      entry.categoryId !== category
    ) {
      invalidCount++;
      continue;
    }

    if (!Array.isArray(entry.relatedWords) || entry.relatedWords.length === 0) {
      missingClues++;
    }

    const normalized = entry.word
      .normalize("NFKC")
      .trim()
      .replace(/\s+/g, " ")
      .toUpperCase();

    if (globalWords.has(normalized)) {
      duplicateCount++;
    } else {
      globalWords.set(normalized, category);
    }
  }
}

console.log("\n========== AUDIT SUMMARY ==========");
console.log(`Total entries: ${total}`);
console.log(`Unique normalized words: ${globalWords.size}`);
console.log(`Duplicate words: ${duplicateCount}`);
console.log(`Invalid entries: ${invalidCount}`);
console.log(`Missing IDs: ${missingIds}`);
console.log(`Entries without clue words: ${missingClues}`);
