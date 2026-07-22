// Dev/CI only. Chromium smoke tests against the local static server.
import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "tools",
  testMatch: /smoke\.spec\.mjs/,
  timeout: 30000,
  fullyParallel: true,
  reporter: [["list"]],
  use: { headless: true },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
