import { get } from "./client";
import { AnalyzedAddressesSchema } from "../schemas/transitAnalyzer.schema";

export const transitAnalyzerApi = {
  analyze: (clientId: number, addressId: number) =>
    get(
      `/transitAnalyze/${clientId}/${addressId}`,
      AnalyzedAddressesSchema,
    ),
};
