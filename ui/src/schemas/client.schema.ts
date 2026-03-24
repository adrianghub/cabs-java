import { z } from "zod";
import { ClientType, ClientClientType, PaymentType } from "./enums";

export const ClientSchema = z.object({
  id: z.number().nullable().optional(),
  type: ClientType.nullable().optional(),
  name: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
  defaultPaymentType: PaymentType.nullable().optional(),
  clientType: ClientClientType.nullable().optional(),
});

export type Client = z.infer<typeof ClientSchema>;
