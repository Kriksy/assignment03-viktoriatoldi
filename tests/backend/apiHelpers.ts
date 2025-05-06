import { APIRequestContext, request } from "@playwright/test";

export class APIHelper {
  private baseUrl: string;
  private request: APIRequestContext;

  constructor(baseUrl: string, request: APIRequestContext) {
    this.baseUrl = baseUrl;
    this.request = request;
  }
  // ### CLIENT ###

  // Create a new client
  async createClient(payload: object) {
    const response = await this.request.post(`/api/client/new`, {
      data: JSON.stringify(payload),
    });
    return response;
  }

  // Get client by id
  async getClientById(id: string) {
    const response = await this.request.get(`/api/client/${id}`);
    return response;
  }

  // Retrieve all clients
  async getAllClients() {
    const response = await this.request.get(`/api/clients`);
    return response;
  }

  // Delete a client by id
  async deleteClientById(id: string) {
    const response = await this.request.delete(`/api/client/${id}`);
    return response;
  }

  // Update a client by id
  async updateClientById(id: string) {
    const response = await this.request.put(`/api/client/${id}`);
    return response;
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

  // ### ROOM ###

  // Create a new room
  async createRoom(payload: object) {
    const response = await this.request.post(`/api/room/new`, {
      data: JSON.stringify(payload),
    });
    return response;
  }

  // Delete a room by id
  async deleteRoomById(id: string) {
    const response = await this.request.delete(`/api/room/${id}`);
    return response;
  }

  // Retrieve all rooms
  async getAllRooms() {
    const response = await this.request.get(`/api/rooms`);
    return response;
  }

  // Get room by id
  async getRoomById(id: string) {
    const response = await this.request.get(`/api/room/${id}`);
    return response;
  }

  // ### RESERVATION ###
  // Retrieve all reservations
  async getAllReservations() {
    const response = await this.request.get(`/api/reservations`);
    return response;
  }

  // Get reservation by id
  async getReservationById(id: string) {
    const response = await this.request.get(`/api/reservation/${id}`);
    return response;
  }
}
