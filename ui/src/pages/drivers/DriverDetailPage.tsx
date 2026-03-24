import { useParams } from "react-router";
import { useState } from "react";
import { DetailCard, DetailRow } from "../../components/shared/DetailCard";
import { StatusBadge } from "../../components/shared/StatusBadge";
import { ActionButton } from "../../components/shared/ActionButton";
import { FormField, SelectField } from "../../components/shared/FormField";
import { LoadingSpinner, ErrorAlert } from "../../components/shared/LoadingSpinner";
import { useDriver, useActivateDriver, useDeactivateDriver } from "../../hooks/useDrivers";
import { useDriverSessions, useDriverLogin } from "../../hooks/useDriverSessions";
import { useDriverReport } from "../../hooks/useDriverReport";
import { addNotification } from "../../stores/ui.store";

export function DriverDetailPage() {
  const { id } = useParams<{ id: string }>();
  const driverId = id ? Number(id) : null;
  const { data: driver, isLoading, error } = useDriver(driverId);
  const activate = useActivateDriver();
  const deactivate = useDeactivateDriver();
  const { data: sessions } = useDriverSessions(driverId);
  const { data: report } = useDriverReport(driverId, 30);
  const login = useDriverLogin();

  const [platesNumber, setPlatesNumber] = useState("");
  const [carClass, setCarClass] = useState("");
  const [carBrand, setCarBrand] = useState("");

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message={String(error)} />;
  if (!driver) return <ErrorAlert message="Driver not found" />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Driver #{driver.id}</h1>

      <DetailCard title="Driver Information">
        <DetailRow label="ID" value={driver.id} />
        <DetailRow label="First Name" value={driver.firstName} />
        <DetailRow label="Last Name" value={driver.lastName} />
        <DetailRow label="License" value={driver.driverLicense} />
        <DetailRow label="Status" value={<StatusBadge status={driver.status} />} />
        <DetailRow label="Type" value={<StatusBadge status={driver.type} />} />
      </DetailCard>

      <DetailCard title="Actions">
        <div className="flex gap-2">
          <ActionButton
            label="Activate"
            onClick={() =>
              activate.mutate(driverId!, {
                onSuccess: () => addNotification("Driver activated", "success"),
              })
            }
            isPending={activate.isPending}
            disabled={driver.status === "ACTIVE"}
          />
          <ActionButton
            label="Deactivate"
            onClick={() =>
              deactivate.mutate(driverId!, {
                onSuccess: () => addNotification("Driver deactivated", "success"),
              })
            }
            isPending={deactivate.isPending}
            disabled={driver.status === "INACTIVE"}
            variant="danger"
          />
        </div>
      </DetailCard>

      <DetailCard title="Login Session">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
          <FormField label="Plates Number" value={platesNumber} onChange={setPlatesNumber} required />
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
            required
          />
          <FormField label="Car Brand" value={carBrand} onChange={setCarBrand} />
        </div>
        <ActionButton
          label="Login"
          onClick={() =>
            login.mutate(
              {
                driverId: driverId!,
                data: {
                  platesNumber,
                  carClass: carClass as "ECO" | "REGULAR" | "VAN" | "PREMIUM",
                  carBrand: carBrand || undefined,
                },
              },
              { onSuccess: () => addNotification("Driver logged in", "success") },
            )
          }
          isPending={login.isPending}
          disabled={!platesNumber || !carClass}
        />
      </DetailCard>

      <DetailCard title="Active Sessions">
        {sessions && sessions.length > 0 ? (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 font-medium text-gray-600">Plates</th>
                <th className="text-left py-2 font-medium text-gray-600">Car Class</th>
                <th className="text-left py-2 font-medium text-gray-600">Brand</th>
                <th className="text-left py-2 font-medium text-gray-600">Logged At</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((s, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-2">{s.platesNumber}</td>
                  <td className="py-2"><StatusBadge status={s.carClass} /></td>
                  <td className="py-2">{s.carBrand ?? "-"}</td>
                  <td className="py-2 text-gray-500">{s.loggedAt ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-sm text-gray-400 italic">No active sessions.</p>
        )}
      </DetailCard>

      {report && (
        <DetailCard title="Driver Report (last 30 days)">
          {report.attributes && report.attributes.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold mb-2">Attributes</h4>
              {report.attributes.map((a, i) => (
                <DetailRow key={i} label={a.name ?? ""} value={a.value} />
              ))}
            </div>
          )}
          <p className="text-sm text-gray-500">
            Sessions with transits: {report.sessions ? Object.keys(report.sessions).length : 0}
          </p>
        </DetailCard>
      )}
    </div>
  );
}
