import { useEffect, useMemo, useRef, useState } from "react";
import { Globe2, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useSound } from "../hooks/useSound";

export default function TypingArea({ test, preferences, update }) {
  const { session, start, restart, input } = test;
  const { status, typed, passage, elapsed, config } = session;
  const inputRef = useRef(null);
  const cursorRef = useRef(null);
  const viewportRef = useRef(null);
  const [focused, setFocused] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const play = useSound(preferences.sound);
  const running = status === "running";
  const remaining = Math.max(0, Math.ceil(config.duration - elapsed));

  const reset = () => {
    restart();
    inputRef.current?.focus({ preventScroll: true });
  };

  useEffect(() => {
    // Touch users choose when to open their keyboard; desktop users can type immediately.
    if (window.matchMedia("(pointer: fine)").matches)
      inputRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    const keydown = (event) => {
      if (
        ((event.ctrlKey || event.metaKey) && event.key === "Enter") ||
        event.key === "Escape"
      ) {
        event.preventDefault();
        restart();
        inputRef.current?.focus({ preventScroll: true });
      }
      if (document.activeElement === inputRef.current)
        setCapsLock(event.getModifierState("CapsLock"));
    };
    window.addEventListener("keydown", keydown);
    return () => window.removeEventListener("keydown", keydown);
  }, [restart]);

  useEffect(() => {
    const cursor = cursorRef.current;
    const viewport = viewportRef.current;
    if (!cursor || !viewport) return;
    const lineHeight = parseFloat(
      getComputedStyle(cursor.parentElement).lineHeight,
    );
    viewport.scrollTo({
      top: Math.max(0, cursor.offsetTop - lineHeight),
      behavior:
        preferences.smoothCaret &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "smooth"
          : "instant",
    });
  }, [typed.length, session.id, preferences.smoothCaret, preferences.fontSize]);

  const characters = useMemo(() => {
    let offset = 0;
    return passage.split(" ").map((word, wordIndex, words) => {
      const chunk = word + (wordIndex < words.length - 1 ? " " : "");
      return (
        <span className="passage-word" key={wordIndex}>
          {[...chunk].map((char) => {
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
          })}
        </span>
      );
    });
  }, [passage, typed]);

  return (
    <div className={`focus-test ${running ? "is-running" : ""}`}>
      <section className="focus-stage" aria-label="Typing test">
        <div className="focus-language">
          <Globe2 size={17} />
          <span>english{config.practice ? ` / ${config.practice}` : ""}</span>
        </div>
        <div
          className="test-countdown"
          role="timer"
          aria-label="Seconds remaining"
          aria-live="off"
        >
          {remaining}
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
            Start typing to begin the countdown. Backspace corrects mistakes.
            Press Tab then Enter, Control Enter, or Escape to restart. Passage:{" "}
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
            onBlur={() => setFocused(false)}
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
        <div className="focus-feedback" aria-live="polite">
          {capsLock
            ? "caps lock is on"
            : !focused
              ? running
                ? "click the text to continue · timer is running"
                : "click the text to focus"
              : !running
                ? "start typing to begin"
                : ""}
        </div>
        <div className="focus-actions">
          <button
            className="icon-button focus-restart"
            onClick={reset}
            aria-label="Restart test"
            title="Restart test (Tab then Enter)"
          >
            <RotateCcw size={22} />
          </button>
          <button
            className={`icon-button focus-sound ${preferences.sound ? "enabled" : ""}`}
            onClick={() => update({ sound: !preferences.sound })}
            aria-label={
              preferences.sound ? "Mute typing sounds" : "Enable typing sounds"
            }
            aria-pressed={preferences.sound}
            title="Typing sounds"
          >
            {preferences.sound ? <Volume2 size={17} /> : <VolumeX size={17} />}
          </button>
        </div>
      </section>
      <div className="focus-shortcuts">
        <span>
          <kbd>tab</kbd> + <kbd>enter</kbd>
          <span>restart test</span>
        </span>
        <span>
          <kbd>ctrl / ⌘</kbd> + <kbd>enter</kbd>
          <span>or</span>
          <kbd>esc</kbd>
          <span>quick reset</span>
        </span>
      </div>
    </div>
  );
}
