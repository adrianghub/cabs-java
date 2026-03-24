import { useQuery } from "@tanstack/react-query";
import { driverReportApi } from "../api/driverReport.api";

export function useDriverReport(
  driverId: number | null,
  lastDays: number = 30,
) {
  return useQuery({
    queryKey: ["drivers", driverId, "report", lastDays],
    queryFn: () => driverReportApi.getReport(driverId!, lastDays),
    enabled: driverId !== null,
  });
}
