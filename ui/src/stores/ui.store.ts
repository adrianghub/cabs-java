import { Store } from "@tanstack/store";

interface Notification {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

interface UiState {
  sidebarOpen: boolean;
  notifications: Notification[];
}

export const uiStore = new Store<UiState>({
  sidebarOpen: true,
  notifications: [],
});

export function toggleSidebar() {
  uiStore.setState((prev) => ({ ...prev, sidebarOpen: !prev.sidebarOpen }));
}

export function addNotification(
  message: string,
  type: Notification["type"] = "info",
) {
  const id = crypto.randomUUID();
  uiStore.setState((prev) => ({
    ...prev,
    notifications: [...prev.notifications, { id, message, type }],
  }));
  setTimeout(() => removeNotification(id), 5000);
}

export function removeNotification(id: string) {
  uiStore.setState((prev) => ({
    ...prev,
    notifications: prev.notifications.filter((n) => n.id !== id),
  }));
}
