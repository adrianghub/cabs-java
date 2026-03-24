import { useState } from "react";
import { useNavigate } from "react-router";
import { FormField } from "../../components/shared/FormField";
import { ActionButton } from "../../components/shared/ActionButton";
import { ErrorAlert } from "../../components/shared/LoadingSpinner";
import { useCreateDriver } from "../../hooks/useDrivers";
import { addNotification } from "../../stores/ui.store";

export function DriversPage() {
  const navigate = useNavigate();
  const createDriver = useCreateDriver();

  const [license, setLicense] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [photo, setPhoto] = useState("");
  const [lookupId, setLookupId] = useState("");

  const handleCreate = () => {
    createDriver.mutate(
      { license, firstName, lastName, photo },
      {
        onSuccess: (data) => {
          addNotification(`Driver created with ID: ${data.id}`, "success");
          if (data.id) navigate(`/drivers/${data.id}`);
        },
      },
    );
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Drivers</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h2 className="text-lg font-semibold mb-4">Create Driver</h2>
          <p className="text-xs text-gray-400 mb-3">
            Note: Driver creation uses query params, not request body (see DriverController).
          </p>
          {createDriver.isError && (
            <ErrorAlert message={String(createDriver.error)} />
          )}
          <FormField
            label="Driver License"
            value={license}
            onChange={setLicense}
            required
            placeholder="e.g. FARME100165AB2TT"
          />
          <FormField label="First Name" value={firstName} onChange={setFirstName} required />
          <FormField label="Last Name" value={lastName} onChange={setLastName} required />
          <FormField label="Photo (Base64)" value={photo} onChange={setPhoto} placeholder="Optional" />
          <ActionButton
            label="Create Driver"
            onClick={handleCreate}
            isPending={createDriver.isPending}
          />
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h2 className="text-lg font-semibold mb-4">Lookup Driver</h2>
          <FormField
            label="Driver ID"
            value={lookupId}
            onChange={setLookupId}
            type="number"
            placeholder="e.g. 1"
          />
          <ActionButton
            label="View Driver"
            onClick={() => {
              if (lookupId) navigate(`/drivers/${lookupId}`);
            }}
            disabled={!lookupId}
          />
        </div>
      </div>
    </div>
  );
}
