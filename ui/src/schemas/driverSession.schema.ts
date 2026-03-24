import { z } from "zod";
import { CarClass } from "./enums";

export const DriverSessionSchema = z.object({
  loggedAt: z.string().nullable().optional(),
  loggedOutAt: z.string().nullable().optional(),
  platesNumber: z.string().nullable().optional(),
  carClass: CarClass.nullable().optional(),
  carBrand: z.string().nullable().optional(),
});

export type DriverSession = z.infer<typeof DriverSessionSchema>;
