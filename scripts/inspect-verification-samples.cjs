const fs = require("node:fs");
const path = require("node:path");

const ROOT = "data/verified-library";
const categories = [
  "animals", "food", "geography", "everyday",
  "sports", "entertainment", "technology", "music"
];

for (const category of categories) {
  console.log(`\n========== ${category.toUpperCase()} ==========`);

  for (const status of ["approved", "review"]) {
    const file = path.join(ROOT, status, `${category}.json`);
    const records = JSON.parse(fs.readFileSync(file, "utf8"));

    console.log(`\n--- ${status.toUpperCase()} ---`);

    for (const item of records.slice(0, 12)) {
      console.log(
        `${item.entry.word} | score=${item.score} | ${item.reasons.join(", ") || "no warnings"}`
      );

      if (item.definitions?.[0]) {
        console.log(`  Definition: ${item.definitions[0]}`);
      }
    }
  }
}
