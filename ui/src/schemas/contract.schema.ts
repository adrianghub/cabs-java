import { z } from "zod";
import { ContractStatus, ContractAttachmentStatus } from "./enums";

export const ContractAttachmentSchema = z.object({
  id: z.number().nullable().optional(),
  contractId: z.number().nullable().optional(),
  data: z.any().nullable().optional(),
  creationDate: z.string().nullable().optional(),
  acceptedAt: z.string().nullable().optional(),
  rejectedAt: z.string().nullable().optional(),
  changeDate: z.string().nullable().optional(),
  status: ContractAttachmentStatus.nullable().optional(),
});

export type ContractAttachment = z.infer<typeof ContractAttachmentSchema>;

export const ContractSchema = z.object({
  id: z.number().nullable().optional(),
  subject: z.string().nullable().optional(),
  partnerName: z.string().nullable().optional(),
  creationDate: z.string().nullable().optional(),
  acceptedAt: z.string().nullable().optional(),
  rejectedAt: z.string().nullable().optional(),
  changeDate: z.string().nullable().optional(),
  status: ContractStatus.nullable().optional(),
  contractNo: z.string().nullable().optional(),
  attachments: z.array(ContractAttachmentSchema).nullable().optional(),
});

export type Contract = z.infer<typeof ContractSchema>;
