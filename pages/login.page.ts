import { expect, type Locator, type Page } from "@playwright/test";

export class LoginPage {
  readonly page: Page;
  readonly usernameTextfield: Locator;
  readonly passwordTextfield: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameTextfield = page.locator('input[type="text"]');
    this.passwordTextfield = page.locator('input[type="password"]');
    this.loginButton = page.getByRole("button", { name: "Login" });
  }

  async goto() {
    await this.page.goto(`/login`);
  }

  async performLogin(username: string, password: string) {
    // Fill out the forms - 2 textfields
    await this.usernameTextfield.fill(username);
    await this.passwordTextfield.fill(password);
    // Click the submit button
    await this.loginButton.click();

    await this.page.waitForURL(`/`);
  }
}
