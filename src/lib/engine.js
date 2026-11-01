// The clock is injected so the exact same logic can be tested without real timers.
export function createSession(passage, config) {
  return {
    id: globalThis.crypto.randomUUID(),
    passage,
    config: { ...config },
    status: "idle",
    typed: "",
    startedAt: null,
    elapsed: 0,
    attempts: 0,
    errors: 0,
    samples: [{ second: 0, wpm: 0 }],
  };
}

export function metrics(session) {
  const correct = [...session.typed].reduce(
    (count, char, i) => count + Number(char === session.passage[i]),
    0,
  );
  return {
    correct,
    wpm:
      session.elapsed >= 1
        ? Math.round((correct / 5) * (60 / session.elapsed))
        : 0,
    accuracy: session.attempts
      ? Math.round(
          ((session.attempts - session.errors) / session.attempts) * 1000,
        ) / 10
      : 100,
    errors: session.errors,
  };
}

export function advanceClock(session, now) {
  if (session.status !== "running") return session;
  const elapsed = Math.min(
    session.config.duration,
    Math.max(0, (now - session.startedAt) / 1000),
  );
  let next = { ...session, elapsed };
  const last = next.samples.at(-1);
  if (Math.floor(elapsed) > Math.floor(last.second)) {
    next.samples = [
      ...next.samples,
      { second: Math.floor(elapsed), wpm: metrics(next).wpm },
    ];
  }
  if (elapsed >= session.config.duration) next = finishSession(next);
  return next;
}

export function finishSession(session) {
  if (session.status === "finished") return session;
  const point = {
    second: Math.round(session.elapsed * 10) / 10,
    wpm: metrics(session).wpm,
  };
  const samples = session.samples.filter(
    (sample) => sample.second < point.second,
  );
  return { ...session, status: "finished", samples: [...samples, point] };
}

export function applyInput(session, value, now) {
  if (session.status === "finished") return session;
  let next = advanceClock(session, now);
  if (next.status === "finished") return next;
  const typed = value.slice(0, session.passage.length).replace(/[\r\n]/g, "");
  if (typed === next.typed) return next;
  if (next.startedAt === null) {
    if (!typed) return next;
    next = { ...next, status: "running", startedAt: now };
  }
  let prefix = 0;
  while (
    prefix < typed.length &&
    prefix < next.typed.length &&
    typed[prefix] === next.typed[prefix]
  )
    prefix++;
  const inserted = typed.slice(prefix);
  const errors = [...inserted].reduce(
    (count, char, i) => count + Number(char !== next.passage[prefix + i]),
    0,
  );
  next = {
    ...next,
    typed,
    attempts: next.attempts + inserted.length,
    errors: next.errors + errors,
  };
  if (typed.length === next.passage.length) next = finishSession(next);
  return next;
}

export function toResult(session, date = new Date()) {
  return {
    id: session.id,
    date: date.toISOString(),
    ...metrics(session),
    duration: Math.round(session.elapsed * 10) / 10,
    configuredDuration: session.config.duration,
    difficulty: session.config.difficulty,
    mode: session.config.mode,
    practice: session.config.practice || null,
    samples: session.samples,
  };
}
