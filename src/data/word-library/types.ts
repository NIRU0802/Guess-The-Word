export type WordEntry = {
  id: string;
  word: string;
  categoryId: string;
  subcategoryId: string;
  language: "en";
  relatedWords?: string[];
  image?: string | null;
};

export type WordPack = {
  id: string;
  version: number;
  words: WordEntry[];
};

export type WordHistory = string[];

export type WordDrawResult = {
  word: WordEntry;
  history: WordHistory;
  cycleReset: boolean;
};