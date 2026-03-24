import { useState } from "react";
import { useNavigate } from "react-router";
import { FormField, SelectField } from "../../components/shared/FormField";
import { ActionButton } from "../../components/shared/ActionButton";
import { ErrorAlert } from "../../components/shared/LoadingSpinner";
import { useCreateTransit } from "../../hooks/useTransits";
import { addNotification } from "../../stores/ui.store";

export function TransitsPage() {
  const navigate = useNavigate();
  const createTransit = useCreateTransit();

  const [fromCity, setFromCity] = useState("");
  const [fromStreet, setFromStreet] = useState("");
  const [fromBuildingNumber, setFromBuildingNumber] = useState("");
  const [toCity, setToCity] = useState("");
  const [toStreet, setToStreet] = useState("");
  const [toBuildingNumber, setToBuildingNumber] = useState("");
  const [carClass, setCarClass] = useState("");
  const [lookupId, setLookupId] = useState("");

  const handleCreate = () => {
    createTransit.mutate(
      {
        from: {
          city: fromCity,
          street: fromStreet,
          buildingNumber: fromBuildingNumber ? Number(fromBuildingNumber) : undefined,
          country: "Poland",
          district: "Mazowieckie",
        },
        to: {
          city: toCity,
          street: toStreet,
          buildingNumber: toBuildingNumber ? Number(toBuildingNumber) : undefined,
          country: "Poland",
          district: "Mazowieckie",
        },
        carClass: carClass ? (carClass as "ECO" | "REGULAR" | "VAN" | "PREMIUM") : undefined,
      },
      {
        onSuccess: (data) => {
          addNotification(`Transit created with ID: ${data.id}`, "success");
          if (data.id) navigate(`/transits/${data.id}`);
        },
      },
    );
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Transits</h1>
      <p className="text-sm text-gray-500 mb-6">
        Transits are the core of CABS. Create a transit, then walk through the lifecycle:
        DRAFT &rarr; publish &rarr; findDrivers &rarr; accept &rarr; start &rarr; complete.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h2 className="text-lg font-semibold mb-4">Create Transit</h2>
          {createTransit.isError && (
            <ErrorAlert message={String(createTransit.error)} />
          )}

          <h3 className="text-sm font-semibold text-gray-600 mb-2">From Address</h3>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="City" value={fromCity} onChange={setFromCity} required />
            <FormField label="Street" value={fromStreet} onChange={setFromStreet} required />
          </div>
          <FormField label="Building #" value={fromBuildingNumber} onChange={setFromBuildingNumber} type="number" />

          <h3 className="text-sm font-semibold text-gray-600 mb-2 mt-4">To Address</h3>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="City" value={toCity} onChange={setToCity} required />
            <FormField label="Street" value={toStreet} onChange={setToStreet} required />
          </div>
          <FormField label="Building #" value={toBuildingNumber} onChange={setToBuildingNumber} type="number" />

          <SelectField
            label="Car Class"
            value={carClass}
            onChange={setCarClass}
            options={[
              { value: "ECO", label: "ECO" },
              { value: "REGULAR", label: "REGULAR" },
              { value: "VAN", label: "VAN" },
              { value: "PREMIUM", label: "PREMIUM" },
            ]}
          />

          <ActionButton
            label="Create Transit"
            onClick={handleCreate}
            isPending={createTransit.isPending}
          />
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h2 className="text-lg font-semibold mb-4">Lookup Transit</h2>
          <FormField
            label="Transit ID"
            value={lookupId}
            onChange={setLookupId}
            type="number"
            placeholder="e.g. 1"
          />
          <ActionButton
            label="View Transit"
            onClick={() => {
              if (lookupId) navigate(`/transits/${lookupId}`);
            }}
            disabled={!lookupId}
          />
        </div>
      </div>
    </div>
  );
}
