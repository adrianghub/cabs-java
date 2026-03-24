import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { carTypesApi } from "../api/carTypes.api";
import type { CarType } from "../schemas/carType.schema";
import type { CarClass } from "../schemas/enums";

export function useCarType(id: number | null) {
  return useQuery({
    queryKey: ["carTypes", id],
    queryFn: () => carTypesApi.getById(id!),
    enabled: id !== null,
  });
}

export function useCreateCarType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CarType) => carTypesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["carTypes"] });
    },
  });
}

export function useRegisterCar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (carClass: CarClass) => carTypesApi.registerCar(carClass),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["carTypes"] });
    },
  });
}

export function useUnregisterCar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (carClass: CarClass) => carTypesApi.unregisterCar(carClass),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["carTypes"] });
    },
  });
}

export function useActivateCarType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => carTypesApi.activate(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["carTypes", id] });
    },
  });
}

export function useDeactivateCarType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => carTypesApi.deactivate(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["carTypes", id] });
    },
  });
}
