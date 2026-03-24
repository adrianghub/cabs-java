import { useParams } from "react-router";
import { useState } from "react";
import { DetailCard, DetailRow } from "../../components/shared/DetailCard";
import { StatusBadge } from "../../components/shared/StatusBadge";
import { ActionButton } from "../../components/shared/ActionButton";
import { FormField } from "../../components/shared/FormField";
import { LoadingSpinner, ErrorAlert } from "../../components/shared/LoadingSpinner";
import {
  useTransit,
  usePublishTransit,
  useCancelTransit,
  useFindDrivers,
  useAcceptTransit,
  useStartTransit,
  useRejectTransit,
  useCompleteTransit,
} from "../../hooks/useTransits";
import { addNotification } from "../../stores/ui.store";

const LIFECYCLE_STEPS = [
  "DRAFT",
  "WAITING_FOR_DRIVER_ASSIGNMENT",
  "TRANSIT_TO_PASSENGER",
  "IN_TRANSIT",
  "COMPLETED",
];

export function TransitDetailPage() {
  const { id } = useParams<{ id: string }>();
  const transitId = id ? Number(id) : null;
  const { data: transit, isLoading, error } = useTransit(transitId);
  const publish = usePublishTransit();
  const cancel = useCancelTransit();
  const findDrivers = useFindDrivers();
  const accept = useAcceptTransit();
  const start = useStartTransit();
  const reject = useRejectTransit();
  const complete = useCompleteTransit();

  const [driverId, setDriverId] = useState("");
  const [destCity, setDestCity] = useState("");
  const [destStreet, setDestStreet] = useState("");

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message={String(error)} />;
  if (!transit) return <ErrorAlert message="Transit not found" />;

  const status = transit.status ?? "";
  const currentStep = LIFECYCLE_STEPS.indexOf(status);
  const effectiveDriverId = driverId
    ? Number(driverId)
    : transit.driver?.id ?? undefined;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Transit #{transit.id}</h1>

      {/* Lifecycle visualization */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
        <h3 className="text-sm font-semibold mb-3">Transit Lifecycle</h3>
        <div className="flex items-center gap-1">
          {LIFECYCLE_STEPS.map((step, i) => (
            <div key={step} className="flex items-center">
              <div
                className={`px-2 py-1 rounded text-xs font-medium ${
                  step === status
                    ? "bg-blue-600 text-white"
                    : i < currentStep
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-400"
                }`}
              >
                {step.replace(/_/g, " ")}
              </div>
              {i < LIFECYCLE_STEPS.length - 1 && (
                <span className="text-gray-300 mx-1">&rarr;</span>
              )}
            </div>
          ))}
          {status === "CANCELLED" && (
            <div className="px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-700 ml-2">
              CANCELLED
            </div>
          )}
          {status === "DRIVER_ASSIGNMENT_FAILED" && (
            <div className="px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-700 ml-2">
              ASSIGNMENT FAILED
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <DetailCard title="Transit Details">
          <DetailRow label="Status" value={<StatusBadge status={transit.status} />} />
          <DetailRow label="Car Class" value={<StatusBadge status={transit.carClass} />} />
          <DetailRow label="Tariff" value={transit.tariff} />
          <DetailRow label="Distance" value={transit.distance ? `${transit.distance} ${transit.distanceUnit ?? "km"}` : "-"} />
          <DetailRow label="KM Rate" value={transit.kmRate} />
          <DetailRow label="Estimated Price" value={transit.estimatedPrice} />
          <DetailRow label="Price" value={transit.price} />
          <DetailRow label="Driver Fee" value={transit.driverFee} />
          <DetailRow label="Factor" value={transit.factor} />
        </DetailCard>

        <DetailCard title="Addresses">
          <h4 className="text-sm font-semibold mb-1">From</h4>
          {transit.from ? (
            <>
              <DetailRow label="City" value={transit.from.city} />
              <DetailRow label="Street" value={transit.from.street} />
              <DetailRow label="Building" value={transit.from.buildingNumber} />
            </>
          ) : (
            <p className="text-sm text-gray-400">Not set</p>
          )}
          <h4 className="text-sm font-semibold mt-3 mb-1">To</h4>
          {transit.to ? (
            <>
              <DetailRow label="City" value={transit.to.city} />
              <DetailRow label="Street" value={transit.to.street} />
              <DetailRow label="Building" value={transit.to.buildingNumber} />
            </>
          ) : (
            <p className="text-sm text-gray-400">Not set</p>
          )}
        </DetailCard>

        <DetailCard title="Timeline">
          <DetailRow label="Created" value={transit.dateTime} />
          <DetailRow label="Published" value={transit.published} />
          <DetailRow label="Accepted" value={transit.acceptedAt} />
          <DetailRow label="Started" value={transit.started} />
          <DetailRow label="Completed" value={transit.completeAt} />
        </DetailCard>

        <DetailCard title="Driver">
          {transit.driver ? (
            <>
              <DetailRow label="ID" value={transit.driver.id} />
              <DetailRow label="Name" value={`${transit.driver.firstName ?? ""} ${transit.driver.lastName ?? ""}`} />
              <DetailRow label="Status" value={<StatusBadge status={transit.driver.status} />} />
            </>
          ) : (
            <p className="text-sm text-gray-400">No driver assigned</p>
          )}
          {transit.proposedDrivers && transit.proposedDrivers.length > 0 && (
            <div className="mt-3">
              <h4 className="text-sm font-semibold mb-1">Proposed Drivers</h4>
              {transit.proposedDrivers.map((d) => (
                <div key={d.id} className="text-sm py-1">
                  #{d.id} - {d.firstName} {d.lastName} <StatusBadge status={d.status} />
                </div>
              ))}
            </div>
          )}
        </DetailCard>
      </div>

      {/* Actions based on status */}
      <DetailCard title="Actions">
        {status === "DRAFT" && (
          <ActionButton
            label="Publish Transit"
            onClick={() =>
              publish.mutate(transitId!, {
                onSuccess: () => addNotification("Transit published", "success"),
              })
            }
            isPending={publish.isPending}
          />
        )}

        {(status === "DRAFT" || status === "WAITING_FOR_DRIVER_ASSIGNMENT") && (
          <ActionButton
            label="Cancel"
            onClick={() =>
              cancel.mutate(transitId!, {
                onSuccess: () => addNotification("Transit cancelled", "success"),
              })
            }
            isPending={cancel.isPending}
            variant="danger"
          />
        )}

        {status === "WAITING_FOR_DRIVER_ASSIGNMENT" && (
          <ActionButton
            label="Find Drivers"
            onClick={() =>
              findDrivers.mutate(transitId!, {
                onSuccess: () => addNotification("Looking for drivers...", "info"),
              })
            }
            isPending={findDrivers.isPending}
          />
        )}

        {(status === "WAITING_FOR_DRIVER_ASSIGNMENT" ||
          status === "TRANSIT_TO_PASSENGER") && (
          <div className="mt-3 p-3 bg-gray-50 rounded-md">
            <FormField
              label="Driver ID"
              value={driverId}
              onChange={setDriverId}
              type="number"
              placeholder={transit.driver?.id ? String(transit.driver.id) : "Enter driver ID"}
            />
            <div className="flex gap-2">
              <ActionButton
                label="Accept"
                onClick={() =>
                  accept.mutate(
                    { id: transitId!, driverId: effectiveDriverId! },
                    { onSuccess: () => addNotification("Transit accepted by driver", "success") },
                  )
                }
                isPending={accept.isPending}
                disabled={!effectiveDriverId}
              />
              <ActionButton
                label="Reject"
                onClick={() =>
                  reject.mutate(
                    { id: transitId!, driverId: effectiveDriverId! },
                    { onSuccess: () => addNotification("Transit rejected by driver", "info") },
                  )
                }
                isPending={reject.isPending}
                disabled={!effectiveDriverId}
                variant="secondary"
              />
              {status === "TRANSIT_TO_PASSENGER" && (
                <ActionButton
                  label="Start Ride"
                  onClick={() =>
                    start.mutate(
                      { id: transitId!, driverId: effectiveDriverId! },
                      { onSuccess: () => addNotification("Ride started!", "success") },
                    )
                  }
                  isPending={start.isPending}
                  disabled={!effectiveDriverId}
                />
              )}
            </div>
          </div>
        )}

        {status === "IN_TRANSIT" && (
          <div className="mt-3 p-3 bg-gray-50 rounded-md">
            <h4 className="text-sm font-semibold mb-2">Complete the ride</h4>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Destination City" value={destCity} onChange={setDestCity} />
              <FormField label="Destination Street" value={destStreet} onChange={setDestStreet} />
            </div>
            <ActionButton
              label="Complete Ride"
              onClick={() =>
                complete.mutate(
                  {
                    id: transitId!,
                    driverId: effectiveDriverId!,
                    destination: {
                      city: destCity || transit.to?.city,
                      street: destStreet || transit.to?.street,
                      country: "Poland",
                      district: "Mazowieckie",
                    },
                  },
                  { onSuccess: () => addNotification("Ride completed!", "success") },
                )
              }
              isPending={complete.isPending}
              disabled={!effectiveDriverId}
            />
          </div>
        )}

        {(status === "COMPLETED" ||
          status === "CANCELLED" ||
          status === "DRIVER_ASSIGNMENT_FAILED") && (
          <p className="text-sm text-gray-500 italic">
            This transit is in a terminal state. No further actions available.
          </p>
        )}
      </DetailCard>

      {transit.clientDTO && (
        <DetailCard title="Client">
          <DetailRow label="ID" value={transit.clientDTO.id} />
          <DetailRow label="Name" value={`${transit.clientDTO.name ?? ""} ${transit.clientDTO.lastName ?? ""}`} />
          <DetailRow label="Type" value={<StatusBadge status={transit.clientDTO.type} />} />
        </DetailCard>
      )}
    </div>
  );
}
