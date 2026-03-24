import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { driversApi } from "../api/drivers.api";

export function useDriver(id: number | null) {
  return useQuery({
    queryKey: ["drivers", id],
    queryFn: () => driversApi.getById(id!),
    enabled: id !== null,
  });
}

export function useCreateDriver() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: {
      license: string;
      firstName: string;
      lastName: string;
      photo: string;
    }) => driversApi.create(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
    },
  });
}

export function useActivateDriver() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => driversApi.activate(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["drivers", id] });
    },
  });
}

export function useDeactivateDriver() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => driversApi.deactivate(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["drivers", id] });
    },
  });
}
