const fs = require("node:fs");
const path = require("node:path");

const DIR = "data/raw/wordnet/extracted";
const files = fs.readdirSync(DIR).filter(f => f.startsWith("noun.") && f.endsWith(".json"));

const counts = new Map();
const examples = new Map();

for (const file of files) {
  const data = JSON.parse(fs.readFileSync(path.join(DIR, file), "utf8"));

  for (const [synsetId, synset] of Object.entries(data)) {
    for (const [key, value] of Object.entries(synset)) {
      counts.set(key, (counts.get(key) || 0) + 1);

      if (!examples.has(key) && key !== "members" && key !== "definition") {
        examples.set(key, {
          file,
          synsetId,
          members: synset.members,
          value
        });
      }
    }
  }
}

console.log("\n=== RELATIONSHIP FIELD COUNTS ===");

for (const [key, count] of [...counts.entries()].sort((a, b) => b[1] - a[1])) {
  console.log(`${key.padEnd(24)} ${count.toLocaleString("en-US")}`);
}

console.log("\n=== RELATIONSHIP EXAMPLES ===");

for (const [key, example] of examples) {
  if (["hypernym", "hyponym", "instance_hypernym", "instance_hyponym",
       "mero_part", "mero_member", "mero_substance",
       "holo_part", "holo_member", "holo_substance",
       "similar", "domain_topic", "domain_region", "domain_usage"].includes(key)) {
    console.log(`\n${key}:`);
    console.log(JSON.stringify(example, null, 2));
  }
}
