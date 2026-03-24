import { get, post, del } from "./client";
import { z } from "zod";
import {
  DriverSessionSchema,
  type DriverSession,
} from "../schemas/driverSession.schema";

export const driverSessionsApi = {
  list: (driverId: number) =>
    get(
      `/drivers/${driverId}/driverSessions/`,
      z.array(DriverSessionSchema),
    ),

  login: (driverId: number, data: DriverSession) =>
    post(`/drivers/${driverId}/driverSessions/login`, data, z.any()),

  logout: (driverId: number, sessionId: number) =>
    del(`/drivers/${driverId}/driverSessions/${sessionId}`),

  logoutAll: (driverId: number) =>
    del(`/drivers/${driverId}/driverSessions/`),
};
