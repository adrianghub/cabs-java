import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { clientsApi } from "../api/clients.api";
import type { Client } from "../schemas/client.schema";

export function useClient(id: number | null) {
  return useQuery({
    queryKey: ["clients", id],
    queryFn: () => clientsApi.getById(id!),
    enabled: id !== null,
  });
}

export function useCreateClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Client) => clientsApi.create(data),
    onSuccess: (_data, _vars) => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
}

export function useUpgradeClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => clientsApi.upgrade(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["clients", id] });
    },
  });
}

export function useDowngradeClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => clientsApi.downgrade(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["clients", id] });
    },
  });
}

export function useChangePaymentType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Client }) =>
      clientsApi.changePaymentType(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["clients", id] });
    },
  });
}
