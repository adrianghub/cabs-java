import { z } from "zod";
import { DriverStatus, DriverType } from "./enums";

export const DriverSchema = z.object({
  id: z.number().nullable().optional(),
  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
  driverLicense: z.string().nullable().optional(),
  photo: z.string().nullable().optional(),
  status: DriverStatus.nullable().optional(),
  type: DriverType.nullable().optional(),
});

export type Driver = z.infer<typeof DriverSchema>;
