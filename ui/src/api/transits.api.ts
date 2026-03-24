import { get, post } from "./client";
import { TransitSchema, type Transit } from "../schemas/transit.schema";
import type { Address } from "../schemas/address.schema";

export const transitsApi = {
  getById: (id: number) => get(`/transits/${id}`, TransitSchema),

  create: (data: Transit) => post("/transits/", data, TransitSchema),

  changeAddressTo: (id: number, address: Address) =>
    post(`/transits/${id}/changeAddressTo`, address, TransitSchema),

  changeAddressFrom: (id: number, address: Address) =>
    post(`/transits/${id}/changeAddressFrom`, address, TransitSchema),

  cancel: (id: number) => post(`/transits/${id}/cancel`, undefined, TransitSchema),

  publish: (id: number) => post(`/transits/${id}/publish`, undefined, TransitSchema),

  findDrivers: (id: number) =>
    post(`/transits/${id}/findDrivers`, undefined, TransitSchema),

  accept: (id: number, driverId: number) =>
    post(`/transits/${id}/accept/${driverId}`, undefined, TransitSchema),

  start: (id: number, driverId: number) =>
    post(`/transits/${id}/start/${driverId}`, undefined, TransitSchema),

  reject: (id: number, driverId: number) =>
    post(`/transits/${id}/reject/${driverId}`, undefined, TransitSchema),

  complete: (id: number, driverId: number, destination: Address) =>
    post(`/transits/${id}/complete/${driverId}`, destination, TransitSchema),
};
