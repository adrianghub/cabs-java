import { useParams } from "react-router";
import { DetailCard, DetailRow } from "../../components/shared/DetailCard";
import { StatusBadge } from "../../components/shared/StatusBadge";
import { ActionButton } from "../../components/shared/ActionButton";
import { LoadingSpinner, ErrorAlert } from "../../components/shared/LoadingSpinner";
import { useClaim, useMarkClaimInProcess, useTryToResolveClaim } from "../../hooks/useClaims";
import { addNotification } from "../../stores/ui.store";

export function ClaimDetailPage() {
  const { id } = useParams<{ id: string }>();
  const claimId = id ? Number(id) : null;
  const { data: claim, isLoading, error } = useClaim(claimId);
  const markInProcess = useMarkClaimInProcess();
  const tryResolve = useTryToResolveClaim();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message={String(error)} />;
  if (!claim) return <ErrorAlert message="Claim not found" />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Claim #{claim.claimID}</h1>

      <DetailCard title="Claim Information">
        <DetailRow label="Claim No" value={claim.claimNo} />
        <DetailRow label="Status" value={<StatusBadge status={claim.status} />} />
        <DetailRow label="Client ID" value={claim.clientId} />
        <DetailRow label="Transit ID" value={claim.transitId} />
        <DetailRow label="Reason" value={claim.reason} />
        <DetailRow label="Description" value={claim.incidentDescription} />
        <DetailRow label="Is Draft" value={claim.isDraft ? "Yes" : "No"} />
        <DetailRow label="Completion Mode" value={claim.completionMode} />
        <DetailRow label="Created" value={claim.creationDate} />
        <DetailRow label="Changed" value={claim.changeDate} />
        <DetailRow label="Completed" value={claim.completionDate} />
      </DetailCard>

      <DetailCard title="Actions">
        <div className="flex gap-2">
          <ActionButton
            label="Mark In Process"
            onClick={() =>
              markInProcess.mutate(claimId!, {
                onSuccess: () => addNotification("Claim marked as in process", "success"),
              })
            }
            isPending={markInProcess.isPending}
          />
          <ActionButton
            label="Try Auto-Resolve"
            onClick={() =>
              tryResolve.mutate(claimId!, {
                onSuccess: () => addNotification("Resolution attempted", "info"),
              })
            }
            isPending={tryResolve.isPending}
            variant="secondary"
          />
        </div>
      </DetailCard>
    </div>
  );
}
