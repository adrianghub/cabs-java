import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { driverSessionsApi } from "../api/driverSessions.api";
import type { DriverSession } from "../schemas/driverSession.schema";

export function useDriverSessions(driverId: number | null) {
  return useQuery({
    queryKey: ["drivers", driverId, "sessions"],
    queryFn: () => driverSessionsApi.list(driverId!),
    enabled: driverId !== null,
  });
}

export function useDriverLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      driverId,
      data,
    }: {
      driverId: number;
      data: DriverSession;
    }) => driverSessionsApi.login(driverId, data),
    onSuccess: (_, { driverId }) => {
      queryClient.invalidateQueries({
        queryKey: ["drivers", driverId, "sessions"],
      });
    },
  });
}

export function useDriverLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      driverId,
      sessionId,
    }: {
      driverId: number;
      sessionId: number;
    }) => driverSessionsApi.logout(driverId, sessionId),
    onSuccess: (_, { driverId }) => {
      queryClient.invalidateQueries({
        queryKey: ["drivers", driverId, "sessions"],
      });
    },
  });
}

export function useDriverLogoutAll() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (driverId: number) => driverSessionsApi.logoutAll(driverId),
    onSuccess: (_, driverId) => {
      queryClient.invalidateQueries({
        queryKey: ["drivers", driverId, "sessions"],
      });
    },
  });
}
