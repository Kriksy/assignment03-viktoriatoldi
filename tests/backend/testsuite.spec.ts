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

test.describe("Clients", () => {
  test("Get Client by Id 1", async ({}) => {
    const response = await apiHelper.getClientById("1");
    expect(response).toBeOK();

    const jsonApiResponse = await response.json();

    expect(jsonApiResponse).toMatchObject(
      expect.objectContaining({
        id: 1,
        name: "Jonas Hellman",
        email: "jonas.hellman@example.com",
        created: expect.anything(),
        telephone: "070 000 0001",
      })
    );
  });

  test("Create Client", async ({}) => {
    const payload = {
      name: faker.person.fullName,
      email: faker.internet.email,
      telephone: faker.phone.number,
    };

    // Create Client
    const createClientResponse = await apiHelper.createClient(payload);
    expect(createClientResponse).toBeOK();

    const jsonApiResponse = await createClientResponse.json();

    expect(jsonApiResponse).toMatchObject(
      expect.objectContaining({
        id: expect.any(Number),
        created: expect.anything(),
      })
    );

    // Delete Client
    const deleteClientResponse = await apiHelper.deleteClientById(
      jsonApiResponse.id
    );
    expect(deleteClientResponse).toBeOK();
    expect(deleteClientResponse.status()).toBe(200);
  });

  test("Retrieve All Clients", async ({}) => {
    // Get all clients
    const response = await apiHelper.getAllClients();
    expect(response).toBeOK();

    const jsonApiResponse = await response.json();

    expect(jsonApiResponse).toBeTruthy();
  });
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

test.describe("Rooms", () => {
  test("Get Room by Id 1", async ({}) => {
    const response = await apiHelper.getRoomById("1");
    expect(response).toBeOK();

    const jsonApiResponse = await response.json();

    expect(jsonApiResponse).toMatchObject(
      expect.objectContaining({
        id: 1,
        available: true,
        category: "double",
        created: expect.anything(),
        floor: 1,
        number: expect.any(Number),
        price: expect.any(Number),
      })
    );
  });

  test("Create Room", async ({}) => {
    const payload = {
      floor: faker.number.int({ min: 1, max: 1000 }),
      number: faker.number.int({ min: 1, max: 1000 }),
      price: faker.number.int({ min: 1, max: 1000 }),
    };

    // Create Room
    const createResponse = await apiHelper.createRoom(payload);
    const jsonCreateApiResponse = await createResponse.json();
    expect(jsonCreateApiResponse).toMatchObject(
      expect.objectContaining({
        id: expect.any(Number),
        created: expect.anything(),
        floor: expect.any(Number),
        number: expect.any(Number),
        price: expect.any(Number),
      })
    );
    expect(createResponse.ok()).toBeTruthy();
    expect(createResponse.status()).toBe(200);

    // Delete Room
    const deleteResponse = await apiHelper.deleteRoomById(
      jsonCreateApiResponse.id
    );

    expect(deleteResponse).toBeOK();
    expect(deleteResponse.status()).toBe(200);
  });

  test("Retrieve All Rooms", async ({}) => {
    // Get all rooms
    const response = await apiHelper.getAllRooms();
    expect(response).toBeOK();

    const jsonApiResponse = await response.json();

    expect(jsonApiResponse).toBeTruthy();
  });

  test.describe("Reservations", () => {
    test("Get Reservation by Id 1", async ({}) => {
      const response = await apiHelper.getReservationById("1");
      expect(response).toBeOK();

      const jsonApiResponse = await response.json();

      expect(jsonApiResponse).toMatchObject(
        expect.objectContaining({
          id: 1,
          bill: 1,
          client: 1,
          room: 1,
          start: "2020-04-01",
          end: "2020-04-04",
          created: expect.any(String),
        })
      );
    });

    test("Retrieve All Reservations", async ({}) => {
      // Get all reservations
      const response = await apiHelper.getAllReservations();
      expect(response).toBeOK();

      const jsonApiResponse = await response.json();

      expect(jsonApiResponse).toBeTruthy();
    });
  });
});
