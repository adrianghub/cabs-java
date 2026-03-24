import { useState } from "react";
import { useNavigate } from "react-router";
import { FormField, SelectField } from "../../components/shared/FormField";
import { ActionButton } from "../../components/shared/ActionButton";
import { ErrorAlert } from "../../components/shared/LoadingSpinner";
import { useCreateClient } from "../../hooks/useClients";
import { addNotification } from "../../stores/ui.store";

export function ClientsPage() {
  const navigate = useNavigate();
  const createClient = useCreateClient();

  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [clientType, setClientType] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const [lookupId, setLookupId] = useState("");

  const handleCreate = () => {
    createClient.mutate(
      {
        name,
        lastName,
        clientType: (clientType || undefined) as "INDIVIDUAL" | "COMPANY" | undefined,
        defaultPaymentType: (paymentType || undefined) as "PRE_PAID" | "POST_PAID" | "MONTHLY_INVOICE" | undefined,
      },
      {
        onSuccess: (data) => {
          addNotification(`Client created with ID: ${data.id}`, "success");
          if (data.id) navigate(`/clients/${data.id}`);
        },
      },
    );
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Clients</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h2 className="text-lg font-semibold mb-4">Create Client</h2>
          {createClient.isError && (
            <ErrorAlert message={String(createClient.error)} />
          )}
          <FormField label="Name" value={name} onChange={setName} required />
          <FormField label="Last Name" value={lastName} onChange={setLastName} required />
          <SelectField
            label="Client Type"
            value={clientType}
            onChange={setClientType}
            options={[
              { value: "INDIVIDUAL", label: "Individual" },
              { value: "COMPANY", label: "Company" },
            ]}
          />
          <SelectField
            label="Payment Type"
            value={paymentType}
            onChange={setPaymentType}
            options={[
              { value: "PRE_PAID", label: "Pre-paid" },
              { value: "POST_PAID", label: "Post-paid" },
              { value: "MONTHLY_INVOICE", label: "Monthly Invoice" },
            ]}
          />
          <ActionButton
            label="Create Client"
            onClick={handleCreate}
            isPending={createClient.isPending}
          />
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h2 className="text-lg font-semibold mb-4">Lookup Client</h2>
          <p className="text-sm text-gray-500 mb-4">
            The backend has no list endpoint. Enter a client ID to view details.
          </p>
          <FormField
            label="Client ID"
            value={lookupId}
            onChange={setLookupId}
            type="number"
            placeholder="e.g. 1"
          />
          <ActionButton
            label="View Client"
            onClick={() => {
              if (lookupId) navigate(`/clients/${lookupId}`);
            }}
            disabled={!lookupId}
          />
        </div>
      </div>
    </div>
  );
}
