import { useParams } from "react-router";
import { useState } from "react";
import { DetailCard, DetailRow } from "../../components/shared/DetailCard";
import { StatusBadge } from "../../components/shared/StatusBadge";
import { ActionButton } from "../../components/shared/ActionButton";
import { SelectField } from "../../components/shared/FormField";
import { LoadingSpinner, ErrorAlert } from "../../components/shared/LoadingSpinner";
import {
  useClient,
  useUpgradeClient,
  useDowngradeClient,
  useChangePaymentType,
} from "../../hooks/useClients";
import {
  useAwardsAccount,
  useAwardsBalance,
  useCreateAwardsAccount,
  useActivateAwards,
  useDeactivateAwards,
} from "../../hooks/useAwards";
import { addNotification } from "../../stores/ui.store";

export function ClientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const clientId = id ? Number(id) : null;
  const { data: client, isLoading, error } = useClient(clientId);
  const upgrade = useUpgradeClient();
  const downgrade = useDowngradeClient();
  const changePayment = useChangePaymentType();
  const { data: awards } = useAwardsAccount(clientId);
  const { data: balance } = useAwardsBalance(clientId);
  const createAwards = useCreateAwardsAccount();
  const activateAwards = useActivateAwards();
  const deactivateAwards = useDeactivateAwards();

  const [paymentType, setPaymentType] = useState("");

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message={String(error)} />;
  if (!client) return <ErrorAlert message="Client not found" />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Client #{client.id}</h1>

      <DetailCard title="Client Information">
        <DetailRow label="ID" value={client.id} />
        <DetailRow label="Name" value={client.name} />
        <DetailRow label="Last Name" value={client.lastName} />
        <DetailRow label="Type" value={<StatusBadge status={client.type} />} />
        <DetailRow label="Client Type" value={client.clientType} />
        <DetailRow label="Payment Type" value={client.defaultPaymentType} />
      </DetailCard>

      <DetailCard title="Actions">
        <div className="flex flex-wrap gap-2 mb-4">
          <ActionButton
            label="Upgrade to VIP"
            onClick={() =>
              upgrade.mutate(clientId!, {
                onSuccess: () => addNotification("Client upgraded to VIP", "success"),
              })
            }
            isPending={upgrade.isPending}
            disabled={client.type === "VIP"}
          />
          <ActionButton
            label="Downgrade"
            onClick={() =>
              downgrade.mutate(clientId!, {
                onSuccess: () => addNotification("Client downgraded", "success"),
              })
            }
            isPending={downgrade.isPending}
            disabled={client.type === "NORMAL"}
            variant="secondary"
          />
        </div>
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <SelectField
              label="Change Payment Type"
              value={paymentType}
              onChange={setPaymentType}
              options={[
                { value: "PRE_PAID", label: "Pre-paid" },
                { value: "POST_PAID", label: "Post-paid" },
                { value: "MONTHLY_INVOICE", label: "Monthly Invoice" },
              ]}
            />
          </div>
          <ActionButton
            label="Change"
            onClick={() => {
              if (paymentType) {
                changePayment.mutate(
                  { id: clientId!, data: { defaultPaymentType: paymentType as "PRE_PAID" | "POST_PAID" | "MONTHLY_INVOICE" } },
                  { onSuccess: () => addNotification("Payment type changed", "success") },
                );
              }
            }}
            isPending={changePayment.isPending}
            disabled={!paymentType}
          />
        </div>
      </DetailCard>

      <DetailCard title="Awards Account">
        {awards ? (
          <>
            <DetailRow label="Active" value={<StatusBadge status={awards.isActive ? "ACTIVE" : "INACTIVE"} />} />
            <DetailRow label="Transactions" value={awards.transactions} />
            <DetailRow label="Balance" value={balance ?? "-"} />
            <div className="mt-3 flex gap-2">
              <ActionButton
                label="Activate"
                onClick={() =>
                  activateAwards.mutate(clientId!, {
                    onSuccess: () => addNotification("Awards activated", "success"),
                  })
                }
                isPending={activateAwards.isPending}
                disabled={awards.isActive === true}
              />
              <ActionButton
                label="Deactivate"
                onClick={() =>
                  deactivateAwards.mutate(clientId!, {
                    onSuccess: () => addNotification("Awards deactivated", "success"),
                  })
                }
                isPending={deactivateAwards.isPending}
                disabled={awards.isActive === false}
                variant="secondary"
              />
            </div>
          </>
        ) : (
          <div>
            <p className="text-sm text-gray-500 mb-3">No awards account yet.</p>
            <ActionButton
              label="Create Awards Account"
              onClick={() =>
                createAwards.mutate(clientId!, {
                  onSuccess: () => addNotification("Awards account created", "success"),
                })
              }
              isPending={createAwards.isPending}
            />
          </div>
        )}
      </DetailCard>
    </div>
  );
}
