import { useState } from "react";
import { useNavigate } from "react-router";
import { FormField, SelectField } from "../../components/shared/FormField";
import { ActionButton } from "../../components/shared/ActionButton";
import { ErrorAlert } from "../../components/shared/LoadingSpinner";
import { useCreateCarType, useRegisterCar, useUnregisterCar } from "../../hooks/useCarTypes";
import type { CarClass } from "../../schemas/enums";
import { addNotification } from "../../stores/ui.store";

const CAR_CLASSES: CarClass[] = ["ECO", "REGULAR", "VAN", "PREMIUM"];

export function CarTypesPage() {
  const navigate = useNavigate();
  const createCarType = useCreateCarType();
  const registerCar = useRegisterCar();
  const unregisterCar = useUnregisterCar();

  const [carClass, setCarClass] = useState("");
  const [description, setDescription] = useState("");
  const [minCars, setMinCars] = useState("");
  const [lookupId, setLookupId] = useState("");

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Car Types</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h2 className="text-lg font-semibold mb-4">Create Car Type</h2>
          {createCarType.isError && (
            <ErrorAlert message={String(createCarType.error)} />
          )}
          <SelectField
            label="Car Class"
            value={carClass}
            onChange={setCarClass}
            options={CAR_CLASSES.map((c) => ({ value: c, label: c }))}
            required
          />
          <FormField label="Description" value={description} onChange={setDescription} />
          <FormField label="Min Cars to Activate" value={minCars} onChange={setMinCars} type="number" />
          <ActionButton
            label="Create Car Type"
            onClick={() =>
              createCarType.mutate(
                {
                  carClass: carClass as CarClass,
                  description,
                  minNoOfCarsToActivateClass: minCars ? Number(minCars) : undefined,
                },
                {
                  onSuccess: (data) => {
                    addNotification(`Car type created with ID: ${data.id}`, "success");
                    if (data.id) navigate(`/car-types/${data.id}`);
                  },
                },
              )
            }
            isPending={createCarType.isPending}
          />
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h2 className="text-lg font-semibold mb-4">Register / Unregister Cars</h2>
            <p className="text-sm text-gray-500 mb-4">
              Register or unregister a car for a specific class. This increments/decrements the car counter.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {CAR_CLASSES.map((cc) => (
                <div key={cc} className="flex items-center gap-2">
                  <span className="text-sm font-medium w-20">{cc}</span>
                  <ActionButton
                    label="+"
                    onClick={() =>
                      registerCar.mutate(cc, {
                        onSuccess: () => addNotification(`Car registered for ${cc}`, "success"),
                      })
                    }
                    isPending={registerCar.isPending}
                  />
                  <ActionButton
                    label="-"
                    onClick={() =>
                      unregisterCar.mutate(cc, {
                        onSuccess: () => addNotification(`Car unregistered for ${cc}`, "info"),
                      })
                    }
                    isPending={unregisterCar.isPending}
                    variant="secondary"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h2 className="text-lg font-semibold mb-4">Lookup Car Type</h2>
            <FormField
              label="Car Type ID"
              value={lookupId}
              onChange={setLookupId}
              type="number"
              placeholder="e.g. 1"
            />
            <ActionButton
              label="View Car Type"
              onClick={() => {
                if (lookupId) navigate(`/car-types/${lookupId}`);
              }}
              disabled={!lookupId}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
