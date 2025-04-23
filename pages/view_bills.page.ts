import { expect, type Locator, type Page } from "@playwright/test";

export class ViewBillsPage {
  readonly page: Page;
  readonly createButton: Locator;
  readonly itemList: Locator;
  readonly lastItem: Locator;

  constructor(page: Page) {
    this.page = page;
    this.itemList = page.locator("#app > div > div.bills");
    this.lastItem = this.itemList.locator("> div:nth-last-child(1)");
  }

  async goto() {
    await this.page.goto(`/bills`);
    await expect(
      this.page.getByRole("heading", { name: "Bills" }),
      "Check that the heading is now 'Bills'"
    ).toBeVisible();
  }

  async gotoCreateBill() {
    await this.goto();
    // Browse to Create page using Button
    await this.page.getByRole("link", { name: "Create Bill" }).click();
    // Check URL
    await this.page.waitForURL(`/bill/new`);

    await expect(
      this.page.getByText("New Bill"),
      "Check current page title to be New Bill"
    ).toBeVisible();
  }

  async deleteLastItem() {
    // Click on "..."
    await this.lastItem.locator("div.action").click();

    // Delete new entry
    const deleteElement = this.lastItem.getByText("Delete");
    await deleteElement.click();
  }
}
