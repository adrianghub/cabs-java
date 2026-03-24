import type { ReactNode } from "react";

interface DetailCardProps {
  title: string;
  children: ReactNode;
}

export function DetailCard({ title, children }: DetailCardProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 mb-4 bg-white">
      <h3 className="m-0 mb-3 text-base font-semibold">{title}</h3>
      {children}
    </div>
  );
}

interface DetailRowProps {
  label: string;
  value: ReactNode;
}

export function DetailRow({ label, value }: DetailRowProps) {
  return (
    <div className="flex py-1 border-b border-gray-100">
      <span className="font-semibold min-w-40 text-gray-500 text-sm">
        {label}
      </span>
      <span className="text-sm">{value ?? "-"}</span>
    </div>
  );
}
