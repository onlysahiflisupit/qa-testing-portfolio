import { chromium } from "playwright";
import { fileURLToPath } from "node:url";
import { mkdir } from "node:fs/promises";
import { serve } from "../../it-helpdesk-demo/scripts/serve.mjs";
const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.BROWSER_EXECUTABLE || undefined,
  args: process.env.BROWSER_EXECUTABLE
    ? ["--no-sandbox", "--disable-dev-shm-usage"]
    : [],
});
try {
  for (const repo of ["it-helpdesk-demo", "course-management-demo"]) {
    const root = fileURLToPath(new URL(`../../${repo}/`, import.meta.url));
    await mkdir(root + "docs", { recursive: true });
    const server = await serve(root, 0);
    try {
      for (const [name, viewport] of [
        ["desktop", { width: 1440, height: 1050 }],
        ["mobile", { width: 390, height: 844 }],
      ]) {
        const p = await browser.newPage({ viewport });
        await p.goto(`http://127.0.0.1:${server.address().port}`);
        await p.screenshot({ path: root + `docs/${name}.png`, fullPage: true });
        await p.close();
      }
    } finally {
      await new Promise((r) => server.close(r));
    }
  }
} finally {
  await browser.close();
}
