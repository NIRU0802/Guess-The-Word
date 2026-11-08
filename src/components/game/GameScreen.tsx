
"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type {
  PointerEvent as ReactPointerEvent,
  KeyboardEvent as ReactKeyboardEvent,
} from "react";

import {
  Sparkles,
  PawPrint,
  Utensils,
  Clapperboard,
  Tag,
  Pause,
  RotateCcw,
  SkipForward,
  Eye,
  EyeOff,
  Landmark,
  Orbit,
  Microscope,
  Globe2,
  Music2,
  Users,
  Trees,
  HeartPulse,
  CarFront,
  BriefcaseBusiness,
  Compass,
} from "lucide-react";

import { loadWordPacks } from "@/data/word-library";
import type {
  WordEntry,
  WordPack,
} from "@/data/word-library/types";

import {
  buildWordPool,
  drawNextWord,
} from "@/lib/game/word-engine";

import {
  loadWordHistory,
  saveWordHistory,
} from "@/lib/game/history";

import { useGameTimer } from "@/hooks/useGameTimer";

import GameHeader from "./GameHeader";
import GameTimer from "./GameTimer";
import GameControls from "./GameControls";
import GameSettings from "./GameSettings";
import EmptyGameState from "./EmptyGameState";

type GameScreenProps = {
  selectedCategoryIds: string[];
  selectedCategoryNames: string[];
  timerSeconds: number;
  onExit: () => void;
};

type GameState = {
  currentWord: WordEntry | null;
  history: string[];
  cycleRestarted: boolean;
};

const EMPTY_HISTORY: string[] = [];

const CATEGORY_ICONS: Record<string, typeof PawPrint> = {
  "wonders-places": Landmark,
  "space-universe": Orbit,
  "science-technology": Microscope,
  "animals-wildlife": PawPrint,
  "food-cuisine": Utensils,
  "sports-games": Tag,
  "movies-fiction": Clapperboard,
  "geography-earth": Globe2,
  "music-arts": Music2,
  "people-history": Users,
  "nature-environment": Trees,
  "human-body-life": HeartPulse,
  "transport-vehicles": CarFront,
  "lifestyle-society": BriefcaseBusiness,
  "adventure-entertainment": Compass,
};

function getCategoryIcon(name: string) {
  const normalized = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  return CATEGORY_ICONS[normalized] ?? Tag;
}

export default function GameScreen({
  selectedCategoryIds,
  selectedCategoryNames,
  timerSeconds,
  onExit,
}: GameScreenProps) {
  const autoNextTimeoutRef = useRef<number | null>(null);

  const categoryKey = [...new Set(selectedCategoryIds)]
    .sort()
    .join(",");

  const categoryIds = useMemo(
    () => (categoryKey ? categoryKey.split(",") : []),
    [categoryKey],
  );

  const [loadedPacks, setLoadedPacks] = useState<WordPack[] | null>(null);
  const [loadedCategoryKey, setLoadedCategoryKey] = useState<string | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);

  const [remainingSeconds, setRemainingSeconds] =
    useState(timerSeconds);

  const [isRunning, setIsRunning] = useState(false);
  const [isHoldingToReveal, setIsHoldingToReveal] = useState(false);
  const [isWordsVisible, setIsWordsVisible] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  const [autoNextEnabled, setAutoNextEnabled] = useState(true);

  const [warningSeconds, setWarningSeconds] = useState<number[]>([
    10, 5, 3, 2, 1,
  ]);

  const [roundNumber, setRoundNumber] = useState(1);

  const currentWord = gameState?.currentWord ?? null;
  const history = gameState?.history ?? EMPTY_HISTORY;
  const cycleRestarted = gameState?.cycleRestarted ?? false;

  const wordsAreVisible = isWordsVisible || isHoldingToReveal;

  // Selecting a category automatically includes every subcategory.
  const pool = useMemo(
    () =>
      loadedPacks
        ? buildWordPool(
            loadedPacks.flatMap((pack) => pack.words),
            categoryIds,
          )
        : [],
    [loadedPacks, categoryIds],
  );

  const clearAutoNextTimeout = useCallback(() => {
    if (autoNextTimeoutRef.current !== null) {
      window.clearTimeout(autoNextTimeoutRef.current);
      autoNextTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadPacks() {
      try {
        const packs = await loadWordPacks(categoryIds);

        if (cancelled) return;

        const loadedPool = buildWordPool(
          packs.flatMap((pack) => pack.words),
          categoryIds,
        );

        if (loadedPool.length === 0) {
          setGameState({
            currentWord: null,
            history: [],
            cycleRestarted: false,
          });
        } else {
          const result = drawNextWord(
            loadedPool,
            loadWordHistory(categoryIds),
          );

          setGameState({
            currentWord: result.word,
            history: result.history,
            cycleRestarted: result.cycleReset,
          });
        }

        setLoadedPacks(packs);
        setLoadedCategoryKey(categoryKey);
      } catch (error) {
        console.error("Failed to load word packs:", error);

        if (!cancelled) {
          setGameState({
            currentWord: null,
            history: [],
            cycleRestarted: false,
          });

          setLoadedPacks([]);
          setLoadedCategoryKey(categoryKey);
        }
      }
    }

    void loadPacks();

    return () => {
      cancelled = true;
    };
  }, [categoryIds, categoryKey]);

  const handleRevealStart = (
    event: ReactPointerEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    setIsHoldingToReveal(true);
  };

  const handleRevealEnd = () => {
    setIsHoldingToReveal(false);
  };

  const handleRevealKeyDown = (
    event: ReactKeyboardEvent<HTMLButtonElement>,
  ) => {
    if (
      (event.key === " " || event.key === "Enter") &&
      !event.repeat
    ) {
      event.preventDefault();
      setIsHoldingToReveal(true);
    }
  };

  const handleRevealKeyUp = (
    event: ReactKeyboardEvent<HTMLButtonElement>,
  ) => {
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      setIsHoldingToReveal(false);
    }
  };

  const toggleWordsVisibility = () => {
    setIsWordsVisible((visible) => !visible);
  };

  const handleTimerTick = useCallback((seconds: number) => {
    setRemainingSeconds(seconds);
  }, []);

  const handleTimerComplete = useCallback(() => {
    setRemainingSeconds(0);
    setIsRunning(false);
    setIsHoldingToReveal(false);
  }, []);

  useGameTimer({
    isRunning,
    remainingSeconds,
    soundEnabled,
    hapticsEnabled,
    warningSeconds,
    onTick: handleTimerTick,
    onComplete: handleTimerComplete,
  });

  useEffect(() => {
    if (
      gameState === null ||
      loadedCategoryKey !== categoryKey
    ) {
      return;
    }

    saveWordHistory(categoryIds, history);
  }, [categoryIds, categoryKey, history, gameState, loadedCategoryKey]);

  const nextWord = useCallback(() => {
    clearAutoNextTimeout();

    if (pool.length === 0) return;

    setIsRunning(false);
    setIsHoldingToReveal(false);
    setIsWordsVisible(false);

    const result = drawNextWord(pool, history);

    setGameState({
      currentWord: result.word,
      history: result.history,
      cycleRestarted: result.cycleReset,
    });

    setRemainingSeconds(timerSeconds);
    setRoundNumber((current) => current + 1);
  }, [pool, history, timerSeconds, clearAutoNextTimeout]);

  useEffect(() => {
    if (
      remainingSeconds !== 0 ||
      !autoNextEnabled ||
      !currentWord
    ) {
      return;
    }

    autoNextTimeoutRef.current = window.setTimeout(
      nextWord,
      1500,
    );

    return clearAutoNextTimeout;
  }, [
    remainingSeconds,
    autoNextEnabled,
    currentWord,
    nextWord,
    clearAutoNextTimeout,
  ]);

  useEffect(() => {
    const hideHeldWords = () => {
      setIsHoldingToReveal(false);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsHoldingToReveal(false);
        setIsRunning(false);
      }
    };

    window.addEventListener("blur", hideHeldWords);

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange,
    );

    return () => {
      window.removeEventListener("blur", hideHeldWords);

      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange,
      );
    };
  }, []);

  useEffect(() => {
    return () => clearAutoNextTimeout();
  }, [clearAutoNextTimeout]);

  const startTimer = () => {
    if (!currentWord || remainingSeconds <= 0) return;

    clearAutoNextTimeout();

    setIsHoldingToReveal(false);
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
    setIsHoldingToReveal(false);
  };

  const resetTimer = () => {
    clearAutoNextTimeout();

    setIsRunning(false);
    setIsHoldingToReveal(false);
    setRemainingSeconds(timerSeconds);
  };

  const toggleWarning = (seconds: number) => {
    setWarningSeconds((current) =>
      current.includes(seconds)
        ? current.filter((value) => value !== seconds)
        : [...current, seconds].sort((a, b) => b - a),
    );
  };

  const handleExit = () => {
    clearAutoNextTimeout();

    setIsRunning(false);
    setIsHoldingToReveal(false);
    setIsWordsVisible(false);

    onExit();
  };

  if (
    loadedPacks === null ||
    gameState === null ||
    loadedCategoryKey !== categoryKey
  ) {
    return (
      <section className="mobile-game-screen forge-game-screen">
        <main className="forge-mobile-running-screen">
          <div className="forge-mobile-running-top">
            <span>PREPARING GAME</span>
          </div>

          <div className="forge-mobile-running-word">
            <p>Loading your words...</p>
          </div>
        </main>
      </section>
    );
  }

  if (pool.length === 0 || !currentWord) {
    return <EmptyGameState onExit={handleExit} />;
  }

  const timerState =
    remainingSeconds <= 5
      ? "critical"
      : remainingSeconds <= 10
        ? "warning"
        : "normal";

  const relatedWords = currentWord.relatedWords ?? [];

  const eyeToggle = (
    <button
      type="button"
      className="forge-eye-toggle"
      onClick={toggleWordsVisibility}
      aria-label={
        isWordsVisible
          ? "Hide secret and hint words"
          : "Show secret and hint words"
      }
      aria-pressed={isWordsVisible}
    >
      {isWordsVisible ? (
        <EyeOff size={18} />
      ) : (
        <Eye size={18} />
      )}
    </button>
  );

  const holdToRevealArea = (
    <div className="forge-word-reveal-wrap">
      {eyeToggle}

      <button
        type="button"
        className="forge-hold-reveal-area"
        onPointerDown={handleRevealStart}
        onPointerUp={handleRevealEnd}
        onPointerCancel={handleRevealEnd}
        onLostPointerCapture={handleRevealEnd}
        onKeyDown={handleRevealKeyDown}
        onKeyUp={handleRevealKeyUp}
        onBlur={handleRevealEnd}
        onContextMenu={(event) => event.preventDefault()}
        aria-label={
          wordsAreVisible
            ? `Secret word ${currentWord.word} and hint words visible`
            : "Press and hold to reveal the secret word and hint words"
        }
        aria-pressed={isHoldingToReveal}
        data-revealed={wordsAreVisible}
      >
        <span className="forge-hold-main-label">
          MAIN WORD
        </span>

        <span className="forge-hold-main-word">
          {wordsAreVisible ? currentWord.word : "••••••••"}
        </span>

        <span className="forge-hold-hints-label">
          HINT WORDS
        </span>

        <span className="forge-hold-hints">
          {relatedWords.length > 0 ? (
            relatedWords.map((word, index) => (
              <span
                className="forge-hold-hint-chip"
                key={`${word}-${index}`}
              >
                {wordsAreVisible ? word : "••••••"}
              </span>
            ))
          ) : (
            <span className="forge-hold-no-hints">
              No hint words available
            </span>
          )}
        </span>

        <span className="forge-hold-instruction">
          {isHoldingToReveal
            ? "RELEASE TO HIDE"
            : isWordsVisible
              ? "WORDS ARE VISIBLE"
              : "PRESS AND HOLD TO REVEAL"}
        </span>
      </button>
    </div>
  );

  return (
    <section
      className={`mobile-game-screen forge-game-screen ${
        isRunning ? "forge-game-screen-running" : ""
      }`}
      data-timer-state={timerState}
    >
      {isRunning ? (
        <main className="forge-mobile-running-screen">
          <div className="forge-mobile-running-top">
            <span>
              ROUND {String(roundNumber).padStart(2, "0")}
            </span>

            <span className="forge-mobile-running-live">
              <span />
              LIVE
            </span>
          </div>

          <div className="forge-mobile-running-timer">
            <GameTimer
              remainingSeconds={remainingSeconds}
              totalSeconds={timerSeconds}
              isRunning={isRunning}
            />
          </div>

          <div className="forge-mobile-running-word">
            {holdToRevealArea}
          </div>

          <div className="forge-mobile-running-controls">
            <button
              type="button"
              className="forge-mobile-action forge-mobile-action-primary"
              onClick={pauseTimer}
            >
              <Pause size={19} />
              <span>Pause</span>
            </button>

            <button
              type="button"
              className="forge-mobile-action"
              onClick={resetTimer}
            >
              <RotateCcw size={19} />
              <span>Reset</span>
            </button>

            <button
              type="button"
              className="forge-mobile-action"
              onClick={nextWord}
            >
              <SkipForward size={19} />
              <span>Next</span>
            </button>
          </div>
        </main>
      ) : (
        <>
          <GameHeader
            roundNumber={roundNumber}
            settingsOpen={isSettingsOpen}
            onExit={handleExit}
            onToggleSettings={() =>
              setIsSettingsOpen((open) => !open)
            }
          />

          <main className="mobile-game-main forge-game-main">
            <div className="forge-round-label">
              <span className="forge-live-indicator" />

              {remainingSeconds === 0
                ? "ROUND COMPLETE"
                : "READY TO PLAY"}

              <span className="forge-round-number">
                ROUND {String(roundNumber).padStart(2, "0")}
              </span>
            </div>

            <div className="mobile-game-timer-wrap forge-timer-wrap">
              <GameTimer
                remainingSeconds={remainingSeconds}
                totalSeconds={timerSeconds}
                isRunning={false}
              />
            </div>

            <div className="mobile-game-word-card forge-word-card">
              <div className="forge-card-heading">
                <span>YOUR SECRET WORD</span>

                <span className="forge-private-label">
                  <span /> PRIVATE
                </span>
              </div>

              {holdToRevealArea}
            </div>

            {cycleRestarted && (
              <div className="mobile-cycle-notice">
                <Sparkles size={14} />
                New word cycle started. All words have been used.
              </div>
            )}

            <div className="forge-game-footer">
              <div className="forge-category-list">
                {selectedCategoryNames.map((name) => {
                  const CategoryIcon = getCategoryIcon(name);

                  return (
                    <span
                      className="forge-category-chip"
                      key={name}
                    >
                      <CategoryIcon size={13} strokeWidth={2} />
                      {name}
                    </span>
                  );
                })}
              </div>

              <div className="forge-word-progress">
                <span>{history.length}</span>
                <span className="forge-progress-divider">/</span>
                <span>{pool.length} WORDS</span>
              </div>
            </div>
          </main>

          <div className="forge-controls-wrap">
            <GameControls
              isRunning={false}
              remainingSeconds={remainingSeconds}
              totalSeconds={timerSeconds}
              onStart={startTimer}
              onPause={pauseTimer}
              onReset={resetTimer}
              onNext={nextWord}
            />
          </div>

          <GameSettings
            open={isSettingsOpen}
            soundEnabled={soundEnabled}
            hapticsEnabled={hapticsEnabled}
            autoNextEnabled={autoNextEnabled}
            warningSeconds={warningSeconds}
            onSoundChange={setSoundEnabled}
            onHapticsChange={setHapticsEnabled}
            onAutoNextChange={setAutoNextEnabled}
            onToggleWarning={toggleWarning}
            onClose={() => setIsSettingsOpen(false)}
          />
        </>
      )}
    </section>
  );
}