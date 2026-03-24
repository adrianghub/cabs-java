import { z } from "zod";
import { DriverSchema } from "./driver.schema";
import { DriverAttributeName } from "./enums";
import { TransitSchema } from "./transit.schema";

export const DriverAttributeSchema = z.object({
  name: DriverAttributeName.nullable().optional(),
  value: z.string().nullable().optional(),
});

export type DriverAttribute = z.infer<typeof DriverAttributeSchema>;

export const DriverReportSchema = z.object({
  driverDTO: DriverSchema.nullable().optional(),
  attributes: z.array(DriverAttributeSchema).nullable().optional(),
  sessions: z
    .record(z.string(), z.array(TransitSchema))
    .nullable()
    .optional(),
});

export type DriverReport = z.infer<typeof DriverReportSchema>;
