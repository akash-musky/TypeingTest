import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  Globe2,
  Keyboard,
  RotateCcw,
  Volume2,
  VolumeX,
} from "lucide-react";
import VirtualKeyboard from "./VirtualKeyboard";
import LiveMetrics from "./LiveMetrics";
import { useSound } from "../hooks/useSound";

export default function TypingArea({ test, preferences, update }) {
  const { session, stats, start, restart, input } = test;
  const { status, typed, passage, elapsed, config } = session;
  const inputRef = useRef(null);
  const cursorRef = useRef(null);
  const viewportRef = useRef(null);
  const [focused, setFocused] = useState(false);
  const [pressed, setPressed] = useState(new Set());
  const [capsLock, setCapsLock] = useState(false);
  const play = useSound(preferences.sound);
  const running = status === "running";

  const focus = () => {
    start();
    inputRef.current?.focus();
  };
  const reset = () => {
    restart();
    setPressed(new Set());
    inputRef.current?.focus();
  };

  useEffect(() => {
    const keydown = (event) => {
      if (
        ((event.ctrlKey || event.metaKey) && event.key === "Enter") ||
        event.key === "Escape"
      ) {
        event.preventDefault();
        restart();
        inputRef.current?.focus();
      }
      if (document.activeElement === inputRef.current) {
        setPressed((keys) => new Set(keys).add(event.code));
        setCapsLock(event.getModifierState("CapsLock"));
      }
    };
    const keyup = (event) =>
      setPressed((keys) => {
        const next = new Set(keys);
        next.delete(event.code);
        return next;
      });
    const blur = () => setPressed(new Set());
    window.addEventListener("keydown", keydown);
    window.addEventListener("keyup", keyup);
    window.addEventListener("blur", blur);
    return () => {
      window.removeEventListener("keydown", keydown);
      window.removeEventListener("keyup", keyup);
      window.removeEventListener("blur", blur);
    };
  }, [restart]);

  useEffect(() => {
    const cursor = cursorRef.current;
    const viewport = viewportRef.current;
    if (cursor && viewport) {
      viewport.scrollTo({
        top: Math.max(0, cursor.offsetTop - 52),
        behavior: preferences.smoothCaret ? "smooth" : "instant",
      });
    }
  }, [typed.length, session.id, preferences.smoothCaret]);

  useEffect(() => {
    if (status === "finished") setPressed(new Set());
  }, [status]);

  const characters = useMemo(() => {
    let offset = 0;
    return passage.split(" ").map((word, wordIndex, words) => {
      const chunk = word + (wordIndex < words.length - 1 ? " " : "");
      const letters = [...chunk].map((char) => {
        const index = offset++;
        return (
          <span
            key={index}
            ref={index === typed.length ? cursorRef : undefined}
            className={`${index < typed.length ? (char === typed[index] ? "char-correct" : "char-incorrect") : ""} ${index === typed.length ? "char-current" : ""}`}
          >
            {char}
          </span>
        );
      });
      return (
        <span className="passage-word" key={wordIndex}>
          {letters}
        </span>
      );
    });
  }, [passage, typed]);

  return (
    <div className="test-workspace">
      <LiveMetrics session={session} stats={stats} />
      <div className="typing-workspace-main">
      <section
        className={`typing-panel panel ${focused ? "is-focused" : ""} ${running ? "is-running" : ""}`}
        aria-label="Typing test"
      >
        <div className="studio-header">
          <div className="studio-title"><span className="studio-icon"><Keyboard size={21} /></span><div><span className="studio-eyebrow">YOUR FOCUS SPACE</span><h2>Let the words flow<span>.</span></h2></div></div>
          <span className={`studio-session-badge ${running ? "is-active" : ""}`}><i />{running ? "SESSION LIVE" : "READY TO BEGIN"}</span>
        </div>
        <div
          className="timer-track"
          role="progressbar"
          aria-label="Test time elapsed"
          aria-valuenow={Math.round(elapsed)}
          aria-valuemin={0}
          aria-valuemax={config.duration}
        >
          <div style={{ width: `${(elapsed / config.duration) * 100}%` }} />
        </div>
        <div className="passage-container">
          <div className="passage-toolbar">
            <span className="language-label">
              <Globe2 size={13} /> english <span className="tiny-dot" />{" "}
              {config.practice || config.mode}
            </span>
            <span className={`typing-status ${running ? "running" : ""}`}>
              <i />
              {running
                ? "In the flow"
                : status === "ready"
                  ? "Ready when you are"
                  : "Make yourself comfortable"}
            </span>
          </div>
          <div
            className={`typing-input-container font-${preferences.fontSize} ${preferences.smoothCaret ? "" : "no-caret-animation"}`}
          >
            <div
              ref={viewportRef}
              className="passage-viewport"
              aria-hidden="true"
            >
              <div className="passage-text" data-testid="passage">
                {characters}
              </div>
            </div>
            <label className="sr-only" htmlFor="typing-input">
              Type the displayed passage
            </label>
            <p id="typing-instructions" className="sr-only">
              The timer begins on your first character. Backspace corrects
              mistakes. Press Control Enter or Escape to restart. Passage:{" "}
              {passage}
            </p>
            <textarea
              id="typing-input"
              ref={inputRef}
              className="typing-input"
              value={typed}
              disabled={status === "finished"}
              aria-describedby="typing-instructions"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              inputMode="text"
              onFocus={() => {
                setFocused(true);
                start();
              }}
              onBlur={() => {
                setFocused(false);
                setPressed(new Set());
              }}
              onChange={(event) => {
                const value = event.target.value;
                if (value.length > typed.length)
                  play(value.at(-1) !== passage[value.length - 1]);
                input(value);
              }}
              onSelect={(event) => {
                const field = event.target;
                field.setSelectionRange(field.value.length, field.value.length);
              }}
              onKeyDown={(event) => {
                if (
                  [
                    "ArrowLeft",
                    "ArrowRight",
                    "ArrowUp",
                    "ArrowDown",
                    "Home",
                    "End",
                    "Enter",
                  ].includes(event.key) &&
                  !event.ctrlKey &&
                  !event.metaKey
                )
                  event.preventDefault();
              }}
              onPaste={(event) => event.preventDefault()}
              onDrop={(event) => event.preventDefault()}
            />
          </div>
          <div className="passage-bottom">
            <span>
              {capsLock ? (
                <>
                  <Keyboard size={14} /> Caps lock is on
                </>
              ) : running && !focused ? (
                <>
                  <Keyboard size={14} /> Click the text to resume typing · timer
                  is running
                </>
              ) : focused ? (
                <>
                  <span className="focus-dot" />{" "}
                  {running
                    ? "Keep going. You’ve got this."
                    : "Start typing to begin the countdown."}
                </>
              ) : (
                <>
                  <Keyboard size={14} /> Click the text or press Start Test
                </>
              )}
            </span>
            <span>
              {typed.length}
              <span className="muted"> / {passage.length} characters</span>
            </span>
          </div>
        </div>
        <div className="test-actionbar">
          <div className="legend">
            <span>
              <i className="correct-dot" />
              Correct
            </span>
            <span>
              <i className="incorrect-dot" />
              Incorrect
            </span>
            <span>
              <i className="current-dot" />
              Current
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => update({ sound: !preferences.sound })}
              className={`icon-button ${preferences.sound ? "enabled" : ""}`}
              aria-label={
                preferences.sound
                  ? "Mute typing sounds"
                  : "Enable typing sounds"
              }
              aria-pressed={preferences.sound}
              title="Typing sounds"
            >
              {preferences.sound ? (
                <Volume2 size={17} />
              ) : (
                <VolumeX size={17} />
              )}
            </button>
            <button
              className="icon-button"
              onClick={reset}
              aria-label="Restart test"
              title="Restart test (Ctrl + Enter)"
            >
              <RotateCcw size={17} />
            </button>
            <span className="action-separator" />
            <button
              className="primary-button start-button"
              onClick={focus}
              disabled={running}
            >
              {running ? (
                <>
                  <span className="button-pulse" />
                  Test in progress
                </>
              ) : (
                <>
                  {" "}
                  {status === "ready" ? "Start typing" : "Start Test"}{" "}
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </div>
      </section>
      <div className="under-test">
        <span>
          <Check size={13} /> No pressure. Just progress.
        </span>
        <span>
          <kbd>ctrl</kbd>
          <span>+</span>
          <kbd>enter</kbd> to restart{" "}
          <span className="shortcut-divider">/</span>
          <kbd>esc</kbd> to reset
        </span>
      </div>
      {preferences.keyboard && <VirtualKeyboard pressed={pressed} />}
      </div>
    </div>
  );
}
