import { z } from "zod";
import { CarClass, CarTypeStatus } from "./enums";

export const CarTypeSchema = z.object({
  id: z.number().nullable().optional(),
  carClass: CarClass.nullable().optional(),
  status: CarTypeStatus.nullable().optional(),
  carsCounter: z.number().nullable().optional(),
  description: z.string().nullable().optional(),
  activeCarsCounter: z.number().nullable().optional(),
  minNoOfCarsToActivateClass: z.number().nullable().optional(),
});

export type CarType = z.infer<typeof CarTypeSchema>;
