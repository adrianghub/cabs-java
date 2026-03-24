import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { contractsApi } from "../api/contracts.api";
import type { Contract, ContractAttachment } from "../schemas/contract.schema";

export function useContract(id: number | null) {
  return useQuery({
    queryKey: ["contracts", id],
    queryFn: () => contractsApi.getById(id!),
    enabled: id !== null,
  });
}

export function useCreateContract() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Contract) => contractsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
    },
  });
}

export function useAcceptContract() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => contractsApi.accept(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["contracts", id] });
    },
  });
}

export function useRejectContract() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => contractsApi.reject(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["contracts", id] });
    },
  });
}

export function useProposeAttachment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      contractId,
      data,
    }: {
      contractId: number;
      data: ContractAttachment;
    }) => contractsApi.proposeAttachment(contractId, data),
    onSuccess: (_, { contractId }) => {
      queryClient.invalidateQueries({
        queryKey: ["contracts", contractId],
      });
    },
  });
}

export function useAcceptAttachment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      contractId,
      attachmentId,
    }: {
      contractId: number;
      attachmentId: number;
    }) => contractsApi.acceptAttachment(contractId, attachmentId),
    onSuccess: (_, { contractId }) => {
      queryClient.invalidateQueries({
        queryKey: ["contracts", contractId],
      });
    },
  });
}

export function useRejectAttachment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      contractId,
      attachmentId,
    }: {
      contractId: number;
      attachmentId: number;
    }) => contractsApi.rejectAttachment(contractId, attachmentId),
    onSuccess: (_, { contractId }) => {
      queryClient.invalidateQueries({
        queryKey: ["contracts", contractId],
      });
    },
  });
}

export function useRemoveAttachment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      contractId,
      attachmentId,
    }: {
      contractId: number;
      attachmentId: number;
    }) => contractsApi.removeAttachment(contractId, attachmentId),
    onSuccess: (_, { contractId }) => {
      queryClient.invalidateQueries({
        queryKey: ["contracts", contractId],
      });
    },
  });
}
