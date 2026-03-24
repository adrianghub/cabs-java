import { useParams } from "react-router";
import { DetailCard, DetailRow } from "../../components/shared/DetailCard";
import { StatusBadge } from "../../components/shared/StatusBadge";
import { ActionButton } from "../../components/shared/ActionButton";
import { LoadingSpinner, ErrorAlert } from "../../components/shared/LoadingSpinner";
import { useCarType, useActivateCarType, useDeactivateCarType } from "../../hooks/useCarTypes";
import { addNotification } from "../../stores/ui.store";

export function CarTypeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const carTypeId = id ? Number(id) : null;
  const { data: carType, isLoading, error } = useCarType(carTypeId);
  const activate = useActivateCarType();
  const deactivate = useDeactivateCarType();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message={String(error)} />;
  if (!carType) return <ErrorAlert message="Car type not found" />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Car Type #{carType.id}</h1>

      <DetailCard title="Car Type Information">
        <DetailRow label="ID" value={carType.id} />
        <DetailRow label="Car Class" value={<StatusBadge status={carType.carClass} />} />
        <DetailRow label="Status" value={<StatusBadge status={carType.status} />} />
        <DetailRow label="Description" value={carType.description} />
        <DetailRow label="Total Cars" value={carType.carsCounter} />
        <DetailRow label="Active Cars" value={carType.activeCarsCounter} />
        <DetailRow label="Min Cars to Activate" value={carType.minNoOfCarsToActivateClass} />
      </DetailCard>

      <DetailCard title="Actions">
        <div className="flex gap-2">
          <ActionButton
            label="Activate"
            onClick={() =>
              activate.mutate(carTypeId!, {
                onSuccess: () => addNotification("Car type activated", "success"),
              })
            }
            isPending={activate.isPending}
            disabled={carType.status === "ACTIVE"}
          />
          <ActionButton
            label="Deactivate"
            onClick={() =>
              deactivate.mutate(carTypeId!, {
                onSuccess: () => addNotification("Car type deactivated", "info"),
              })
            }
            isPending={deactivate.isPending}
            disabled={carType.status === "INACTIVE"}
            variant="danger"
          />
        </div>
      </DetailCard>
    </div>
  );
}
