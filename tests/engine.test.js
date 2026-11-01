import test from "node:test";
import assert from "node:assert/strict";
import {
  advanceClock,
  applyInput,
  createSession,
  metrics,
  toResult,
} from "../src/lib/engine.js";
import { generatePassage } from "../src/data/passages.js";

const make = (text = "hello world", duration = 30) =>
  createSession(text, { duration, mode: "words", difficulty: "easy" });

test("idle time never counts; the first character starts the monotonic clock", () => {
  const idle = make();
  assert.equal(advanceClock(idle, 100_000), idle);
  const started = applyInput(idle, "h", 100_000);
  assert.equal(started.startedAt, 100_000);
  assert.equal(started.elapsed, 0);
  assert.equal(started.status, "running");
  assert.equal(metrics(started).wpm, 0);
  assert.equal(advanceClock(started, 105_000).elapsed, 5);
});

test("WPM uses retained correct characters and actual elapsed time", () => {
  let session = applyInput(make(), "h", 0);
  session = applyInput(session, "hello", 5_000);
  assert.equal(metrics(session).wpm, 12);
  assert.equal(metrics(session).correct, 5);
  assert.equal(metrics(session).accuracy, 100);
});

test("backspace and correction retain mistake history but fix character scoring", () => {
  let session = applyInput(make(), "x", 0);
  assert.equal(metrics(session).errors, 1);
  session = applyInput(session, "", 500);
  assert.equal(session.status, "running");
  assert.equal(session.startedAt, 0);
  assert.equal(metrics(session).errors, 1);
  session = applyInput(session, "h", 1_000);
  assert.equal(metrics(session).correct, 1);
  assert.equal(metrics(session).accuracy, 50);
  assert.equal(session.attempts, 2);
  session = applyInput(session, "hello", 5_000);
  assert.equal(metrics(session).accuracy, 83.3);
  assert.equal(metrics(session).wpm, 12);
});

test("deleting correct characters reduces current WPM without introducing errors", () => {
  let session = applyInput(make(), "hello", 0);
  session = applyInput(session, "hel", 5_000);
  assert.equal(metrics(session).correct, 3);
  assert.equal(metrics(session).wpm, 7);
  assert.equal(metrics(session).accuracy, 100);
  assert.equal(session.attempts, 5);
});

test("a delayed timer tick ends at the configured duration with no extra time", () => {
  const started = applyInput(make("hello world", 15), "hello", 1_000);
  const finished = advanceClock(started, 80_000);
  assert.equal(finished.status, "finished");
  assert.equal(finished.elapsed, 15);
  assert.equal(metrics(finished).wpm, 4);
  assert.equal(finished.samples.at(-1).second, 15);
});

test("input at or after the deadline cannot inflate the score", () => {
  const started = applyInput(make("hello world", 15), "h", 0);
  const finished = applyInput(started, "hello world", 15_000);
  assert.equal(finished.typed, "h");
  assert.equal(finished.status, "finished");
  assert.equal(finished.attempts, 1);
});

test("completing a passage ends early and subsequent input cannot change it", () => {
  let session = applyInput(make("hello"), "h", 0);
  session = applyInput(session, "hello", 2_000);
  assert.equal(session.status, "finished");
  assert.equal(session.elapsed, 2);
  assert.equal(metrics(session).wpm, 30);
  assert.equal(applyInput(session, "x", 2_500), session);
  assert.equal(advanceClock(session, 3_000), session);
  assert.equal(session.samples.at(-1).wpm, 30);
});

test("the result contains complete, serializable metrics and config", () => {
  let session = applyInput(make("hello"), "h", 0);
  session = applyInput(session, "hello", 5_000);
  const result = toResult(session, new Date("2026-11-02T00:00:00Z"));
  assert.equal(result.duration, 5);
  assert.equal(result.configuredDuration, 30);
  assert.equal(result.correct, 5);
  assert.equal(result.wpm, 12);
  assert.deepEqual(JSON.parse(JSON.stringify(result)), result);
});

test("new sessions reset all counters and never mutate the previous session", () => {
  const initial = make();
  const next = applyInput(initial, "h", 0);
  assert.equal(initial.typed, "");
  assert.equal(initial.status, "idle");
  assert.notEqual(next, initial);
  const reset = make();
  assert.notEqual(reset.id, initial.id);
  assert.equal(reset.attempts, 0);
  assert.equal(reset.elapsed, 0);
});

test("all difficulty and text combinations produce sufficient, valid passages", () => {
  for (const difficulty of ["easy", "medium", "hard"]) {
    for (const mode of ["words", "sentences", "numbers", "punctuation"]) {
      const passage = generatePassage(difficulty, mode);
      assert.ok(passage.length > 350, `${difficulty} ${mode}`);
      assert.equal(passage.trim(), passage);
      assert.ok(!passage.includes("undefined"));
      if (mode === "numbers") assert.match(passage, /^[\d ]+$/);
      if (mode === "punctuation") assert.match(passage, /[.,!?;:]/);
    }
  }
});
