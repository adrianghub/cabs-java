import { useQuery, useMutation } from "@tanstack/react-query";
import { driverTrackingApi } from "../api/driverTracking.api";
import type { DriverPosition } from "../schemas/driverPosition.schema";

export function useDriverTotalDistance(
  driverId: number | null,
  from: string,
  to: string,
) {
  return useQuery({
    queryKey: ["driverPositions", driverId, "total", from, to],
    queryFn: () => driverTrackingApi.getTotalDistance(driverId!, from, to),
    enabled: driverId !== null && !!from && !!to,
  });
}

export function useUpdateDriverPosition() {
  return useMutation({
    mutationFn: (data: DriverPosition) =>
      driverTrackingApi.updatePosition(data),
  });
}
