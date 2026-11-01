import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, Sparkles, Zap } from "lucide-react";
import Navigation, { Footer } from "./components/Navigation";
import TestControls from "./components/TestControls";
import TypingArea from "./components/TypingArea";
import Results, { ResultDetail } from "./components/Results";
import Practice from "./components/Practice";
import Settings from "./components/Settings";
import SpaceBackground from "./components/SpaceBackground";
import { useTypingTest } from "./hooks/useTypingTest";
import { persist, readPreferences, readResults } from "./lib/storage";

const validPages = ["test", "results", "practice", "settings"];
const readPage = () =>
  validPages.includes(window.location.hash.slice(1))
    ? window.location.hash.slice(1)
    : "test";

export default function App() {
  const [page, setPage] = useState(readPage);
  const [preferences, setPreferences] = useState(readPreferences);
  const [history, setHistory] = useState(readResults);
  const [latest, setLatest] = useState(null);
  const [drill, setDrill] = useState(null);
  const [storageError, setStorageError] = useState(false);
  const historyRef = useRef(history);
  const headingRef = useRef(null);
  const onComplete = useCallback((result) => {
    const next = [
      result,
      ...historyRef.current.filter((r) => r.id !== result.id),
    ].slice(0, 100);
    historyRef.current = next;
    setHistory(next);
    setLatest(result);
    if (!persist("results", next)) setStorageError(true);
  }, []);
  const config = {
    duration: drill?.duration || preferences.duration,
    difficulty: drill?.difficulty || preferences.difficulty,
    mode: drill?.mode || preferences.mode,
    practice: drill?.title,
    passage: drill?.passage,
  };
  const test = useTypingTest(config, onComplete);

  useEffect(() => {
    document.documentElement.dataset.theme = preferences.theme;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute(
        "content",
        preferences.theme === "dark" ? "#0B1020" : "#f7f7fc",
      );
    if (!persist("preferences", preferences)) setStorageError(true);
  }, [preferences]);

  useEffect(() => {
    const handleHash = () => setPage(readPage());
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  useEffect(() => {
    if (page !== "test") test.restart();
    document.title = "TypeOrbit — Free Online Typing Test | WPM & Accuracy";
  }, [page, test.restart]);

  useEffect(() => {
    if (page !== "test" || test.session.status !== "finished") return;
    const shortcut = (event) => {
      if (
        ((event.ctrlKey || event.metaKey) && event.key === "Enter") ||
        event.key === "Escape"
      ) {
        event.preventDefault();
        test.restart();
        requestAnimationFrame(() =>
          document.getElementById("typing-input")?.focus(),
        );
      }
    };
    window.addEventListener("keydown", shortcut);
    return () => window.removeEventListener("keydown", shortcut);
  }, [page, test.session.status, test.restart]);

  const navigate = (next) => {
    if (page === next) return;
    setPage(next);
    window.location.hash = next;
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => headingRef.current?.focus({ preventScroll: true }), 0);
  };
  const update = (patch) =>
    setPreferences((current) => ({ ...current, ...patch }));
  const retry = () => {
    setLatest(null);
    setDrill(null);
    test.restart();
    navigate("test");
  };
  const chooseDrill = (selected) => {
    setLatest(null);
    setDrill(selected);
    test.restart();
    navigate("test");
  };
  const completed =
    page === "test" && test.session.status === "finished" && latest;
  const hero = {
    test: {
      eyebrow: "FREE ONLINE TYPING TEST",
      title: (
        <>
          Type Beyond <span>Limits.</span>
        </>
      ),
      subtitle:
        "Test your typing speed in WPM, improve accuracy, and practice for free.",
    },
    results: {
      eyebrow: "EVERY KEYSTROKE TELLS A STORY.",
      title: (
        <>
          Look at you <span>getting better.</span>
        </>
      ),
      subtitle: "Your speed, your milestones, your progress. All in one place.",
    },
    practice: {
      eyebrow: "CONSISTENCY IS YOUR SUPERPOWER.",
      title: (
        <>
          Make progress <span>a habit.</span>
        </>
      ),
      subtitle:
        "A little intentional practice goes a long way. Find your focus below.",
    },
    settings: {
      eyebrow: "YOUR SPACE. YOUR PACE.",
      title: (
        <>
          Made to feel <span>like you.</span>
        </>
      ),
      subtitle:
        "Fine-tune the details. Create a space where you can do your best.",
    },
  }[page];

  return (
    <div
      className={`app-shell minimal-app typeorbit-app ${page === "test" && test.session.status === "running" ? "test-running" : ""}`}
    >
      <SpaceBackground />
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Navigation
        page={page}
        onNavigate={navigate}
        theme={preferences.theme}
        toggleTheme={() =>
          update({ theme: preferences.theme === "dark" ? "light" : "dark" })
        }
      />
      <main
        id="main"
        className={`main-container ${page === "test" && !completed ? "test-page" : ""}`}
      >
        <div className="sr-only" role="status" aria-live="polite">
          {completed
            ? `Test complete. ${latest.wpm} words per minute. ${latest.accuracy}% accuracy.`
            : ""}
        </div>
        <section
          className={page === "test" && !completed ? "hero orbit-hero" : "hero"}
        >
          <div className="hero-eyebrow">
            <span className="eyebrow-icon">
              <Zap size={11} fill="currentColor" />
            </span>
            {hero.eyebrow}
          </div>
          <h1 ref={headingRef} tabIndex={-1}>
            {hero.title}
          </h1>
          <p>{hero.subtitle}</p>
        </section>
        {storageError && (
          <div className="storage-notice" role="status">
            Browser storage is unavailable. You can keep typing, but this
            session’s results and preferences may not survive a refresh.
          </div>
        )}
        {page === "test" && (
          <div className="animate-in">
            {completed ? (
              <ResultDetail
                result={latest}
                history={history}
                onRetry={() => {
                  setLatest(null);
                  test.restart();
                }}
                onViewHistory={() => navigate("results")}
              />
            ) : (
              <>
                {drill ? (
                  <div className="drill-banner panel">
                    <span>
                      <Sparkles size={17} />
                      <strong>{drill.title}</strong>
                      <span className="muted">{drill.duration}s practice</span>
                    </span>
                    <button
                      className="text-button"
                      onClick={() => {
                        setDrill(null);
                        test.restart();
                        navigate("practice");
                      }}
                    >
                      <ArrowLeft size={14} />
                      All drills
                    </button>
                  </div>
                ) : (
                  <TestControls
                    preferences={preferences}
                    update={update}
                    disabled={test.session.status === "running"}
                  />
                )}
                <TypingArea
                  test={test}
                  preferences={preferences}
                  update={update}
                />
              </>
            )}
          </div>
        )}
        {page === "results" && <Results history={history} onRetry={retry} />}
        {page === "practice" && <Practice onChoose={chooseDrill} />}
        {page === "settings" && (
          <Settings
            preferences={preferences}
            update={update}
            historyCount={history.length}
            clearHistory={() => {
              historyRef.current = [];
              setHistory([]);
              setLatest(null);
              if (!persist("results", [])) setStorageError(true);
            }}
          />
        )}
      </main>
      <Footer />
    </div>
  );
}
