import type { WordPack } from "./types";

const packLoaders: Record<
  string,
  () => Promise<{ default: unknown }>
> = {
  "wonders-places": () => import("./packs/wonders-places.json"),
  "space-universe": () => import("./packs/space-universe.json"),
  "science-technology": () => import("./packs/technology.json"),
  "animals-wildlife": () => import("./packs/animals.json"),
  "food-cuisine": () => import("./packs/food.json"),
  "sports-games": () => import("./packs/sports.json"),
  "movies-fiction": () => import("./packs/entertainment.json"),
  "geography-earth": () => import("./packs/geography.json"),
  "music-arts": () => import("./packs/music.json"),
  "people-history": () => import("./packs/people-history.json"),
  "nature-environment": () => import("./packs/nature-environment.json"),
  "human-body-life": () => import("./packs/human-body-life.json"),
  "transport-vehicles": () => import("./packs/transport-vehicles.json"),
  "lifestyle-society": () => import("./packs/everyday.json"),
  "adventure-entertainment": () => import("./packs/adventure-entertainment.json"),
};

export async function loadWordPacks(
  categoryIds: string[],
): Promise<WordPack[]> {
  const uniqueIds = [...new Set(categoryIds)];

  const results = await Promise.all(
    uniqueIds.map(async (categoryId) => {
      const loader = packLoaders[categoryId];

      if (!loader) {
        console.warn(`No word pack loader registered for: ${categoryId}`);
        return null;
      }

      const packData = await loader();
      const pack = packData.default as WordPack;

      if (pack.id !== categoryId) {
        console.error(
          `Word pack ID mismatch. Expected "${categoryId}", received "${pack.id}".`,
        );
        return null;
      }

      return pack;
    }),
  );

  return results.filter(
    (pack): pack is WordPack => pack !== null,
  );
}