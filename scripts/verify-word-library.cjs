const fs = require("node:fs");
const path = require("node:path");

const ROOT = process.cwd();
const RAW = path.join(ROOT, "data/raw/wordnet/extracted");
const PACKS = path.join(ROOT, "src/data/word-library/packs");
const OUTPUT = path.join(ROOT, "data/verified-library");

const CONFIG = {
  batchSize: 2000,
  minWordLength: 2,
  maxWordLength: 45,
  maxTokens: 5,
};

const CATEGORIES = {
  animals: ["noun.animal"],
  food: ["noun.food"],
  geography: ["noun.location"],
  everyday: [
    "noun.artifact", "noun.body", "noun.shape",
    "noun.substance", "noun.quantity", "noun.object",
  ],
  sports: ["noun.act", "noun.event"],
  entertainment: ["noun.person", "noun.group"],
  technology: ["noun.communication", "noun.cognition"],
  music: ["noun.attribute"],
};

const STOP_WORDS = new Set([
  "thing", "something", "someone", "somebody",
  "anything", "everything", "nothing", "entity",
  "object", "whole", "kind", "type", "sort",
  "group", "set", "number", "unit", "part",
  "form", "way", "state", "case",
]);

const GENERIC_DEFINITION_PATTERNS = [
  /^a thing that/i,
  /^something that/i,
  /^someone who/i,
  /^the state of being/i,
  /^the quality of being/i,
];

function readJson(file) {
  return JSON.parse(
    fs.readFileSync(file, "utf8").replace(/^\uFEFF/, "")
  );
}

function normalize(value) {
  return String(value)
    .normalize("NFKC")
    .trim()
    .replace(/\s+/g, " ")
    .toUpperCase();
}

function tokenize(value) {
  return normalize(value)
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
}

function validSurfaceWord(word) {
  if (typeof word !== "string") return false;

  const value = word.trim();

  if (value.length < CONFIG.minWordLength) return false;
  if (value.length > CONFIG.maxWordLength) return false;
  if (STOP_WORDS.has(value.toLowerCase())) return false;

  const tokens = value.split(/\s+/);

  if (tokens.length > CONFIG.maxTokens) return false;

  return /^[A-Za-z][A-Za-z0-9]*(?:[ '\-][A-Za-z0-9]+){0,4}$/.test(value);
}

function hasUsableDefinition(synset) {
  if (!Array.isArray(synset.definition)) return false;

  return synset.definition.some(
    definition =>
      typeof definition === "string" &&
      definition.trim().length >= 12
  );
}

function getDefinitions(synsets) {
  return synsets
    .flatMap(synset => synset.definition || [])
    .filter(value => typeof value === "string");
}

function getCategoryEvidence(category, definitions, sourceFiles) {
  const text = definitions.join(" ").toLowerCase();
  const sources = new Set(sourceFiles);

  const evidence = {
    category,
    sourceMatch: [...sources].some(source =>
      CATEGORIES[category].includes(source)
    ),
    positiveSignals: [],
    negativeSignals: [],
  };

  const signals = {
    animals: [
      /\banimal\b/, /\bmammal\b/, /\bbird\b/, /\breptile\b/,
      /\bfish\b/, /\binsect\b/, /\bamphibian\b/, /\bmarine mammal\b/,
      /\bcrustacean\b/, /\bspider\b/, /\bpet\b/, /\bwildlife\b/,
    ],
    food: [
      /\bfood\b/, /\bingredient\b/, /\bedible\b/, /\bfruit\b/,
      /\bvegetable\b/, /\bmeat\b/, /\bdrink\b/, /\bbeverage\b/,
      /\bcook(?:ed|ing)?\b/, /\bdish\b/, /\bmeal\b/, /\bspice\b/,
    ],
    geography: [
      /\bcountry\b/, /\bcity\b/, /\bcontinent\b/, /\bisland\b/,
      /\bmountain\b/, /\briver\b/, /\bdesert\b/, /\blake\b/,
      /\bregion\b/, /\bgeographical\b/, /\bgeographic\b/,
      /\bcapital\b/, /\bprovince\b/, /\bstate\b/,
    ],
    everyday: [
      /\btool\b/, /\butensil\b/, /\bhousehold\b/, /\bdevice\b/,
      /\bfurniture\b/, /\bclothing\b/, /\bgarment\b/, /\bcontainer\b/,
      /\bappliance\b/, /\bbody part\b/, /\bstructure\b/,
      /\bsubstance\b/, /\bmaterial\b/, /\bobject\b/,
    ],
    sports: [
      /\bsport\b/, /\bathletic\b/, /\bgame\b/, /\bcompetition\b/,
      /\bmatch\b/, /\btournament\b/, /\bplayer\b/, /\bteam\b/,
      /\bexercise\b/, /\bphysical activity\b/, /\brace\b/,
    ],
    entertainment: [
      /\bfilm\b/, /\bmovie\b/, /\btelevision\b/, /\bactor\b/,
      /\bactress\b/, /\bcharacter\b/, /\bfictional\b/,
      /\bcomic\b/, /\bnovel\b/, /\bperformer\b/,
      /\bentertainment\b/, /\bshow\b/, /\bseries\b/,
    ],
    technology: [
      /\bcomputer\b/, /\bsoftware\b/, /\bhardware\b/,
      /\belectronic\b/, /\btechnology\b/, /\btechnological\b/,
      /\bdigital\b/, /\bprogramming\b/, /\bnetwork\b/,
      /\bcommunication system\b/, /\bmachine\b/,
    ],
    music: [
      /\bmusic\b/, /\bmusical\b/, /\binstrument\b/,
      /\bmelody\b/, /\brhythm\b/, /\bsong\b/, /\bsinger\b/,
      /\bcomposer\b/, /\bmusician\b/, /\bmusical instrument\b/,
      /\bconcert\b/, /\bcomposition\b/,
    ],
  };

  for (const pattern of signals[category] || []) {
    if (pattern.test(text)) {
      evidence.positiveSignals.push(pattern.source);
    }
  }

  return evidence;
}

function getDifficulty(word, definitions, synsets) {
  const text = definitions.join(" ").toLowerCase();
  const tokens = tokenize(word);

  let score = 0;

  if (word.length >= 18) score += 1;
  if (tokens.length >= 3) score += 1;
  if (word.length >= 25) score += 1;
  if (/\b(genus|species|taxonomic|anatomical|chemical)\b/.test(text)) {
    score += 2;
  }
  if (/\b(archaic|obsolete|historical term)\b/.test(text)) {
    score += 2;
  }
  if (synsets.some(synset => synset.wikidata)) score -= 0.25;

  return Math.max(0, Math.min(5, score));
}

function verifyEntry(entry, category, synsetIndex, globalWords) {
  const word = entry.word;
  const key = normalize(word);
  const reasons = [];

  if (!validSurfaceWord(word)) {
    reasons.push("invalid-surface-form");
  }

  if (globalWords.has(key)) {
    reasons.push("duplicate-word");
  } else {
    globalWords.add(key);
  }

  const matchingSynsets = synsetIndex.get(key) || [];

  if (matchingSynsets.length === 0) {
    return {
      status: "review",
      score: 0,
      reasons: [...reasons, "no-wordnet-synset-match"],
      entry,
      definitions: [],
      evidence: null,
      synsetIds: [],
      difficulty: null,
    };
  }

  const relevantSynsets = matchingSynsets.filter(
    item => CATEGORIES[category].includes(item.sourceFile)
  );

  const selectedSynsets = relevantSynsets.length
    ? relevantSynsets
    : matchingSynsets;

  const definitions = getDefinitions(selectedSynsets);

  const evidence = getCategoryEvidence(
    category,
    definitions,
    selectedSynsets.map(item => item.sourceFile)
  );

  const hasDefinition = selectedSynsets.some(hasUsableDefinition);
  const wordTokens = tokenize(word);

  const properName = /^[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*$/.test(
    word.trim()
  );

  const genericDefinition = definitions.some(definition =>
    GENERIC_DEFINITION_PATTERNS.some(pattern => pattern.test(definition))
  );

  if (!hasDefinition) reasons.push("missing-usable-definition");
  if (matchingSynsets.length > 3) reasons.push("ambiguous-word-senses");
  if (genericDefinition) reasons.push("generic-definition");
  if (wordTokens.length > 3) reasons.push("long-phrase");
  if (properName) reasons.push("proper-name-review");

  const sourceMatch = relevantSynsets.length > 0;
  const signalCount = evidence.positiveSignals.length;

  let score = 0;

  if (validSurfaceWord(word)) score += 20;
  if (hasDefinition) score += 25;
  if (sourceMatch) score += 30;
  if (signalCount > 0) score += 15;
  if (matchingSynsets.length <= 2) score += 10;

  if (genericDefinition) score -= 15;
  if (matchingSynsets.length > 3) score -= 15;
  if (properName) score -= 5;

  score = Math.max(0, Math.min(100, score));

  let status;

  if (
    reasons.includes("invalid-surface-form") ||
    reasons.includes("duplicate-word")
  ) {
    status = "rejected";
  } else if (
    score >= 85 &&
    sourceMatch &&
    hasDefinition &&
    signalCount > 0 &&
    !genericDefinition &&
    matchingSynsets.length <= 2 &&
    !properName
  ) {
    status = "approved";
  } else if (score < 30) {
    status = "rejected";
  } else {
    status = "review";
  }

  return {
    status,
    score,
    reasons,
    entry,
    definitions,
    evidence,
    synsetIds: selectedSynsets.map(item => item.synsetId),
    difficulty: getDifficulty(word, definitions, selectedSynsets),
  };
}

function writeJson(file, data) {
  fs.writeFileSync(
    file,
    JSON.stringify(data, null, 2) + "\n",
    "utf8"
  );
}

function main() {
  if (!fs.existsSync(RAW)) {
    throw new Error(`WordNet source missing: ${RAW}`);
  }

  const synsetIndex = new Map();
  const synsetFiles = fs.readdirSync(RAW).filter(
    file => file.startsWith("noun.") && file.endsWith(".json")
  );

  console.log("Indexing WordNet definitions...");

  for (const file of synsetFiles) {
    const sourceFile = file.replace(".json", "");
    const data = readJson(path.join(RAW, file));

    for (const [synsetId, synset] of Object.entries(data)) {
      for (const member of synset.members || []) {
        const key = normalize(member);

        if (!synsetIndex.has(key)) synsetIndex.set(key, []);

        synsetIndex.get(key).push({
          synsetId,
          sourceFile,
          definition: synset.definition || [],
          wikidata: synset.wikidata || null,
          partOfSpeech: synset.partOfSpeech || null,
          synset,
        });
      }
    }
  }

  console.log(`Indexed ${synsetIndex.size.toLocaleString("en-US")} unique WordNet terms.`);

  const buckets = {
    approved: {},
    review: {},
    rejected: {},
  };

  const globalWords = new Set();
  const summary = {};
  let total = 0;

  for (const category of Object.keys(CATEGORIES)) {
    const pack = readJson(path.join(PACKS, `${category}.json`));
    const entries = pack.words || [];

    const categorySummary = {
      total: entries.length,
      approved: 0,
      review: 0,
      rejected: 0,
    };

    for (let offset = 0; offset < entries.length; offset += CONFIG.batchSize) {
      const batch = entries.slice(offset, offset + CONFIG.batchSize);

      for (const entry of batch) {
        const result = verifyEntry(
          entry,
          category,
          synsetIndex,
          globalWords
        );

        buckets[result.status][category] ||= [];
        buckets[result.status][category].push(result);

        categorySummary[result.status]++;
        total++;
      }

      console.log(
        `${category}: ${Math.min(offset + CONFIG.batchSize, entries.length)}/${entries.length}`
      );
    }

    summary[category] = categorySummary;
  }

  for (const status of ["approved", "review", "rejected"]) {
    for (const category of Object.keys(CATEGORIES)) {
      const records = buckets[status][category] || [];

      writeJson(
        path.join(OUTPUT, status, `${category}.json`),
        records
      );
    }
  }

  const allResults = Object.values(buckets)
    .flatMap(categories => Object.values(categories).flat());

  const reasonCounts = {};

  for (const result of allResults) {
    for (const reason of result.reasons) {
      reasonCounts[reason] = (reasonCounts[reason] || 0) + 1;
    }
  }

  const report = {
    generatedAt: new Date().toISOString(),
    source: "Open English WordNet",
    total,
    categorySummary: summary,
    statusSummary: {
      approved: allResults.filter(x => x.status === "approved").length,
      review: allResults.filter(x => x.status === "review").length,
      rejected: allResults.filter(x => x.status === "rejected").length,
    },
    reasonCounts,
    limitations: [
      "Automated semantic checks are conservative and cannot guarantee human-level category correctness.",
      "WordNet source files provide broad lexical categories, not exact game categories.",
      "Approved entries still require sampled human quality review.",
      "No original game pack is modified by this script.",
    ],
  };

  writeJson(
    path.join(OUTPUT, "verification-report.json"),
    report
  );

  console.log("\n========== VERIFICATION SUMMARY ==========");
  console.log(`Total: ${total.toLocaleString("en-US")}`);
  console.log(`Approved: ${report.statusSummary.approved.toLocaleString("en-US")}`);
  console.log(`Review: ${report.statusSummary.review.toLocaleString("en-US")}`);
  console.log(`Rejected: ${report.statusSummary.rejected.toLocaleString("en-US")}`);

  console.log("\nCategory breakdown:");

  for (const [category, counts] of Object.entries(summary)) {
    console.log(
      `${category.padEnd(16)} approved=${String(counts.approved).padStart(6)} review=${String(counts.review).padStart(6)} rejected=${String(counts.rejected).padStart(6)}`
    );
  }

  console.log("\nReason counts:");

  for (const [reason, count] of Object.entries(reasonCounts).sort((a, b) => b[1] - a[1])) {
    console.log(`${reason.padEnd(30)} ${count}`);
  }

  console.log("\nVerification completed. Original packs were not modified.");
}

main();
