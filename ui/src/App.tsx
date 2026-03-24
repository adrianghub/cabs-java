import { Routes, Route } from "react-router";
import { AppLayout } from "./components/layout/AppLayout";
import { DashboardPage } from "./pages/DashboardPage";
import { ClientsPage } from "./pages/clients/ClientsPage";
import { ClientDetailPage } from "./pages/clients/ClientDetailPage";
import { DriversPage } from "./pages/drivers/DriversPage";
import { DriverDetailPage } from "./pages/drivers/DriverDetailPage";
import { TransitsPage } from "./pages/transits/TransitsPage";
import { TransitDetailPage } from "./pages/transits/TransitDetailPage";
import { ClaimsPage } from "./pages/claims/ClaimsPage";
import { ClaimDetailPage } from "./pages/claims/ClaimDetailPage";
import { ContractsPage } from "./pages/contracts/ContractsPage";
import { ContractDetailPage } from "./pages/contracts/ContractDetailPage";
import { CarTypesPage } from "./pages/carTypes/CarTypesPage";
import { CarTypeDetailPage } from "./pages/carTypes/CarTypeDetailPage";

export function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/clients" element={<ClientsPage />} />
        <Route path="/clients/:id" element={<ClientDetailPage />} />
        <Route path="/drivers" element={<DriversPage />} />
        <Route path="/drivers/:id" element={<DriverDetailPage />} />
        <Route path="/transits" element={<TransitsPage />} />
        <Route path="/transits/:id" element={<TransitDetailPage />} />
        <Route path="/claims" element={<ClaimsPage />} />
        <Route path="/claims/:id" element={<ClaimDetailPage />} />
        <Route path="/contracts" element={<ContractsPage />} />
        <Route path="/contracts/:id" element={<ContractDetailPage />} />
        <Route path="/car-types" element={<CarTypesPage />} />
        <Route path="/car-types/:id" element={<CarTypeDetailPage />} />
      </Routes>
    </AppLayout>
  );
}
