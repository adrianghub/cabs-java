import { useState } from "react";
import { useNavigate } from "react-router";
import { FormField } from "../../components/shared/FormField";
import { ActionButton } from "../../components/shared/ActionButton";
import { ErrorAlert } from "../../components/shared/LoadingSpinner";
import { useCreateClaimDraft, useSendClaim } from "../../hooks/useClaims";
import { addNotification } from "../../stores/ui.store";

export function ClaimsPage() {
  const navigate = useNavigate();
  const createDraft = useCreateClaimDraft();
  const sendClaim = useSendClaim();

  const [clientId, setClientId] = useState("");
  const [transitId, setTransitId] = useState("");
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [lookupId, setLookupId] = useState("");

  const claimData = {
    clientId: clientId ? Number(clientId) : undefined,
    transitId: transitId ? Number(transitId) : undefined,
    reason,
    incidentDescription: description,
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Claims</h1>
      <p className="text-sm text-gray-500 mb-6">
        Claims can be filed against transits. Create a draft first, or send directly.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h2 className="text-lg font-semibold mb-4">Create Claim</h2>
          {createDraft.isError && <ErrorAlert message={String(createDraft.error)} />}
          {sendClaim.isError && <ErrorAlert message={String(sendClaim.error)} />}
          <FormField label="Client ID" value={clientId} onChange={setClientId} type="number" required />
          <FormField label="Transit ID" value={transitId} onChange={setTransitId} type="number" required />
          <FormField label="Reason" value={reason} onChange={setReason} required />
          <FormField label="Incident Description" value={description} onChange={setDescription} />
          <div className="flex gap-2">
            <ActionButton
              label="Save as Draft"
              onClick={() =>
                createDraft.mutate(claimData, {
                  onSuccess: (data) => {
                    addNotification(`Claim draft created: ${data.claimNo}`, "success");
                    if (data.claimID) navigate(`/claims/${data.claimID}`);
                  },
                })
              }
              isPending={createDraft.isPending}
              variant="secondary"
            />
            <ActionButton
              label="Send Claim"
              onClick={() =>
                sendClaim.mutate(claimData, {
                  onSuccess: (data) => {
                    addNotification(`Claim sent: ${data.claimNo}`, "success");
                    if (data.claimID) navigate(`/claims/${data.claimID}`);
                  },
                })
              }
              isPending={sendClaim.isPending}
            />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h2 className="text-lg font-semibold mb-4">Lookup Claim</h2>
          <FormField
            label="Claim ID"
            value={lookupId}
            onChange={setLookupId}
            type="number"
            placeholder="e.g. 1"
          />
          <ActionButton
            label="View Claim"
            onClick={() => {
              if (lookupId) navigate(`/claims/${lookupId}`);
            }}
            disabled={!lookupId}
          />
        </div>
      </div>
    </div>
  );
}
