import { useCallback, useEffect, useRef, useState } from "react";
import { generatePassage } from "../data/passages";
import {
  advanceClock,
  applyInput,
  createSession,
  metrics,
  toResult,
} from "../lib/engine";

export function useTypingTest(config, onComplete) {
  const configRef = useRef(config);
  configRef.current = config;
  const completeRef = useRef(onComplete);
  completeRef.current = onComplete;
  const build = () =>
    createSession(
      configRef.current.passage ||
        generatePassage(configRef.current.difficulty, configRef.current.mode),
      configRef.current,
    );
  const [session, setSession] = useState(build);
  const current = useRef(session);
  const recorded = useRef(null);

  const publish = useCallback((next) => {
    current.current = next;
    setSession(next);
    if (next.status === "finished" && recorded.current !== next.id) {
      recorded.current = next.id;
      completeRef.current(toResult(next));
    }
  }, []);

  const restart = useCallback(() => {
    const c = configRef.current;
    publish(
      createSession(c.passage || generatePassage(c.difficulty, c.mode), c),
    );
  }, [publish]);

  useEffect(() => {
    restart();
  }, [
    config.duration,
    config.difficulty,
    config.mode,
    config.practice,
    config.passage,
    restart,
  ]);

  useEffect(() => {
    const tick = () => {
      if (current.current.status === "running")
        publish(advanceClock(current.current, performance.now()));
    };
    const interval = setInterval(tick, 50);
    document.addEventListener("visibilitychange", tick);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", tick);
    };
  }, [publish]);

  const start = useCallback(() => {
    if (current.current.status === "idle")
      publish({ ...current.current, status: "ready" });
  }, [publish]);
  const input = useCallback(
    (value) => publish(applyInput(current.current, value, performance.now())),
    [publish],
  );
  return { session, stats: metrics(session), restart, start, input };
}
