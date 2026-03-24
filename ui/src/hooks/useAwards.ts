import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { awardsApi } from "../api/awards.api";

export function useAwardsAccount(clientId: number | null) {
  return useQuery({
    queryKey: ["clients", clientId, "awards"],
    queryFn: () => awardsApi.getAccount(clientId!),
    enabled: clientId !== null,
  });
}

export function useAwardsBalance(clientId: number | null) {
  return useQuery({
    queryKey: ["clients", clientId, "awards", "balance"],
    queryFn: () => awardsApi.getBalance(clientId!),
    enabled: clientId !== null,
  });
}

export function useCreateAwardsAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (clientId: number) => awardsApi.create(clientId),
    onSuccess: (_, clientId) => {
      queryClient.invalidateQueries({
        queryKey: ["clients", clientId, "awards"],
      });
    },
  });
}

export function useActivateAwards() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (clientId: number) => awardsApi.activate(clientId),
    onSuccess: (_, clientId) => {
      queryClient.invalidateQueries({
        queryKey: ["clients", clientId, "awards"],
      });
    },
  });
}

export function useDeactivateAwards() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (clientId: number) => awardsApi.deactivate(clientId),
    onSuccess: (_, clientId) => {
      queryClient.invalidateQueries({
        queryKey: ["clients", clientId, "awards"],
      });
    },
  });
}

export function useTransferAwards() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      clientId,
      toClientId,
      howMuch,
    }: {
      clientId: number;
      toClientId: number;
      howMuch: number;
    }) => awardsApi.transfer(clientId, toClientId, howMuch),
    onSuccess: (_, { clientId }) => {
      queryClient.invalidateQueries({
        queryKey: ["clients", clientId, "awards"],
      });
    },
  });
}
