import { post, getRaw } from "./client";
import {
  DriverPositionSchema,
  type DriverPosition,
} from "../schemas/driverPosition.schema";

export const driverTrackingApi = {
  updatePosition: (data: DriverPosition) =>
    post("/driverPositions/", data, DriverPositionSchema),

  getTotalDistance: (driverId: number, from: string, to: string) =>
    getRaw<number>(
      `/driverPositions/${driverId}/total?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`,
    ),
};
