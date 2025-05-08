import { expect, type Locator, type Page } from "@playwright/test";

export class DashboardPage {
  readonly page: Page;
  readonly logoutButton: Locator;

  readonly viewRoomsButton: Locator;
  readonly viewClientButton: Locator;
  readonly viewBillsButton: Locator;
  readonly viewReservationsButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.logoutButton = page.getByRole("button", { name: "Logout" });

    this.viewRoomsButton = page.locator(
      "#app > div > div > div:nth-child(1) > a"
    );
    this.viewClientButton = page.locator(
      "#app > div > div > div:nth-child(2) > a"
    );
    this.viewBillsButton = page.locator(
      "#app > div > div > div:nth-child(3) > a"
    );
    this.viewReservationsButton = page.locator(
      "#app > div > div > div:nth-child(4) > a"
    );
  }

  async goto() {
    await this.page.goto(`/`);
    await this.page.waitForURL(`/`);
  }

  async performLogout() {
    await this.logoutButton.click();
  }
}
