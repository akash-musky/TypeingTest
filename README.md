# TypingTest

A complete, browser-local typing application built with React, Vite, JavaScript, Tailwind CSS, Lucide React, and Recharts. No account, server, API key, external fonts, or paid service is required.

## Run locally

From this project directory:

```sh
npm run dev
```

Open the local URL printed by Vite, normally **http://localhost:5173**. If that port is occupied, Vite prints the next available port.

Dependencies are already installed. On a fresh checkout, install the locked dependencies first:

```sh
npm ci
```

Use a Node.js version supported by Vite 8: Node 20.19+, 22.12+, or a newer supported release. This project was built and tested with Node 26.

## Features

- 15, 30, 60, and 120 second tests with three difficulties and four text modes.
- Random words, sentences, number sequences, and punctuation passages.
- A borderless, Monkeytype-inspired typing screen with a single left-aligned countdown, three lines of text, character feedback, and a scrolling caret. Speed, accuracy, and errors appear after completion.
- Early completion when the passage ends; input locks when a session is complete.
- Optional synthesized sounds, navy/violet and light themes, adjustable text size, and reduced-motion support. No virtual keyboard or statistics sidebar.
- Results with a WPM-over-time chart, personal best, history filters, individual session review, and JSON export.
- Four focused practice drills, including a short home-row passage.
- Responsive layouts, labeled controls, keyboard navigation, a skip link, and touch-compatible textarea input.
- Local preferences and the latest 100 results, with graceful handling of unavailable browser storage.

## How scoring works

- **WPM:** `(currently correct characters / 5) / elapsed minutes`, rounded to a whole number. Spaces and punctuation count as characters. Speed samples stay at zero during the first second to avoid a misleading startup spike.
- **Accuracy:** correct insertion attempts divided by all insertion attempts. A mistaken character remains an error even after backspace; typing the correct replacement adds a new correct attempt.
- **Errors:** cumulative incorrect character attempts. Backspace is not itself an error.
- **Correct characters:** correct characters currently retained in the typed passage. Deleting a correct character removes it from this count and from WPM.
- **Timer:** uses monotonic `performance.now()` timestamps, not a decrementing interval counter. Delayed or backgrounded tabs still finish at the configured deadline, and input arriving after the deadline is rejected.
- **Early finish:** uses the actual typing time instead of the configured limit.
- **Chart:** records observed speed approximately once per second and at completion. If a browser suspends background execution, missing historical samples are not invented.
- **Personal best:** highest speed among the latest 100 completed regular tests, across difficulties, modes, and durations. Practice is excluded.

Click the text and type to begin. On desktop the input is focused automatically; merely focusing it does not start the timer. Test controls lock during a running test. Leaving the Test page discards an unfinished session. Paste and drop are blocked so tests reflect typed input.

## Keyboard shortcuts

| Action                        | Shortcut                     |
| ----------------------------- | ---------------------------- |
| Restart the test              | `Ctrl + Enter` / `⌘ + Enter` |
| Restart from the typing field | `Tab` then `Enter`           |
| Reset the test                | `Escape`                     |
| Correct the last character    | `Backspace`                  |

Control/Command + Enter and Escape work during a test and on its completion screen. Tab then Enter uses the restart button immediately after the typing field in the tab order.

## Folder structure

```text
public/
  favicon.svg                  App icon
src/
  main.jsx                     React entry and error boundary
  App.jsx                      Navigation, preferences, results, and session coordination
  styles.css                   Tailwind import, themes, responsive design, and animations
  workspace.css                Minimal theme, compact controls, and borderless typing layout
  components/
    Navigation.jsx             Responsive navigation and footer
    TestControls.jsx           Duration, difficulty, and mode selectors
    TypingArea.jsx             Input, countdown, caret, sound, and restart controls
    Results.jsx                Results, chart, history, filters, and export
    Practice.jsx               Focused practice drills
    Settings.jsx               Preferences and local data management
  data/
    passages.js                Vocabulary, sentence pools, passage generator, and drills
  hooks/
    useTypingTest.js           React session lifecycle and monotonic clock
    useSound.js                Optional Web Audio key sounds
  lib/
    engine.js                  Pure, independently tested typing and scoring logic
    storage.js                 Validated localStorage reads and safe writes
tests/
  engine.test.js               Deterministic scoring and timing tests
  app.spec.js                  Browser, navigation, persistence, and responsive tests
index.html                     HTML entry and metadata
vite.config.js                 React and official Tailwind Vite plugins
playwright.config.js           Browser-test configuration
package.json                   Dependencies and commands
package-lock.json              Reproducible dependency versions
dist/                          Generated production build (ignored by Git)
```

Tailwind uses the [official Vite integration](https://tailwindcss.com/docs/installation/using-vite): `@tailwindcss/vite` in `vite.config.js` and `@import "tailwindcss"` in the stylesheet.

## Verification and production build

```sh
npm test              # Node's built-in test runner: typing and scoring logic
npm run test:e2e     # Playwright: installed Google Chrome, Vite starts automatically
npm run build        # Optimized production files in dist/
npm run preview      # Serve the production build locally
```

Browser tests use the installed Google Chrome through Playwright's `chrome` channel. If Chrome is unavailable, install it or switch the configuration to a Playwright browser available on your machine. Screenshots and failure traces are saved in the ignored `test-results/` directory.

Deploy `dist/` to any static host. Hash-based navigation needs no server route rewrites. Local storage is scoped to the browser and site origin; export results from the Results page before clearing browser data.

# TypeingTest
