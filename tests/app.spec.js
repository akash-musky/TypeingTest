import { test, expect } from "@playwright/test";

test("TypeOrbit preserves existing history and preferences and respects reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => {
    localStorage.setItem(
      "typingtest.preferences",
      JSON.stringify({
        theme: "light",
        duration: 60,
        sound: true,
        difficulty: "hard",
        mode: "words",
      }),
    );
    localStorage.setItem(
      "typingtest.results",
      JSON.stringify([
        {
          id: "existing-session",
          date: "2026-11-01T12:00:00Z",
          wpm: 83,
          accuracy: 99,
          errors: 4,
          correct: 415,
          duration: 60,
          configuredDuration: 60,
          difficulty: "hard",
          mode: "words",
          practice: null,
          samples: [
            { second: 0, wpm: 0 },
            { second: 60, wpm: 83 },
          ],
        },
      ]),
    );
  });
  await page.goto("/");
  await expect(page).toHaveTitle("TypeOrbit — Type Beyond Limits.");
  await expect(
    page.getByRole("link", { name: "TypeOrbit home" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Type Beyond Limits." }),
  ).toBeVisible();
  await expect(page.getByText("Built by Akash Kumar")).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect(
    page.getByRole("button", { name: "DURATION: 60s", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  expect(
    await page
      .locator(".orbit-moon")
      .evaluate((element) => getComputedStyle(element).animationName),
  ).toBe("none");
  await page.getByRole("link", { name: "Results", exact: true }).click();
  await expect(page.locator("tbody tr")).toHaveCount(1);
  await expect(page.locator(".table-speed")).toContainText("83");
  await page.getByRole("link", { name: "Settings", exact: true }).click();
  await expect(
    page.getByRole("switch", { name: "Typing sounds" }),
  ).toHaveAttribute("aria-checked", "true");
  await expect(page).toHaveTitle("TypeOrbit — Type Beyond Limits.");
});

test("timer, mistakes, correction, results, chart and history persistence", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.clock.install();
  await page.goto("/");
  await page
    .getByRole("button", { name: "DURATION: 15s", exact: true })
    .click();
  await page
    .getByRole("textbox", { name: "Type the displayed passage" })
    .click();
  await page.clock.fastForward(5_000);
  await expect(
    page.getByRole("timer", { name: "Seconds remaining" }),
  ).toContainText("15");
  const passage = await page.getByTestId("passage").innerText();
  await page.keyboard.down("x");
  await page.keyboard.up("x");
  await expect(page.locator(".char-incorrect")).toHaveCount(1);
  await page.keyboard.press("Backspace");
  await page.keyboard.type(passage.slice(0, 15));
  await expect(page.locator(".char-correct")).toHaveCount(15);
  await page.clock.fastForward(15_000);
  await expect(page.getByText("Test complete", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Try Again" })).toBeVisible();
  const result = await page.evaluate(
    () => JSON.parse(localStorage.getItem("typingtest.results"))[0],
  );
  expect(result.correct).toBe(15);
  expect(result.errors).toBe(1);
  expect(result.accuracy).toBe(93.8);
  expect(result.duration).toBe(15);
  expect(result.wpm).toBe(12);
  await expect(page.locator(".recharts-surface")).toBeVisible();
  await page.getByRole("link", { name: "Results", exact: true }).click();
  await expect(page.locator("tbody tr")).toHaveCount(1);
  await page.reload();
  await expect(page.locator("tbody tr")).toHaveCount(1);
  await page.screenshot({
    path: "test-results/results-desktop.png",
    fullPage: true,
    animations: "disabled",
  });
  expect(errors).toEqual([]);
});

test("all controls, shortcuts, navigation and settings work and persist", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "DIFFICULTY: Hard", exact: true })
    .click();
  await page
    .getByRole("button", { name: "TEXT MODE: Numbers", exact: true })
    .click();
  await expect(page.getByTestId("passage")).toHaveText(/^[\d ]+$/);
  await page
    .getByRole("button", { name: "DURATION: 60s", exact: true })
    .click();
  await page
    .getByRole("textbox", { name: "Type the displayed passage" })
    .click();
  await page.keyboard.type("12");
  await page.keyboard.press("Control+Enter");
  await expect(
    page.getByRole("textbox", { name: "Type the displayed passage" }),
  ).toHaveValue("");
  await expect(
    page.getByRole("timer", { name: "Seconds remaining" }),
  ).toContainText("60");
  await page.keyboard.type("12");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("button", { name: "Restart test", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("textbox", { name: "Type the displayed passage" }),
  ).toHaveValue("");
  await page.getByRole("link", { name: "Settings", exact: true }).click();
  await page.getByRole("button", { name: "Light", exact: true }).click();
  await page.getByRole("switch", { name: "Typing sounds" }).click();
  await page.getByRole("button", { name: "large typing text" }).click();
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect(
    page.getByRole("switch", { name: "Virtual keyboard" }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("switch", { name: "Typing sounds" }),
  ).toHaveAttribute("aria-checked", "true");
  await page.getByRole("link", { name: "Test", exact: true }).click();
  await expect(
    page.getByRole("region", { name: "Virtual keyboard", exact: true }),
  ).toHaveCount(0);
  await expect(page.locator(".typing-input-container")).toHaveClass(
    /font-large/,
  );
  await expect(
    page.getByRole("button", { name: "DIFFICULTY: Hard", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.screenshot({
    path: "test-results/light-desktop.png",
    fullPage: true,
    animations: "disabled",
  });
});

test("practice can complete early, exports history, and clears data only on confirmation", async ({
  page,
}) => {
  await page.clock.install();
  await page.goto("/#practice");
  await page
    .getByRole("button", { name: "Start practice", exact: true })
    .first()
    .click();
  await expect(page.locator(".drill-banner")).toContainText(
    "Find your home row",
  );
  await page
    .getByRole("textbox", { name: "Type the displayed passage" })
    .click();
  const passage = await page.getByTestId("passage").innerText();
  await page.keyboard.type(passage[0]);
  await page.clock.fastForward(10_000);
  await page.keyboard.type(passage.slice(1));
  await expect(page.getByText("Test complete", { exact: true })).toBeVisible();
  const result = await page.evaluate(
    () => JSON.parse(localStorage.getItem("typingtest.results"))[0],
  );
  expect(result.practice).toBe("Find your home row");
  expect(result.duration).toBeLessThan(30);
  expect(result.accuracy).toBe(100);
  await page.getByRole("button", { name: "View history" }).click();
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export", exact: true }).click();
  expect((await downloadPromise).suggestedFilename()).toBe(
    "typeorbit-results.json",
  );
  await page.getByRole("link", { name: "Settings", exact: true }).click();
  await page
    .getByRole("button", { name: "Clear history", exact: true })
    .click();
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  expect(
    await page.evaluate(
      () => JSON.parse(localStorage.getItem("typingtest.results")).length,
    ),
  ).toBe(1);
  await page
    .getByRole("button", { name: "Clear history", exact: true })
    .click();
  await page.getByRole("button", { name: "Delete", exact: true }).click();
  await page.getByRole("link", { name: "Results", exact: true }).click();
  await expect(
    page.getByText("A blank slate. So much potential."),
  ).toBeVisible();
});

test("desktop and mobile layouts fit, and touch typing accepts input", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.locator(".metrics-sidebar, .virtual-keyboard, .live-metric"),
  ).toHaveCount(0);
  await expect(page.getByRole("timer")).toHaveCount(1);
  await page.screenshot({
    path: "test-results/test-desktop.png",
    fullPage: true,
    animations: "disabled",
  });
  for (const width of [768, 390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page
    .getByRole("textbox", { name: "Type the displayed passage" })
    .click();
  const passage = await page.getByTestId("passage").innerText();
  await page
    .getByRole("textbox", { name: "Type the displayed passage" })
    .fill(passage.slice(0, 10));
  await expect(page.locator(".char-correct")).toHaveCount(10);
  await page.screenshot({
    path: "test-results/test-mobile.png",
    fullPage: true,
    animations: "disabled",
  });
  await page.getByRole("link", { name: "Practice", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Start practice" }),
  ).toHaveCount(4);
  await page.getByRole("link", { name: "Settings", exact: true }).click();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});

test("completed tests stop accepting input and can restart with a keyboard shortcut", async ({
  page,
}) => {
  await page.clock.install();
  await page.goto("/");
  await page
    .getByRole("button", { name: "DURATION: 15s", exact: true })
    .click();
  await page
    .getByRole("textbox", { name: "Type the displayed passage" })
    .click();
  await page.keyboard.type("test");
  await page.clock.fastForward(15_000);
  await expect(page.getByText("Test complete", { exact: true })).toBeVisible();
  const saved = await page.evaluate(() =>
    localStorage.getItem("typingtest.results"),
  );
  await page.keyboard.type("ignored after completion");
  expect(
    await page.evaluate(() => localStorage.getItem("typingtest.results")),
  ).toBe(saved);
  await page.keyboard.press("Control+Enter");
  await expect(
    page.getByRole("textbox", { name: "Type the displayed passage" }),
  ).toBeFocused();
  await expect(
    page.getByRole("textbox", { name: "Type the displayed passage" }),
  ).toHaveValue("");
  await expect(
    page.getByRole("timer", { name: "Seconds remaining" }),
  ).toContainText("15");
  await page.keyboard.type("x");
  await page.clock.fastForward(1_000);
  await expect(
    page.getByRole("timer", { name: "Seconds remaining" }),
  ).toContainText("14");
});

test("unavailable or malformed storage does not break the app", async ({
  page,
}) => {
  await page.addInitScript(() => {
    localStorage.setItem("typingtest.preferences", "{malformed");
    localStorage.setItem("typingtest.results", '[{"id":"invalid"}]');
    Storage.prototype.setItem = () => {
      throw new DOMException("Storage disabled", "QuotaExceededError");
    };
  });
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Type Beyond Limits." }),
  ).toBeVisible();
  await expect(page.locator(".storage-notice")).toContainText(
    "Browser storage is unavailable",
  );
  await page
    .getByRole("textbox", { name: "Type the displayed passage" })
    .click();
  await page.keyboard.type("hello");
  await expect(
    page.getByRole("textbox", { name: "Type the displayed passage" }),
  ).toHaveValue("hello");
});
