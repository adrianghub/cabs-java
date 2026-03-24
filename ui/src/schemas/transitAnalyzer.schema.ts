import { z } from "zod";
import { AddressSchema } from "./address.schema";

export const AnalyzedAddressesSchema = z.object({
  addresses: z.array(AddressSchema).nullable().optional(),
});

export type AnalyzedAddresses = z.infer<typeof AnalyzedAddressesSchema>;
