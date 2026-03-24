import { useState } from "react";
import { useNavigate } from "react-router";
import { FormField } from "../../components/shared/FormField";
import { ActionButton } from "../../components/shared/ActionButton";
import { ErrorAlert } from "../../components/shared/LoadingSpinner";
import { useCreateContract } from "../../hooks/useContracts";
import { addNotification } from "../../stores/ui.store";

export function ContractsPage() {
  const navigate = useNavigate();
  const createContract = useCreateContract();

  const [subject, setSubject] = useState("");
  const [partnerName, setPartnerName] = useState("");
  const [lookupId, setLookupId] = useState("");

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Contracts</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h2 className="text-lg font-semibold mb-4">Create Contract</h2>
          {createContract.isError && (
            <ErrorAlert message={String(createContract.error)} />
          )}
          <FormField label="Subject" value={subject} onChange={setSubject} required />
          <FormField label="Partner Name" value={partnerName} onChange={setPartnerName} required />
          <ActionButton
            label="Create Contract"
            onClick={() =>
              createContract.mutate(
                { subject, partnerName },
                {
                  onSuccess: (data) => {
                    addNotification(`Contract created: ${data.contractNo}`, "success");
                    if (data.id) navigate(`/contracts/${data.id}`);
                  },
                },
              )
            }
            isPending={createContract.isPending}
          />
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h2 className="text-lg font-semibold mb-4">Lookup Contract</h2>
          <FormField
            label="Contract ID"
            value={lookupId}
            onChange={setLookupId}
            type="number"
            placeholder="e.g. 1"
          />
          <ActionButton
            label="View Contract"
            onClick={() => {
              if (lookupId) navigate(`/contracts/${lookupId}`);
            }}
            disabled={!lookupId}
          />
        </div>
      </div>
    </div>
  );
}
