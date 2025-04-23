import { expect, type Locator, type Page } from "@playwright/test";

export class CreateBillsPage {
  readonly page: Page;
  readonly formValue: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.formValue = page
      .locator("div")
      .filter({ hasText: /^Value/ })
      .getByRole("spinbutton");
    this.saveButton = page.getByText("Save");
  }

  async goto() {
    await this.page.goto(`/bill/new`);

    await expect(
      this.page.getByText("New Bill"),
      "Check current page title to be New Bill"
    ).toBeVisible();
  }

  async save() {
    await this.saveButton.click();
  }
}
