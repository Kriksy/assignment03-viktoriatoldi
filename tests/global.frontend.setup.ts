import { test as setup, expect } from "@playwright/test";

import { STORAGE_STATE } from "../playwright.config";

import { LoginPage } from "../pages/login.page";

//  Global setup
//  https://playwright.dev/docs/auth#basic-shared-account-in-all-tests
setup("Authenticate", async ({ page }) => {
  // Perform authentication steps.
  const loginPage = new LoginPage(page);

  // Perform Login
  await loginPage.goto();
  await loginPage.performLogin(
    `${process.env.TEST_USERNAME}`,
    `${process.env.TEST_PASSWORD}`
  );

  await expect(
    page.getByRole("heading", { name: "Tester Hotel Overview" }),
    "Check that the heading is now Tester Hotel Overview"
  ).toBeVisible();

  // End of authentication steps.

  await page.context().storageState({ path: STORAGE_STATE });
});
