import { get, post, postVoid, del } from "./client";
import {
  ContractSchema,
  ContractAttachmentSchema,
  type Contract,
  type ContractAttachment,
} from "../schemas/contract.schema";

export const contractsApi = {
  getById: (id: number) => get(`/contracts/${id}`, ContractSchema),

  create: (data: Contract) => post("/contracts/", data, ContractSchema),

  accept: (id: number) => postVoid(`/contracts/${id}/accept`),

  reject: (id: number) => postVoid(`/contracts/${id}/reject`),

  proposeAttachment: (contractId: number, data: ContractAttachment) =>
    post(
      `/contracts/${contractId}/attachment`,
      data,
      ContractAttachmentSchema,
    ),

  acceptAttachment: (contractId: number, attachmentId: number) =>
    postVoid(
      `/contracts/${contractId}/attachment/${attachmentId}/accept`,
    ),

  rejectAttachment: (contractId: number, attachmentId: number) =>
    postVoid(
      `/contracts/${contractId}/attachment/${attachmentId}/reject`,
    ),

  removeAttachment: (contractId: number, attachmentId: number) =>
    del(`/contracts/${contractId}/attachment/${attachmentId}`),
};
