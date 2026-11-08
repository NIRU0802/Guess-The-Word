const fs = require("node:fs");
const path = require("node:path");

const ROOT = process.cwd();
const RAW = path.join(ROOT, "data/raw/wordnet/extracted");
const PACKS = path.join(ROOT, "src/data/word-library/packs");
const REPORT_DIR = path.join(ROOT, "data/reports");

const CATEGORIES = {
  animals: ["noun.animal"],
  food: ["noun.food"],
  geography: ["noun.location"],
  everyday: [
    "noun.artifact", "noun.body", "noun.shape",
    "noun.substance", "noun.quantity"
  ],
  sports: ["noun.act", "noun.event"],
  entertainment: ["noun.person", "noun.group"],
  technology: ["noun.communication", "noun.cognition"],
  music: ["noun.attribute"]
};

const STOP_WORDS = new Set([
  "thing", "something", "someone", "somebody",
  "anything", "everything", "nothing", "entity",
  "object", "whole", "kind", "type", "sort",
  "group", "set", "number", "unit", "part",
  "form", "way", "state", "case"
]);

function normalize(value) {
  return String(value)
    .normalize("NFKC")
    .trim()
    .replace(/\s+/g, " ")
    .toUpperCase();
}

function validClue(value, original) {
  if (typeof value !== "string") return false;

  const word = value.trim();
  const normalized = normalize(word);

  if (!word || normalized === normalize(original)) return false;
  if (word.length < 2 || word.length > 45) return false;
  if (STOP_WORDS.has(word.toLowerCase())) return false;

  return /^[A-Za-z][A-Za-z0-9]*(?:[ '\-][A-Za-z0-9]+){0,4}$/.test(word);
}

function readJson(file) {
  return JSON.parse(
    fs.readFileSync(file, "utf8").replace(/^\uFEFF/, "")
  );
}

function main() {
  const synsets = new Map();
  const wordIndex = new Map();
  const reverseHypernyms = new Map();

  console.log("Indexing WordNet synsets...");

  const files = fs.readdirSync(RAW).filter(
    file => file.startsWith("noun.") && file.endsWith(".json")
  );

  for (const file of files) {
    const data = readJson(path.join(RAW, file));

    for (const [synsetId, synset] of Object.entries(data)) {
      synsets.set(synsetId, {
        ...synset,
        sourceFile: file
      });

      for (const member of synset.members || []) {
        const key = normalize(member);

        if (!wordIndex.has(key)) wordIndex.set(key, []);
        wordIndex.get(key).push(synsetId);
      }

      for (const parentId of [
        ...(synset.hypernym || []),
        ...(synset.instance_hypernym || [])
      ]) {
        if (!reverseHypernyms.has(parentId)) {
          reverseHypernyms.set(parentId, []);
        }

        reverseHypernyms.get(parentId).push(synsetId);
      }
    }
  }

  console.log(`Indexed ${synsets.size.toLocaleString("en-US")} synsets.`);
  console.log("Generating clue candidates...");

  const report = {};
  let totalEntries = 0;
  let entriesWithClues = 0;
  let totalClues = 0;

  for (const [category, sourceFiles] of Object.entries(CATEGORIES)) {
    const pack = readJson(path.join(PACKS, `${category}.json`));
    const results = [];

    for (const entry of pack.words || []) {
      totalEntries++;

      const matchingIds = (wordIndex.get(normalize(entry.word)) || [])
        .filter(id => {
          const synset = synsets.get(id);
          return synset && sourceFiles.includes(synset.sourceFile.replace(".json", ""));
        });

      const candidates = new Map();

      function addMembers(ids, relation, score) {
        for (const id of ids || []) {
          const synset = synsets.get(id);
          if (!synset) continue;

          for (const member of synset.members || []) {
            if (!validClue(member, entry.word)) continue;

            const key = normalize(member);
            const previous = candidates.get(key);

            if (!previous || previous.score < score) {
              candidates.set(key, {
                word: member.trim(),
                relation,
                score
              });
            }
          }
        }
      }

      for (const id of matchingIds) {
        const synset = synsets.get(id);

        if (!synset) continue;

        // Alternative names from the same synset.
        addMembers([id], "synonym", 100);

        // Broader concepts.
        addMembers(
          [...(synset.hypernym || []), ...(synset.instance_hypernym || [])],
          "broader-concept",
          80
        );

        // Parts, members and substances associated with the concept.
        addMembers(
          [
            ...(synset.mero_part || []),
            ...(synset.mero_member || []),
            ...(synset.mero_substance || [])
          ],
          "component",
          70
        );

        // More specific concepts that point back to this synset.
        addMembers(
          reverseHypernyms.get(id) || [],
          "specific-concept",
          60
        );
      }

      const clues = [...candidates.values()]
        .sort((a, b) => b.score - a.score || a.word.localeCompare(b.word))
        .slice(0, 6)
        .map(({ word, relation }) => ({ word, relation }));

      if (clues.length > 0) entriesWithClues++;
      totalClues += clues.length;

      results.push({
        id: entry.id,
        word: entry.word,
        categoryId: category,
        matchedSynsets: matchingIds.length,
        relatedWords: clues
      });
    }

    report[category] = results;

    console.log(
      `${category.padEnd(16)} entries=${String(results.length).padStart(6)} with clues=${String(results.filter(x => x.relatedWords.length).length).padStart(6)}`
    );
  }

  fs.mkdirSync(REPORT_DIR, { recursive: true });

  const output = path.join(REPORT_DIR, "wordnet-clue-preview.json");

  fs.writeFileSync(
    output,
    JSON.stringify(report, null, 2) + "\n",
    "utf8"
  );

  console.log("\n========== PREVIEW SUMMARY ==========");
  console.log(`Total entries: ${totalEntries.toLocaleString("en-US")}`);
  console.log(`Entries with clues: ${entriesWithClues.toLocaleString("en-US")}`);
  console.log(`Entries without clues: ${(totalEntries - entriesWithClues).toLocaleString("en-US")}`);
  console.log(`Total clue candidates: ${totalClues.toLocaleString("en-US")}`);
  console.log(`Average clues per entry: ${(totalClues / Math.max(totalEntries, 1)).toFixed(2)}`);
  console.log(`\nPreview saved to: ${output}`);

  console.log("\n========== SAMPLE CLUES ==========");

  for (const category of Object.keys(report)) {
    console.log(`\n${category.toUpperCase()}`);

    for (const item of report[category].filter(x => x.relatedWords.length).slice(0, 5)) {
      console.log(
        `${item.word} → ${item.relatedWords.map(x => `${x.word} [${x.relation}]`).join(", ")}`
      );
    }
  }
}

main();
