import { z } from "zod";
import { ClaimStatus, ClaimCompletionMode } from "./enums";

export const ClaimSchema = z.object({
  claimID: z.number().nullable().optional(),
  clientId: z.number().nullable().optional(),
  transitId: z.number().nullable().optional(),
  reason: z.string().nullable().optional(),
  incidentDescription: z.string().nullable().optional(),
  isDraft: z.boolean().nullable().optional(),
  creationDate: z.string().nullable().optional(),
  completionDate: z.string().nullable().optional(),
  changeDate: z.string().nullable().optional(),
  completionMode: ClaimCompletionMode.nullable().optional(),
  status: ClaimStatus.nullable().optional(),
  claimNo: z.string().nullable().optional(),
});

export type Claim = z.infer<typeof ClaimSchema>;
