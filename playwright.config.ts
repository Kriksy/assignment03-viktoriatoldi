import { defineConfig, devices } from "@playwright/test";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, ".env") });

export const STORAGE_STATE = path.join(__dirname, "playwright/.auth/user.json");

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./tests",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [["html"], ["list"]],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.BASE_URL || "http://localhost:3000",
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "setup frontend",
      testMatch: /global.frontend.setup\.ts/,
    },
    {
      name: "setup backend",
      testMatch: /global.backend.setup\.ts/,
    },
    {
      name: "test frontend",
      use: {
        ...devices["Desktop Chrome"],
        // Use prepared auth state.
        storageState: STORAGE_STATE,
      },
      testMatch: /frontend\/.*\.spec\.ts/,
      dependencies: ["setup frontend"],
    },
    {
      name: "test backend",
      use: {
        ...devices["Desktop Chrome"],
        // Use prepared auth state.
        storageState: STORAGE_STATE,
      },
      testMatch: /backend\/.*\.spec\.ts/,
      dependencies: ["setup backend"],
    },
  ],
});
