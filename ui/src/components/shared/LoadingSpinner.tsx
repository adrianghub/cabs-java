export function LoadingSpinner() {
  return (
    <div className="p-6 text-center text-gray-500">Loading...</div>
  );
}

export function ErrorAlert({ message }: { message: string }) {
  return (
    <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-md text-red-600 mb-4 text-sm">
      {message}
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="p-6 text-center text-gray-400 italic text-sm">
      {message}
    </div>
  );
}
