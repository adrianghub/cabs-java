import { z } from "zod";

export const DriverPositionSchema = z.object({
  driverId: z.number().nullable().optional(),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  seenAt: z.string().nullable().optional(),
});

export type DriverPosition = z.infer<typeof DriverPositionSchema>;
