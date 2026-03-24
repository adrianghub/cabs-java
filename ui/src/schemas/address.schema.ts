import { z } from "zod";

export const AddressSchema = z.object({
  country: z.string().nullable().optional(),
  district: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  street: z.string().nullable().optional(),
  buildingNumber: z.number().nullable().optional(),
  additionalNumber: z.number().nullable().optional(),
  postalCode: z.string().nullable().optional(),
  name: z.string().nullable().optional(),
});

export type Address = z.infer<typeof AddressSchema>;
