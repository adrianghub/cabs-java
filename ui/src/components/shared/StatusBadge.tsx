const STATUS_CLASSES: Record<string, string> = {
  ACTIVE: "bg-green-600",
  INACTIVE: "bg-gray-500",
  COMPLETED: "bg-blue-600",
  IN_TRANSIT: "bg-violet-600",
  TRANSIT_TO_PASSENGER: "bg-violet-500",
  WAITING_FOR_DRIVER_ASSIGNMENT: "bg-amber-600",
  DRIVER_ASSIGNMENT_FAILED: "bg-red-600",
  DRAFT: "bg-gray-400",
  CANCELLED: "bg-red-600",
  VIP: "bg-yellow-500",
  NORMAL: "bg-gray-500",
  ACCEPTED: "bg-green-600",
  REJECTED: "bg-red-600",
  NEGOTIATIONS_IN_PROGRESS: "bg-amber-600",
  NEW: "bg-blue-600",
  IN_PROCESS: "bg-violet-600",
  REFUNDED: "bg-green-600",
  ESCALATED: "bg-red-600",
  PROPOSED: "bg-amber-600",
  ACCEPTED_BY_ONE_SIDE: "bg-blue-600",
  ACCEPTED_BY_BOTH_SIDES: "bg-green-600",
  CANDIDATE: "bg-amber-600",
  REGULAR: "bg-blue-600",
};

export function StatusBadge({ status }: { status: string | null | undefined }) {
  if (!status) return null;

  const colorClass = STATUS_CLASSES[status] ?? "bg-gray-500";

  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold text-white ${colorClass}`}
    >
      {status}
    </span>
  );
}
