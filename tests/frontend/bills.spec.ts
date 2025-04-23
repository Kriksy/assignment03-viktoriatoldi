import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";

import { ViewBillsPage } from "../../pages/view_bills.page";
import { CreateBillsPage } from "../../pages/create_bills.page";
import { DashboardPage } from "../../pages/dashboard.page";

require("dotenv").config();

test.describe("Bills", () => {
  test("View Bills", async ({ page }) => {
    const viewBillsPage = new ViewBillsPage(page);
    await viewBillsPage.goto();
    await expect(page, "Check that the url is correct").toHaveURL(/.*\/bills/);

    await viewBillsPage.gotoCreateBill();
  });

  test("Create Bill", async ({ page }) => {
    const createBillsPage = new CreateBillsPage(page);

    // Browse to Create Bill page
    await createBillsPage.goto();

    // Create fake data
    const valueSEK = faker.number.int({ min: 0, max: 1000000000 }).toString();

    // Fill form with fake data
    await createBillsPage.formValue.fill(valueSEK);
    await createBillsPage.save();

    await expect(page, "Check that the url is correct").toHaveURL(/.*\/bills/);

    const viewBillsPage = new ViewBillsPage(page);
    await viewBillsPage.goto();
    // Get last item in the list
    const element = viewBillsPage.lastItem;

    // Check last item to contain the fake data
    await expect(element).toContainText(valueSEK);

    // Delete new entry
    await viewBillsPage.deleteLastItem();
  });

  test("Create Bill Error Message", async ({ page }) => {
    const createBillsPage = new CreateBillsPage(page);

    // Browse to Create Bill page
    await createBillsPage.goto();

    // Create fake data
    const valueSEK = "-1";

    // Fill form with fake data
    await createBillsPage.formValue.fill(valueSEK);
    await createBillsPage.save();

    // Check for error message
    await expect(
      page.getByText("Value must be greater than 0"),
      "Check error message"
    ).toBeVisible();
  });
});
