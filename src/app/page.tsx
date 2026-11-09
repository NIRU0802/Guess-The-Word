"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock3,
  Gamepad2,
  Globe2,
  Lightbulb,
  Music2,
  PawPrint,
  Play,
  Sparkles,
  Trophy,
  Utensils,
  X,
  Zap,
  Landmark,
  Orbit,
  Microscope,
  Clapperboard,
  Users,
  Trees,
  HeartPulse,
  CarFront,
  BriefcaseBusiness,
  Compass,
} from "lucide-react";

import {
  WORD_CATEGORIES,
  type WordCategory,
} from "@/data/word-library/categories";

import { loadWordPacks } from "@/data/word-library";

const GameScreen = dynamic(
  () => import("@/components/game/GameScreen"),
  {
    ssr: false,
    loading: () => (
      <section className="mobile-game-screen">
        <div className="mobile-game-loading">
          Preparing your game...
        </div>
      </section>
    ),
  },
);

type Category = WordCategory & {
  description: string;
  icon: typeof PawPrint;
  color: string;
};

const categories: Category[] = [
  {
    ...WORD_CATEGORIES[0],
    description: "Famous landmarks and incredible places",
    icon: Landmark,
    color: "orange",
  },
  {
    ...WORD_CATEGORIES[1],
    description: "Planets, stars and space exploration",
    icon: Orbit,
    color: "blue",
  },
  {
    ...WORD_CATEGORIES[2],
    description: "Inventions, discoveries and gadgets",
    icon: Microscope,
    color: "cyan",
  },
  {
    ...WORD_CATEGORIES[3],
    description: "Wildlife, birds and familiar animals",
    icon: PawPrint,
    color: "orange",
  },
  {
    ...WORD_CATEGORIES[4],
    description: "Indian food, world cuisine and desserts",
    icon: Utensils,
    color: "green",
  },
  {
    ...WORD_CATEGORIES[5],
    description: "Popular sports, events and games",
    icon: Trophy,
    color: "yellow",
  },
  {
    ...WORD_CATEGORIES[6],
    description: "Movies, superheroes and fictional worlds",
    icon: Clapperboard,
    color: "purple",
  },
  {
    ...WORD_CATEGORIES[7],
    description: "Countries, cities and natural geography",
    icon: Globe2,
    color: "cyan",
  },
  {
    ...WORD_CATEGORIES[8],
    description: "Instruments, dance and famous artworks",
    icon: Music2,
    color: "red",
  },
  {
    ...WORD_CATEGORIES[9],
    description: "Famous people and ancient civilizations",
    icon: Users,
    color: "purple",
  },
  {
    ...WORD_CATEGORIES[10],
    description: "Weather, plants and natural phenomena",
    icon: Trees,
    color: "green",
  },
  {
    ...WORD_CATEGORIES[11],
    description: "The human body and everyday life",
    icon: HeartPulse,
    color: "pink",
  },
  {
    ...WORD_CATEGORIES[12],
    description: "Cars, aircraft, trains and ships",
    icon: CarFront,
    color: "blue",
  },
  {
    ...WORD_CATEGORIES[13],
    description: "Jobs, fashion, brands and society",
    icon: BriefcaseBusiness,
    color: "yellow",
  },
  {
    ...WORD_CATEGORIES[14],
    description: "Adventure, puzzles and attractions",
    icon: Compass,
    color: "orange",
  },
];

const timerOptions = [30, 45, 60, 90, 120];

type Screen = "home" | "setup" | "game";

export default function Home() {
  const [screen, setScreen] = useState<Screen>("home");

  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "animals-wildlife",
    "food-cuisine",
    "movies-fiction",
  ]);

  const [timer, setTimer] = useState(60);
  const [categorySearch, setCategorySearch] = useState("");

  const [wordCounts, setWordCounts] = useState<Record<string, number>>({});
  const [totalUniqueWords, setTotalUniqueWords] = useState<number | null>(
    null,
  );

  const totalCategories = WORD_CATEGORIES.length;

  useEffect(() => {
    let cancelled = false;

    async function loadLibraryStats() {
      try {
        const packs = await loadWordPacks(
          WORD_CATEGORIES.map((category) => category.packId),
        );

        if (cancelled) return;

        const counts: Record<string, number> = {};
        const uniqueWords = new Set<string>();

        for (const pack of packs) {
          counts[pack.id] = pack.words.length;

          for (const entry of pack.words) {
            const normalizedWord = entry.word.trim().toLowerCase();

            if (normalizedWord) {
              uniqueWords.add(normalizedWord);
            }
          }
        }

        setWordCounts(counts);
        setTotalUniqueWords(uniqueWords.size);
      } catch (error) {
        console.error(
          "Failed to load word library statistics:",
          error,
        );
      }
    }

    void loadLibraryStats();

    return () => {
      cancelled = true;
    };
  }, []);

  const formattedTotalWords =
    totalUniqueWords === null
      ? "—"
      : totalUniqueWords.toLocaleString("en-IN");

  const filteredCategories = useMemo(
    () =>
      categories.filter((category) =>
        category.name
          .toLowerCase()
          .includes(categorySearch.toLowerCase()),
      ),
    [categorySearch],
  );

  const selectedCategoryDefinitions = useMemo(
    () =>
      categories.filter((category) =>
        selectedCategories.includes(category.id),
      ),
    [selectedCategories],
  );

  const selectedNames = selectedCategoryDefinitions.map(
    (category) => category.name,
  );

  const toggleCategory = (id: string) => {
    setSelectedCategories((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  };

  const selectAllCategories = () => {
    const allCategoryIds = categories.map((category) => category.id);

    setSelectedCategories((current) =>
      current.length === categories.length ? [] : allCategoryIds,
    );
  };

  const startSetup = () => {
    setScreen("setup");
  };

  const startGame = () => {
    if (selectedCategories.length === 0) return;

    if (
      typeof document !== "undefined" &&
      document.documentElement.requestFullscreen
    ) {
      void document.documentElement
        .requestFullscreen()
        .catch(() => {
          // The game remains usable in its full-viewport layout.
        });
    }

    setScreen("game");
  };

  const exitGame = () => {
    if (
      typeof document !== "undefined" &&
      document.fullscreenElement &&
      document.exitFullscreen
    ) {
      void document.exitFullscreen().catch(() => {
        // The user can still continue using the app.
      });
    }

    setScreen("setup");
  };

  return (
    <main
      className={`app-shell ${
        screen === "game" ? "app-shell-game" : ""
      }`}
    >
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      {screen !== "game" && (
        <header className="topbar">
          <button
            className="brand"
            onClick={() => setScreen("home")}
            aria-label="Guess The Word home"
          >
            <span className="brand-mark">
              <Gamepad2 size={21} strokeWidth={2.1} />
            </span>

            <span className="brand-name">
              GUESS<span>THE</span>WORD
            </span>
          </button>

          <div className="private-label">
            <span className="private-dot" />
            PRIVATE GAME
          </div>
        </header>
      )}

      {screen === "home" && (
        <section className="home-content">
          <div className="hero">
            <div className="eyebrow">
              <Sparkles size={13} />
              THE ULTIMATE WORD PARTY
            </div>

            <h1>
              Think fast.
              <br />
              <span>Say smarter.</span>
            </h1>

            <p className="hero-description">
              {formattedTotalWords} unique words across {totalCategories} exciting categories.
              <br className="desktop-break" />
              One clue-giver, one teammate, and a race against time.
            </p>

            <button
              className="primary-button hero-button"
              onClick={startSetup}
            >
              <Play size={17} fill="currentColor" />
              Start a game
              <ArrowRight size={17} />
            </button>

            <div className="hero-footnote">
              <span>
                <Clock3 size={13} />
                Your rules, your timer
              </span>

              <span>
                <Sparkles size={13} />
                Endless possibilities
              </span>
            </div>

            <div className="library-highlights">
              <div className="library-highlight">
                <strong>{formattedTotalWords}</strong>
                <span>UNIQUE WORDS</span>
              </div>

              <div className="library-highlight-divider" />

              <div className="library-highlight">
                <strong>{totalCategories}</strong>
                <span>CATEGORIES</span>
              </div>

              <div className="library-highlight-divider" />

              <div className="library-highlight">
                <strong>∞</strong>
                <span>WAYS TO PLAY</span>
              </div>
            </div>
          </div>

          <section className="library-section">
            <div className="section-heading">
              <div>
                <span className="section-kicker">EXPLORE THE LIBRARY</span>
                <h2>
                  {totalCategories} worlds. Countless possibilities.
                </h2>
              </div>

              <span className="step-count">
                {formattedTotalWords} WORDS
              </span>
            </div>

            <div className="library-category-list">
              {categories.map((category) => {
                const Icon = category.icon;

                return (
                  <div className="library-category" key={category.id}>
                    <span className={`category-icon ${category.color}`}>
                      <Icon size={18} strokeWidth={1.8} />
                    </span>

                    <span>{category.name}</span>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="how-section">
            <div className="section-heading">
              <div>
                <span className="section-kicker">THE GAME</span>
                <h2>Simple to play. Hard to master.</h2>
              </div>

              <span className="step-count">03 STEPS</span>
            </div>

            <div className="steps-grid">
              <article className="step-card">
                <span className="step-number">01</span>

                <div className="step-icon step-icon-purple">
                  <Sparkles size={20} />
                </div>

                <h3>Pick your world</h3>
                <p>
                  Choose the categories that make your game interesting.
                </p>
              </article>

              <article className="step-card">
                <span className="step-number">02</span>

                <div className="step-icon step-icon-orange">
                  <Lightbulb size={20} />
                </div>

                <h3>Give the clues</h3>
                <p>
                  Describe the secret word without actually saying it.
                </p>
              </article>

              <article className="step-card">
                <span className="step-number">03</span>

                <div className="step-icon step-icon-green">
                  <Zap size={20} />
                </div>

                <h3>Beat the clock</h3>
                <p>
                  Help your teammate guess before the timer runs out.
                </p>
              </article>
            </div>
          </section>

          <footer className="home-footer">
            <span>MADE FOR YOUR NEXT GAME NIGHT</span>
            <span>NO ACCOUNTS. NO DISTRACTIONS. JUST FUN.</span>
          </footer>
        </section>
      )}

      {screen === "setup" && (
        <section className="setup-content">
          <button
            className="back-button"
            onClick={() => setScreen("home")}
          >
            <ArrowLeft size={16} />
            Back home
          </button>

          <div className="setup-heading">
            <span className="section-kicker">GAME CONFIGURATION</span>
            <h1>Set the scene.</h1>
            <p>
              Choose what you want to play. Mix as many categories as you like.
            </p>
          </div>

          <section className="configuration-section">
            <div className="section-heading">
              <div>
                <h2>Choose categories</h2>
                <p className="section-description">
                  Select one or more categories for your word pool.
                </p>
              </div>

              <span className="selection-count">
                {selectedCategories.length} / {totalCategories} SELECTED
              </span>
            </div>

            <div className="category-search">
              <input
                type="search"
                placeholder="Find a category..."
                value={categorySearch}
                onChange={(event) =>
                  setCategorySearch(event.target.value)
                }
                aria-label="Search categories"
              />

              {categorySearch && (
                <button
                  className="clear-search"
                  onClick={() => setCategorySearch("")}
                  aria-label="Clear category search"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            <div className="category-grid">
              {filteredCategories.map((category) => {
                const Icon = category.icon;
                const selected = selectedCategories.includes(category.id);
                const wordCount = wordCounts[category.packId];

                return (
                  <button
                    key={category.id}
                    className={`category-card ${
                      selected ? "selected" : ""
                    }`}
                    onClick={() => toggleCategory(category.id)}
                    aria-pressed={selected}
                  >
                    <span className={`category-icon ${category.color}`}>
                      <Icon size={21} strokeWidth={1.8} />
                    </span>

                    <span className="category-info">
                      <strong>{category.name}</strong>
                      <small>{category.description}</small>
                      <small>
                        {wordCount === undefined ? "—" : wordCount} words ·{" "}
                        {category.subcategories.length} topics
                      </small>
                    </span>

                    <span
                      className={`category-check ${
                        selected ? "checked" : ""
                      }`}
                    >
                      {selected && <Check size={13} />}
                    </span>
                  </button>
                );
              })}
            </div>

            {filteredCategories.length === 0 && (
              <div className="empty-search">
                No categories found. Try another search.
              </div>
            )}

            <div className="selection-actions">
              <span>
                {selectedCategories.length === 0
                  ? "Select at least one category to continue."
                  : `${selectedCategories.length} categories selected`}
              </span>

              <button
                className="text-button"
                onClick={selectAllCategories}
              >
                {selectedCategories.length === categories.length
                  ? "Clear all"
                  : "Select all"}
              </button>
            </div>
          </section>

          <section className="timer-section">
            <div className="section-heading">
              <div>
                <h2>Round timer</h2>
                <p className="section-description">
                  How long does the clue-giver get?
                </p>
              </div>

              <div className="timer-preview">
                <Clock3 size={16} />
                <strong>{timer}</strong>
                <span>SEC</span>
              </div>
            </div>

            <div className="timer-options">
              {timerOptions.map((seconds) => (
                <button
                  key={seconds}
                  className={`timer-option ${
                    timer === seconds ? "active" : ""
                  }`}
                  onClick={() => setTimer(seconds)}
                  aria-pressed={timer === seconds}
                >
                  {seconds}
                  <span>sec</span>
                </button>
              ))}
            </div>
          </section>

          <div className="setup-bottom">
            <div className="setup-summary">
              <span className="summary-label">YOUR GAME</span>
              <strong>
                {selectedCategories.length} categories
                <span> · </span>
                {timer} seconds
              </strong>
              <small>
                All topics within selected categories are included.
              </small>
            </div>

            <button
              className="primary-button setup-start"
              disabled={selectedCategories.length === 0}
              onClick={startGame}
            >
              Start game
              <ArrowRight size={17} />
            </button>
          </div>
        </section>
      )}

      {screen === "game" && (
        <GameScreen
          selectedCategoryIds={selectedCategories}
          selectedCategoryNames={selectedNames}
          timerSeconds={timer}
          onExit={exitGame}
        />
      )}
    </main>
  );
}