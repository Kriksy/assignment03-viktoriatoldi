import { APIRequestContext, request } from "@playwright/test";

export class APIHelper {
  private baseUrl: string;
  private request: APIRequestContext;

  constructor(baseUrl: string, request: APIRequestContext) {
    this.baseUrl = baseUrl;
    this.request = request;
  }

  // ### BILL ###

  // Create a new bill
  async createBill(payload: object) {
    const response = await this.request.post(`/api/bill/new`, {
      data: JSON.stringify(payload),
    });
    return response;
  }

  // Delete a bill by id
  async deleteBillById(id: string) {
    const response = await this.request.delete(`/api/bill/${id}`);
    return response;
  }

  // Retrieve all bills
  async getAllBills() {
    const response = await this.request.get(`/api/bills`);
    return response;
  }

  // Get bill by id
  async getBillById(id: string) {
    const response = await this.request.get(`/api/bill/${id}`);
    return response;
  }
}
