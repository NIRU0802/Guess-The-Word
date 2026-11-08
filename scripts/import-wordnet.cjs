const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

const ROOT = process.cwd();
const RAW = path.join(ROOT, "data/raw/wordnet/extracted");
const PACKS = path.join(ROOT, "src/data/word-library/packs");

const CATEGORIES = {
  animals: ["noun.animal"],
  food: ["noun.food"],
  geography: ["noun.location"],
  everyday: [
    "noun.artifact",
    "noun.body",
    "noun.shape",
    "noun.substance",
    "noun.quantity",
  ],
  sports: ["noun.act", "noun.event"],
  entertainment: ["noun.person", "noun.group"],
  technology: ["noun.communication", "noun.cognition"],
  music: ["noun.attribute"],
};

const PREFIX = {
  animals: "ani",
  food: "foo",
  entertainment: "ent",
  technology: "tec",
  sports: "spo",
  geography: "geo",
  everyday: "eve",
  music: "mus",
};

const BAD_WORDS = new Set([
  "thing", "something", "someone", "somebody", "anything",
  "everything", "nothing", "entity", "object", "whole",
  "kind", "type", "sort", "group", "set", "number",
  "unit", "part", "form", "way", "state", "case",
]);

function normalize(value) {
  return value.trim().replace(/\s+/g, " ").toUpperCase();
}

function validWord(value) {
  if (typeof value !== "string") return false;

  const word = value.trim();

  if (word.length < 2 || word.length > 45) return false;
  if (BAD_WORDS.has(word.toLowerCase())) return false;

  return /^[A-Za-z][A-Za-z0-9]*(?:[ '\-][A-Za-z0-9]+){0,4}$/.test(word);
}

function stableId(category, word) {
  const digest = crypto
    .createHash("sha1")
    .update(`${category}:${normalize(word)}`)
    .digest("hex")
    .slice(0, 12);

  return `${PREFIX[category]}-wn-${digest}`;
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8").replace(/^\uFEFF/, ""));
}

function main() {
  if (!fs.existsSync(RAW)) {
    throw new Error(`WordNet directory not found: ${RAW}`);
  }

  fs.mkdirSync(PACKS, { recursive: true });

  const existing = {};
  const candidates = {};
  const globalWords = new Set();

  for (const category of Object.keys(CATEGORIES)) {
    existing[category] = [];
    candidates[category] = new Map();

    const file = path.join(PACKS, `${category}.json`);

    if (!fs.existsSync(file)) continue;

    const pack = readJson(file);

    for (const entry of pack.words || []) {
      if (!validWord(entry.word)) continue;

      const key = normalize(entry.word);

      if (globalWords.has(key)) continue;

      globalWords.add(key);
      existing[category].push(entry);
    }
  }

  for (const [category, filenames] of Object.entries(CATEGORIES)) {
    for (const filename of filenames) {
      const file = path.join(RAW, `${filename}.json`);

      if (!fs.existsSync(file)) {
        console.log(`Skipping missing source: ${filename}.json`);
        continue;
      }

      console.log(`Reading ${filename}.json...`);

      const data = readJson(file);

      for (const synset of Object.values(data)) {
        if (!synset || typeof synset !== "object") continue;

        for (const member of synset.members || []) {
          if (!validWord(member)) continue;

          const key = normalize(member);

          if (!globalWords.has(key)) {
            candidates[category].set(key, member.trim());
          }
        }
      }
    }
  }

  const assigned = new Set(globalWords);
  const imported = {};

  for (const category of Object.keys(CATEGORIES)) {
    imported[category] = [];

    const sorted = [...candidates[category].entries()]
      .sort(([a], [b]) => a.localeCompare(b));

    for (const [key, word] of sorted) {
      if (assigned.has(key)) continue;

      assigned.add(key);

      imported[category].push({
        id: stableId(category, word),
        word: normalize(word),
        categoryId: category,
        language: "en",
      });
    }
  }

  let total = 0;
  let newTotal = 0;

  console.log("\n=== IMPORT RESULTS ===");

  for (const category of Object.keys(CATEGORIES)) {
    const words = [
      ...existing[category],
      ...imported[category],
    ];

    const output = {
      id: category,
      version: 1,
      words,
    };

    fs.writeFileSync(
      path.join(PACKS, `${category}.json`),
      JSON.stringify(output, null, 2) + "\n",
      "utf8"
    );

    total += words.length;
    newTotal += imported[category].length;

    console.log(
      `${category.padEnd(16)} existing=${String(existing[category].length).padStart(6)} new=${String(imported[category].length).padStart(6)} total=${String(words.length).padStart(6)}`
    );
  }

  console.log("-".repeat(65));
  console.log(`NEW WORDS: ${newTotal.toLocaleString("en-US")}`);
  console.log(`TOTAL WORDS: ${total.toLocaleString("en-US")}`);
  console.log("\nImport complete.");
}

main();
