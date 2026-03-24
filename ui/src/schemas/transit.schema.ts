import { z } from "zod";
import { TransitStatus, CarClass } from "./enums";
import { DriverSchema } from "./driver.schema";
import { AddressSchema } from "./address.schema";
import { ClientSchema } from "./client.schema";
import { ClaimSchema } from "./claim.schema";

export const TransitSchema = z.object({
  id: z.number().nullable().optional(),
  tariff: z.string().nullable().optional(),
  status: TransitStatus.nullable().optional(),
  driver: DriverSchema.nullable().optional(),
  factor: z.number().nullable().optional(),
  distance: z.number().nullable().optional(),
  distanceUnit: z.string().nullable().optional(),
  kmRate: z.number().nullable().optional(),
  price: z.number().nullable().optional(),
  driverFee: z.number().nullable().optional(),
  estimatedPrice: z.number().nullable().optional(),
  baseFee: z.number().nullable().optional(),
  date: z.string().nullable().optional(),
  dateTime: z.string().nullable().optional(),
  published: z.string().nullable().optional(),
  acceptedAt: z.string().nullable().optional(),
  started: z.string().nullable().optional(),
  completeAt: z.string().nullable().optional(),
  claimDTO: ClaimSchema.nullable().optional(),
  proposedDrivers: z.array(DriverSchema).nullable().optional(),
  to: AddressSchema.nullable().optional(),
  from: AddressSchema.nullable().optional(),
  carClass: CarClass.nullable().optional(),
  clientDTO: ClientSchema.nullable().optional(),
});

export type Transit = z.infer<typeof TransitSchema>;
