import { get, post } from "./client";
import { ClientSchema, type Client } from "../schemas/client.schema";

export const clientsApi = {
  getById: (id: number) => get(`/clients/${id}`, ClientSchema),

  create: (data: Client) => post("/clients", data, ClientSchema),

  upgrade: (id: number) => post(`/clients/${id}/upgrade`, undefined, ClientSchema),

  downgrade: (id: number) => post(`/clients/${id}/downgrade`, undefined, ClientSchema),

  changePaymentType: (id: number, data: Client) =>
    post(`/clients/${id}/changeDefaultPaymentType`, data, ClientSchema),
};
