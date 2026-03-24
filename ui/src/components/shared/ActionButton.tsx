const VARIANT_CLASSES = {
  primary: "bg-blue-600 text-white hover:bg-blue-700",
  danger: "bg-red-600 text-white hover:bg-red-700",
  secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
};

interface ActionButtonProps {
  onClick: () => void;
  label: string;
  isPending?: boolean;
  disabled?: boolean;
  variant?: keyof typeof VARIANT_CLASSES;
}

export function ActionButton({
  onClick,
  label,
  isPending = false,
  disabled = false,
  variant = "primary",
}: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isPending}
      className={`px-4 py-1.5 border-none rounded-md text-sm mr-2 mb-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${VARIANT_CLASSES[variant]}`}
    >
      {isPending ? "..." : label}
    </button>
  );
}
