import { useQuery } from "@tanstack/react-query";
import { transitAnalyzerApi } from "../api/transitAnalyzer.api";

export function useTransitAnalysis(
  clientId: number | null,
  addressId: number | null,
) {
  return useQuery({
    queryKey: ["transitAnalyze", clientId, addressId],
    queryFn: () => transitAnalyzerApi.analyze(clientId!, addressId!),
    enabled: clientId !== null && addressId !== null,
  });
}
