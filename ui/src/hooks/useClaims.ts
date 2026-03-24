import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { claimsApi } from "../api/claims.api";
import type { Claim } from "../schemas/claim.schema";

export function useClaim(id: number | null) {
  return useQuery({
    queryKey: ["claims", id],
    queryFn: () => claimsApi.getById(id!),
    enabled: id !== null,
  });
}

export function useCreateClaimDraft() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Claim) => claimsApi.createDraft(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["claims"] });
    },
  });
}

export function useSendClaim() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Claim) => claimsApi.send(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["claims"] });
    },
  });
}

export function useMarkClaimInProcess() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => claimsApi.markInProcess(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["claims", id] });
    },
  });
}

export function useTryToResolveClaim() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => claimsApi.tryToResolve(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["claims", id] });
    },
  });
}
