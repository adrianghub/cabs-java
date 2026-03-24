import { useParams } from "react-router";
import { DetailCard, DetailRow } from "../../components/shared/DetailCard";
import { StatusBadge } from "../../components/shared/StatusBadge";
import { ActionButton } from "../../components/shared/ActionButton";
import { LoadingSpinner, ErrorAlert } from "../../components/shared/LoadingSpinner";
import {
  useContract,
  useAcceptContract,
  useRejectContract,
  useAcceptAttachment,
  useRejectAttachment,
  useRemoveAttachment,
} from "../../hooks/useContracts";
import { addNotification } from "../../stores/ui.store";

export function ContractDetailPage() {
  const { id } = useParams<{ id: string }>();
  const contractId = id ? Number(id) : null;
  const { data: contract, isLoading, error } = useContract(contractId);
  const acceptContract = useAcceptContract();
  const rejectContract = useRejectContract();
  const acceptAttachment = useAcceptAttachment();
  const rejectAttachment = useRejectAttachment();
  const removeAttachment = useRemoveAttachment();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message={String(error)} />;
  if (!contract) return <ErrorAlert message="Contract not found" />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Contract #{contract.id}</h1>

      <DetailCard title="Contract Information">
        <DetailRow label="Contract No" value={contract.contractNo} />
        <DetailRow label="Status" value={<StatusBadge status={contract.status} />} />
        <DetailRow label="Subject" value={contract.subject} />
        <DetailRow label="Partner" value={contract.partnerName} />
        <DetailRow label="Created" value={contract.creationDate} />
        <DetailRow label="Accepted" value={contract.acceptedAt} />
        <DetailRow label="Rejected" value={contract.rejectedAt} />
      </DetailCard>

      <DetailCard title="Contract Actions">
        <div className="flex gap-2">
          <ActionButton
            label="Accept Contract"
            onClick={() =>
              acceptContract.mutate(contractId!, {
                onSuccess: () => addNotification("Contract accepted", "success"),
              })
            }
            isPending={acceptContract.isPending}
            disabled={contract.status === "ACCEPTED"}
          />
          <ActionButton
            label="Reject Contract"
            onClick={() =>
              rejectContract.mutate(contractId!, {
                onSuccess: () => addNotification("Contract rejected", "info"),
              })
            }
            isPending={rejectContract.isPending}
            disabled={contract.status === "REJECTED"}
            variant="danger"
          />
        </div>
      </DetailCard>

      <DetailCard title="Attachments">
        {contract.attachments && contract.attachments.length > 0 ? (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 font-medium text-gray-600">ID</th>
                <th className="text-left py-2 font-medium text-gray-600">Status</th>
                <th className="text-left py-2 font-medium text-gray-600">Created</th>
                <th className="text-left py-2 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {contract.attachments.map((att) => (
                <tr key={att.id} className="border-b border-gray-100">
                  <td className="py-2">{att.id}</td>
                  <td className="py-2"><StatusBadge status={att.status} /></td>
                  <td className="py-2 text-gray-500">{att.creationDate ?? "-"}</td>
                  <td className="py-2">
                    <div className="flex gap-1">
                      <ActionButton
                        label="Accept"
                        onClick={() =>
                          acceptAttachment.mutate(
                            { contractId: contractId!, attachmentId: att.id! },
                            { onSuccess: () => addNotification("Attachment accepted", "success") },
                          )
                        }
                        isPending={acceptAttachment.isPending}
                      />
                      <ActionButton
                        label="Reject"
                        onClick={() =>
                          rejectAttachment.mutate(
                            { contractId: contractId!, attachmentId: att.id! },
                            { onSuccess: () => addNotification("Attachment rejected", "info") },
                          )
                        }
                        isPending={rejectAttachment.isPending}
                        variant="secondary"
                      />
                      <ActionButton
                        label="Remove"
                        onClick={() =>
                          removeAttachment.mutate(
                            { contractId: contractId!, attachmentId: att.id! },
                            { onSuccess: () => addNotification("Attachment removed", "success") },
                          )
                        }
                        isPending={removeAttachment.isPending}
                        variant="danger"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-sm text-gray-400 italic">No attachments.</p>
        )}
      </DetailCard>
    </div>
  );
}
