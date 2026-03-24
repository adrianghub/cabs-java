import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { useStore } from "@tanstack/react-store";
import { uiStore, removeNotification } from "../../stores/ui.store";

export function AppLayout({ children }: { children: ReactNode }) {
  const notifications = useStore(uiStore, (s) => s.notifications);

  return (
    <div className="flex min-h-screen font-sans">
      <Sidebar />
      <main className="flex-1 p-6 bg-gray-50">
        {notifications.length > 0 && (
          <div className="fixed top-4 right-4 z-50">
            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => removeNotification(n.id)}
                className={`px-4 py-3 mb-2 rounded-md cursor-pointer text-white text-sm shadow-lg ${
                  n.type === "error"
                    ? "bg-red-600"
                    : n.type === "success"
                      ? "bg-green-600"
                      : "bg-blue-600"
                }`}
              >
                {n.message}
              </div>
            ))}
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
