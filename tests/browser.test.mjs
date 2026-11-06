import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import { chromium } from "playwright";
import { fileURLToPath } from "node:url";
import { serve } from "../../it-helpdesk-demo/scripts/serve.mjs";
let browser, help, course, helpURL, courseURL;
before(async () => {
  browser = await chromium.launch({
    headless: true,
    executablePath: process.env.BROWSER_EXECUTABLE || undefined,
    args: process.env.BROWSER_EXECUTABLE
      ? ["--no-sandbox", "--disable-dev-shm-usage"]
      : [],
  });
  help = await serve(
    fileURLToPath(new URL("../../it-helpdesk-demo/", import.meta.url)),
    0,
  );
  course = await serve(
    fileURLToPath(new URL("../../course-management-demo/", import.meta.url)),
    0,
  );
  helpURL = `http://127.0.0.1:${help.address().port}`;
  courseURL = `http://127.0.0.1:${course.address().port}`;
});
after(async () => {
  await browser?.close();
  for (const server of [help, course])
    if (server) await new Promise((r) => server.close(r));
});
async function pageFor(t, url, viewport) {
  const context = await browser.newContext({
    viewport: viewport || { width: 1440, height: 1000 },
  });
  t.after(() => context.close());
  const page = await context.newPage();
  await page.goto(url);
  return page;
}
test("HD-01: a new ticket persists after reload", async (t) => {
  const p = await pageFor(t, helpURL);
  await p.getByRole("button", { name: "New ticket", exact: true }).click();
  await p
    .getByLabel("Summary", { exact: true })
    .fill("Projector colours look incorrect");
  await p.getByLabel("Requester", { exact: true }).fill("Demo requester");
  await p
    .getByLabel("Description", { exact: true })
    .fill("The blue channel is missing on the classroom display.");
  await p.getByRole("button", { name: "Create ticket", exact: true }).click();
  assert.equal(await p.locator("#active-count").textContent(), "4");
  await p.reload();
  assert.equal(
    await p
      .getByRole("button")
      .filter({ hasText: "Projector colours look incorrect" })
      .count(),
    1,
  );
});
test("HD-02: an empty queue result has a useful recovery message", async (t) => {
  const p = await pageFor(t, helpURL);
  await p.getByLabel("Search requests").fill("no-such-request");
  assert.match(
    await p.locator("#ticket-list").textContent(),
    /No requests match/,
  );
  assert.match(await p.locator("#details").textContent(), /Select a request/);
});
test("HD-03: short resolution notes are blocked", async (t) => {
  const p = await pageFor(t, helpURL);
  await p.locator("#update-form select[name=status]").selectOption("Resolved");
  await p.getByLabel("Work note").fill("Done");
  await p.getByRole("button", { name: "Save update" }).click();
  assert.match(await p.locator("#update-error").textContent(), /at least 10/);
  assert.equal(await p.locator("#resolved-count").textContent(), "1");
});
test("HD-04: resolution updates counts and history", async (t) => {
  const p = await pageFor(t, helpURL);
  await p.locator("#update-form select[name=status]").selectOption("Resolved");
  await p
    .getByLabel("Work note")
    .fill("Replaced HDMI cable and checked after wake from sleep.");
  await p.getByRole("button", { name: "Save update" }).click();
  assert.equal(await p.locator("#resolved-count").textContent(), "2");
  assert.match(await p.locator(".activity").textContent(), /Replaced HDMI/);
});
test("HD-05: user content is displayed as text, not markup", async (t) => {
  const p = await pageFor(t, helpURL);
  await p.getByRole("button", { name: "New ticket", exact: true }).click();
  await p
    .getByLabel("Summary", { exact: true })
    .fill('<img src=x onerror="window.injected=true">');
  await p.getByLabel("Requester", { exact: true }).fill("Demo requester");
  await p
    .getByLabel("Description", { exact: true })
    .fill("A fictional input handling test.");
  await p.getByRole("button", { name: "Create ticket", exact: true }).click();
  assert.equal(await p.locator("#ticket-list img").count(), 0);
  assert.equal(await p.evaluate(() => window.injected), undefined);
});
test("HD-06: reset can be cancelled without losing data", async (t) => {
  const p = await pageFor(t, helpURL);
  await p.getByRole("button", { name: "Reset sample data" }).click();
  await p.getByRole("button", { name: "Keep my changes" }).click();
  assert.equal(await p.locator("#active-count").textContent(), "3");
  assert.equal(await p.locator("#reset-dialog").isVisible(), false);
});
test("CM-01: saving a draft preserves the published report", async (t) => {
  const p = await pageFor(t, courseURL);
  const old = await p.locator("#report-average").textContent();
  await p.getByLabel("Vocabulary", { exact: true }).fill("100");
  await p.getByRole("button", { name: "Save assessment", exact: true }).click();
  assert.equal(await p.locator("#report-average").textContent(), old);
  await p.reload();
  assert.equal(
    await p.getByLabel("Vocabulary", { exact: true }).inputValue(),
    "100",
  );
  assert.equal(await p.locator("#report-average").textContent(), old);
});
test("CM-02: publishing exposes only the saved version", async (t) => {
  const p = await pageFor(t, courseURL);
  await p.getByLabel("Vocabulary", { exact: true }).fill("100");
  assert.equal(
    await p
      .getByRole("button", { name: "Publish saved assessment" })
      .isDisabled(),
    true,
  );
  await p.getByRole("button", { name: "Save assessment", exact: true }).click();
  await p.getByRole("button", { name: "Publish saved assessment" }).click();
  assert.equal(await p.locator("#report-average").textContent(), "75.8");
});
test("CM-03: out-of-range scores cannot be saved", async (t) => {
  const p = await pageFor(t, courseURL);
  await p.getByLabel("Writing", { exact: true }).fill("101");
  await p.getByRole("button", { name: "Save assessment", exact: true }).click();
  assert.equal(
    await p
      .getByLabel("Writing", { exact: true })
      .evaluate((el) => el.validity.rangeOverflow),
    true,
  );
  await p.reload();
  assert.equal(
    await p.getByLabel("Writing", { exact: true }).inputValue(),
    "73",
  );
});
test("CM-04: another period starts with no published report", async (t) => {
  const p = await pageFor(t, courseURL);
  await p.getByLabel("Reporting period").selectOption("Term 2");
  assert.match(await p.locator("#report").textContent(), /No report published/);
  assert.equal(
    await p.getByRole("button", { name: "Print / Save PDF" }).isDisabled(),
    true,
  );
});
test("CM-05: unsaved edits require a decision before navigation", async (t) => {
  const p = await pageFor(t, courseURL);
  await p.getByLabel("Vocabulary", { exact: true }).fill("99");
  await p.getByRole("button").filter({ hasText: "Jamie Noor" }).click();
  assert.equal(
    await p
      .getByRole("dialog", { name: "Leave unsaved assessment?" })
      .isVisible(),
    true,
  );
  await p.getByRole("button", { name: "Keep editing" }).click();
  assert.equal(
    await p.getByLabel("Vocabulary", { exact: true }).inputValue(),
    "99",
  );
  assert.match(await p.locator("#assessment-title").textContent(), /Avery Tan/);
});
test("CM-06: publishing needs an actionable learning note", async (t) => {
  const p = await pageFor(t, courseURL);
  await p.getByLabel("Learning note", { exact: true }).fill("Good");
  await p.getByRole("button", { name: "Save assessment", exact: true }).click();
  await p.getByRole("button", { name: "Publish saved assessment" }).click();
  assert.match(
    await p.locator("#assessment-error").textContent(),
    /at least 10/,
  );
});
for (const [name, getURL] of [
  ["Helpdesk", () => helpURL],
  ["Coursebook", () => courseURL],
]) {
  test(`${name}: mobile viewport has no horizontal page overflow`, async (t) => {
    const p = await pageFor(t, getURL(), { width: 390, height: 844 });
    assert.equal(
      await p.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      true,
    );
  });
  test(`${name}: malformed storage recovers visibly`, async (t) => {
    const p = await pageFor(t, getURL());
    await p.evaluate(({ key }) => localStorage.setItem(key, "{broken"), {
      key: name === "Helpdesk" ? "only-helpdesk-v1" : "only-coursebook-v1",
    });
    await p.reload();
    assert.match(
      await p.locator("#feedback").textContent(),
      /could not be read/,
    );
  });
}
