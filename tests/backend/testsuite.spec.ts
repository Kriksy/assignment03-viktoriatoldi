import { test, expect, request, APIRequestContext } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { APIHelper } from "./apiHelpers";
import path from "path";
import { promises as fs } from "fs";

const authFile = path.join(
  __dirname,
  "../../playwright/.auth/backend_user.json"
);

// Request context is reused by all tests in the file.
let apiContext: APIRequestContext;
let apiHelper: APIHelper;

// Run before all tests in file
test.beforeAll("Setup x-user-auth", async ({ playwright, request }) => {
  const jsonString = await fs.readFile(authFile, "utf8");
  const { username, token } = JSON.parse(jsonString);

  apiContext = await playwright.request.newContext({
    //baseURL: `${process.env.BASE_URL}`,
    extraHTTPHeaders: {
      // Add authorization token to all requests.
      "x-user-auth": JSON.stringify({ username, token }),
    },
  });
  apiHelper = new APIHelper("/", apiContext);
});

// Run after all tests in file
test.afterAll(async ({}) => {
  // Dispose all responses.
  await apiContext.dispose();
});

test.describe("Bills", () => {
  test("Get Bill by Id 1", async ({}) => {
    const response = await apiHelper.getBillById("1");
    expect(response).toBeOK();

    const jsonApiResponse = await response.json();

    expect(jsonApiResponse).toMatchObject(
      expect.objectContaining({
        id: 1,
        value: expect.any(Number),
        created: expect.anything(),
      })
    );
  });

  test("Create Bill", async ({}) => {
    const payload = {
      value: faker.number.int({ min: 0, max: 1000 }),
    };

    // Create Bill
    const createResponse = await apiHelper.createBill(payload);
    const jsonCreateApiResponse = await createResponse.json();
    expect(jsonCreateApiResponse).toMatchObject(
      expect.objectContaining({
        id: expect.any(Number),
        created: expect.anything(),
        value: expect.any(Number),
      })
    );
    expect(createResponse.ok()).toBeTruthy();
    expect(createResponse.status()).toBe(200);

    // Delete Bill
    const deleteResponse = await apiHelper.deleteBillById(
      jsonCreateApiResponse.id
    );

    expect(deleteResponse).toBeOK();
    expect(deleteResponse.status()).toBe(200);
  });

  test("Retrieve All Bills", async ({}) => {
    // Get all bills
    const response = await apiHelper.getAllBills();
    expect(response).toBeOK();

    const jsonApiResponse = await response.json();

    expect(jsonApiResponse).toBeTruthy();
  });
});
