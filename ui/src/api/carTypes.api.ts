import { get, post, postVoid } from "./client";
import { CarTypeSchema, type CarType } from "../schemas/carType.schema";
import type { CarClass } from "../schemas/enums";

export const carTypesApi = {
  getById: (id: number) => get(`/cartypes/${id}`, CarTypeSchema),

  create: (data: CarType) => post("/cartypes", data, CarTypeSchema),

  registerCar: (carClass: CarClass) =>
    postVoid(`/cartypes/${carClass}/registerCar`),

  unregisterCar: (carClass: CarClass) =>
    postVoid(`/cartypes/${carClass}/unregisterCar`),

  activate: (id: number) => postVoid(`/cartypes/${id}/activate`),

  deactivate: (id: number) => postVoid(`/cartypes/${id}/deactivate`),
};
