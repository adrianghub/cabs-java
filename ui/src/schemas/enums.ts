import { z } from "zod";

export const ClientType = z.enum(["NORMAL", "VIP"]);
export type ClientType = z.infer<typeof ClientType>;

export const ClientClientType = z.enum(["INDIVIDUAL", "COMPANY"]);
export type ClientClientType = z.infer<typeof ClientClientType>;

export const PaymentType = z.enum(["PRE_PAID", "POST_PAID", "MONTHLY_INVOICE"]);
export type PaymentType = z.infer<typeof PaymentType>;

export const DriverStatus = z.enum(["ACTIVE", "INACTIVE"]);
export type DriverStatus = z.infer<typeof DriverStatus>;

export const DriverType = z.enum(["CANDIDATE", "REGULAR"]);
export type DriverType = z.infer<typeof DriverType>;

export const TransitStatus = z.enum([
  "DRAFT",
  "CANCELLED",
  "WAITING_FOR_DRIVER_ASSIGNMENT",
  "DRIVER_ASSIGNMENT_FAILED",
  "TRANSIT_TO_PASSENGER",
  "IN_TRANSIT",
  "COMPLETED",
]);
export type TransitStatus = z.infer<typeof TransitStatus>;

export const CarClass = z.enum(["ECO", "REGULAR", "VAN", "PREMIUM"]);
export type CarClass = z.infer<typeof CarClass>;

export const CarTypeStatus = z.enum(["INACTIVE", "ACTIVE"]);
export type CarTypeStatus = z.infer<typeof CarTypeStatus>;

export const ClaimStatus = z.enum([
  "DRAFT",
  "NEW",
  "IN_PROCESS",
  "REFUNDED",
  "ESCALATED",
  "REJECTED",
]);
export type ClaimStatus = z.infer<typeof ClaimStatus>;

export const ClaimCompletionMode = z.enum(["MANUAL", "AUTOMATIC"]);
export type ClaimCompletionMode = z.infer<typeof ClaimCompletionMode>;

export const ContractStatus = z.enum([
  "NEGOTIATIONS_IN_PROGRESS",
  "REJECTED",
  "ACCEPTED",
]);
export type ContractStatus = z.infer<typeof ContractStatus>;

export const ContractAttachmentStatus = z.enum([
  "PROPOSED",
  "ACCEPTED_BY_ONE_SIDE",
  "ACCEPTED_BY_BOTH_SIDES",
  "REJECTED",
]);
export type ContractAttachmentStatus = z.infer<typeof ContractAttachmentStatus>;

export const DriverAttributeName = z.enum([
  "PENALTY_POINTS",
  "NATIONALITY",
  "YEARS_OF_EXPERIENCE",
  "MEDICAL_EXAMINATION_EXPIRATION_DATE",
  "MEDICAL_EXAMINATION_REMARKS",
  "EMAIL",
  "BIRTHPLACE",
  "COMPANY_NAME",
]);
export type DriverAttributeName = z.infer<typeof DriverAttributeName>;

export const FeeType = z.enum(["FLAT", "PERCENTAGE"]);
export type FeeType = z.infer<typeof FeeType>;
