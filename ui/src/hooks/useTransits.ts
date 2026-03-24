import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { transitsApi } from "../api/transits.api";
import type { Transit } from "../schemas/transit.schema";
import type { Address } from "../schemas/address.schema";

export function useTransit(id: number | null) {
  return useQuery({
    queryKey: ["transits", id],
    queryFn: () => transitsApi.getById(id!),
    enabled: id !== null,
  });
}

export function useCreateTransit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Transit) => transitsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transits"] });
    },
  });
}

export function usePublishTransit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => transitsApi.publish(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["transits", id] });
    },
  });
}

export function useCancelTransit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => transitsApi.cancel(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["transits", id] });
    },
  });
}

export function useFindDrivers() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => transitsApi.findDrivers(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["transits", id] });
    },
  });
}

export function useAcceptTransit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, driverId }: { id: number; driverId: number }) =>
      transitsApi.accept(id, driverId),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["transits", id] });
    },
  });
}

export function useStartTransit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, driverId }: { id: number; driverId: number }) =>
      transitsApi.start(id, driverId),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["transits", id] });
    },
  });
}

export function useRejectTransit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, driverId }: { id: number; driverId: number }) =>
      transitsApi.reject(id, driverId),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["transits", id] });
    },
  });
}

export function useCompleteTransit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      driverId,
      destination,
    }: {
      id: number;
      driverId: number;
      destination: Address;
    }) => transitsApi.complete(id, driverId, destination),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["transits", id] });
    },
  });
}

export function useChangeAddressTo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, address }: { id: number; address: Address }) =>
      transitsApi.changeAddressTo(id, address),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["transits", id] });
    },
  });
}

export function useChangeAddressFrom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, address }: { id: number; address: Address }) =>
      transitsApi.changeAddressFrom(id, address),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["transits", id] });
    },
  });
}
