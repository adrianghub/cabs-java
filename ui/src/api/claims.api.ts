import { get, post } from "./client";
import { ClaimSchema, type Claim } from "../schemas/claim.schema";

export const claimsApi = {
  getById: (id: number) => get(`/claims/${id}`, ClaimSchema),

  createDraft: (data: Claim) => post("/claims/createDraft", data, ClaimSchema),

  send: (data: Claim) => post("/claims/send", data, ClaimSchema),

  markInProcess: (id: number) =>
    post(`/claims/${id}/markInProcess`, undefined, ClaimSchema),

  tryToResolve: (id: number) => post(`/claims/${id}`, undefined, ClaimSchema),
};
