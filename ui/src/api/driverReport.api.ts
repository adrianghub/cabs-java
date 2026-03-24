import { get } from "./client";
import { DriverReportSchema } from "../schemas/driverReport.schema";

export const driverReportApi = {
  getReport: (driverId: number, lastDays: number) =>
    get(
      `/driverreport/${driverId}?lastDays=${lastDays}`,
      DriverReportSchema,
    ),
};
