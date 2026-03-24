import { get, post, postVoid, getRaw } from "./client";
import { AwardsAccountSchema } from "../schemas/awards.schema";

export const awardsApi = {
  getAccount: (clientId: number) =>
    get(`/clients/${clientId}/awards/`, AwardsAccountSchema),

  getBalance: (clientId: number) =>
    getRaw<number>(`/clients/${clientId}/awards/balance`),

  create: (clientId: number) =>
    postVoid(`/clients/${clientId}/awards`),

  activate: (clientId: number) =>
    post(
      `/clients/${clientId}/awards/activate`,
      undefined,
      AwardsAccountSchema,
    ),

  deactivate: (clientId: number) =>
    post(
      `/clients/${clientId}/awards/deactivate`,
      undefined,
      AwardsAccountSchema,
    ),

  transfer: (clientId: number, toClientId: number, howMuch: number) =>
    post(
      `/clients/${clientId}/awards/transfer/${toClientId}/${howMuch}`,
      undefined,
      AwardsAccountSchema,
    ),
};
