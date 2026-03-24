import { z } from "zod";
import { ClientSchema } from "./client.schema";

export const AwardsAccountSchema = z.object({
  client: ClientSchema.nullable().optional(),
  date: z.string().nullable().optional(),
  isActive: z.boolean().nullable().optional(),
  transactions: z.number().nullable().optional(),
});

export type AwardsAccount = z.infer<typeof AwardsAccountSchema>;
