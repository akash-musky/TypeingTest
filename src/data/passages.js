const vocabulary = {
  easy: "the quick brown fox jumps over a lazy dog sun moon light rain wind blue green water earth home time smile dream calm fresh clear warm soft bright small happy kind read write walk learn make grow find open close look think world day night tree leaf sea wave sky star bird cloud road new good great feel flow quiet place move life play work love heart hand way",
  medium:
    "creative journey discover balance curious imagine explore rhythm purpose simple focus mindful progress design inspire moment gentle connect develop wonder patient practice morning evening mountain ocean forest courage freedom energy steady achieve capture reflect kindness horizon peaceful brilliant possibility adventure beyond become improve silence natural vibrant beautiful together tomorrow",
  hard: "extraordinary quintessential juxtaposition synchronize perseverance architecture conscientious phenomenon equilibrium kaleidoscope entrepreneurial meticulous accessibility serendipity sophisticated ambiguous resilient philosophical unprecedented symmetrical bureaucracy acknowledge hypothetical miscellaneous ubiquitous exhilaration indispensable susceptibility rhythmically fluorescent chrysanthemum configuration asynchronous",
};

const sentences = {
  easy: [
    "The best way to learn is to take one small step each day.",
    "A warm cup of tea and a good book make a quiet day feel right.",
    "Look up at the stars and let your mind find a new path.",
    "The sun rose over the hills and filled the sky with gold.",
    "Slow down and enjoy the little things that make life bright.",
    "Every great story starts with a single word on a blank page.",
  ],
  medium: [
    "Small moments of focus can turn ordinary practice into extraordinary progress.",
    "Beyond the quiet forest, a winding river reflects the colors of the evening sky.",
    "Curiosity opens doors that experience alone might never discover.",
    "The secret to building something meaningful is showing up with patience every day.",
    "Creative work begins when we give ourselves permission to explore unfamiliar ideas.",
    "Find a comfortable rhythm, relax your shoulders, and let each word follow the next.",
  ],
  hard: [
    "Extraordinary accomplishments require conscientious preparation, resilience, and unwavering perseverance.",
    "The architect juxtaposed symmetrical structures with unpredictable, kaleidoscopic patterns.",
    "Asynchronous communication introduces architectural complexities that necessitate meticulous synchronization.",
    "Philosophical ambiguity challenges preconceived assumptions about consciousness and individual experience.",
    "Serendipitous discoveries frequently emerge from seemingly inconsequential experimental observations.",
  ],
};

const pick = (items, random) => items[Math.floor(random() * items.length)];

export function generatePassage(
  difficulty = "easy",
  mode = "words",
  random = Math.random,
) {
  const words = (vocabulary[difficulty] || vocabulary.easy).split(" ");
  if (mode === "sentences") {
    return Array.from({ length: 24 }, () =>
      pick(sentences[difficulty] || sentences.easy, random),
    ).join(" ");
  }
  if (mode === "numbers") {
    const digits = { easy: 2, medium: 4, hard: 7 }[difficulty] || 2;
    return Array.from({ length: 130 }, () =>
      String(Math.floor(random() * (10 ** digits - 1)) + 1).padStart(
        digits,
        "0",
      ),
    ).join(" ");
  }
  if (mode === "punctuation") {
    const endings =
      difficulty === "easy" ? [".", ",", "?"] : ["!", ";", ":", "...", "?"];
    return Array.from({ length: 75 }, () => {
      const phrase = `${pick(words, random)} ${pick(words, random)}`;
      const wrapped =
        difficulty === "hard"
          ? pick([`"${phrase}"`, `(${phrase})`, `[${phrase}]`, phrase], random)
          : phrase;
      return wrapped + pick(endings, random);
    }).join(" ");
  }
  return Array.from({ length: 180 }, () => pick(words, random)).join(" ");
}

export const drills = [
  {
    id: "home",
    title: "Find your home row",
    category: "THE FOUNDATIONS",
    description: "Build muscle memory, one finger at a time.",
    keys: "A S D F  J K L ;",
    duration: 30,
    difficulty: "easy",
    mode: "words",
    passage:
      "asdf jkl; asdf jkl; sad lad fall ask flask salad lads dad add all fads glad flask fall sad lads",
  },
  {
    id: "flow",
    title: "Get into the flow",
    category: "SPEED & RHYTHM",
    description: "Common words. Steady rhythm. A little faster.",
    keys: "T H E  A N D  Y O U",
    duration: 60,
    difficulty: "easy",
    mode: "words",
  },
  {
    id: "precision",
    title: "Make every key count",
    category: "ACCURACY FIRST",
    description: "Slow down and master the tricky characters.",
    keys: "{ }  [ ]  ; :  ! ?",
    duration: 30,
    difficulty: "hard",
    mode: "punctuation",
  },
  {
    id: "numbers",
    title: "Strength in numbers",
    category: "NUMBER ROW",
    description: "Give your number keys a little attention.",
    keys: "1 2 3 4 5 6 7 8 9 0",
    duration: 30,
    difficulty: "medium",
    mode: "numbers",
  },
];
