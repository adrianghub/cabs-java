import { get, post } from "./client";
import { DriverSchema, type Driver } from "../schemas/driver.schema";

export const driversApi = {
  getById: (id: number) => get(`/drivers/${id}`, DriverSchema),

  create: (params: {
    license: string;
    firstName: string;
    lastName: string;
    photo: string;
  }) => {
    const query = new URLSearchParams(params).toString();
    return post(`/drivers?${query}`, undefined, DriverSchema);
  },

  activate: (id: number) => post(`/drivers/${id}/activate`, undefined, DriverSchema),

  deactivate: (id: number) =>
    post(`/drivers/${id}/deactivate`, undefined, DriverSchema),
};

export type { Driver };
