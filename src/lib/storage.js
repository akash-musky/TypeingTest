export const defaults = {
  theme: "dark",
  sound: false,
  smoothCaret: true,
  fontSize: "medium",
  duration: 30,
  difficulty: "easy",
  mode: "words",
};

export function readPreferences() {
  try {
    const data =
      JSON.parse(localStorage.getItem("typingtest.preferences")) || {};
    return Object.fromEntries(
      Object.entries(defaults).map(([key, fallback]) => {
        const allowed = {
          theme: ["dark", "light"],
          duration: [15, 30, 60, 120],
          difficulty: ["easy", "medium", "hard"],
          mode: ["words", "sentences", "numbers", "punctuation"],
          fontSize: ["small", "medium", "large"],
        }[key];
        return [
          key,
          allowed
            ? allowed.includes(data[key])
              ? data[key]
              : fallback
            : typeof data[key] === "boolean"
              ? data[key]
              : fallback,
        ];
      }),
    );
  } catch {
    return { ...defaults };
  }
}

export function readResults() {
  try {
    const data = JSON.parse(localStorage.getItem("typingtest.results"));
    return Array.isArray(data)
      ? data
          .filter(
            (r) =>
              r &&
              typeof r.id === "string" &&
              Number.isFinite(Date.parse(r.date)) &&
              ["wpm", "accuracy", "errors", "correct", "duration"].every((k) =>
                Number.isFinite(r[k]),
              ) &&
              Array.isArray(r.samples) &&
              r.samples.every(
                (s) => Number.isFinite(s.second) && Number.isFinite(s.wpm),
              ),
          )
          .slice(0, 100)
      : [];
  } catch {
    return [];
  }
}

export function persist(key, value) {
  try {
    localStorage.setItem(`typingtest.${key}`, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}
