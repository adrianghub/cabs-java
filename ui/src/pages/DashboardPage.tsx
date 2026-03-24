import { Link } from "react-router";

export function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">CABS - Cab Dispatch System</h1>
      <p className="text-gray-500 mb-6">
        A learning project for exploring backend architecture layer by layer.
        Use this UI to interact with the Spring Boot REST API and see how data
        flows through Controllers, Services, Repositories, and Entities.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <DashboardCard
          title="Clients"
          description="Register clients, manage VIP status, and configure payment types. Explore Client entity lifecycle."
          link="/clients"
        />
        <DashboardCard
          title="Drivers"
          description="Create drivers, manage their active status, sessions, and view detailed reports."
          link="/drivers"
        />
        <DashboardCard
          title="Transits"
          description="The core flow: create transits, publish, find drivers, accept, start, and complete rides. Visualize the full state machine."
          link="/transits"
        />
        <DashboardCard
          title="Claims"
          description="File claims against transits. See draft/send/process workflow and automatic resolution."
          link="/claims"
        />
        <DashboardCard
          title="Contracts"
          description="Manage partner contracts with attachment workflow (propose, accept, reject)."
          link="/contracts"
        />
        <DashboardCard
          title="Car Types"
          description="Define car classes (ECO, REGULAR, VAN, PREMIUM), register cars, and manage activation thresholds."
          link="/car-types"
        />
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="m-0 mb-2 text-sm font-semibold">Getting Started</h3>
        <ol className="m-0 pl-5 text-sm text-gray-700 space-y-1">
          <li>Start the backend: <code className="bg-blue-100 px-1 rounded">mvn spring-boot:run</code> from the project root</li>
          <li>Browse the API docs at <a href="http://localhost:8080/swagger-ui.html" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Swagger UI</a></li>
          <li>Create a <Link to="/clients" className="text-blue-600 hover:underline">Client</Link> and a <Link to="/drivers" className="text-blue-600 hover:underline">Driver</Link></li>
          <li>Set up <Link to="/car-types" className="text-blue-600 hover:underline">Car Types</Link> and register cars</li>
          <li>Create a <Link to="/transits" className="text-blue-600 hover:underline">Transit</Link> and walk through the full ride lifecycle</li>
        </ol>
      </div>
    </div>
  );
}

function DashboardCard({
  title,
  description,
  link,
}: {
  title: string;
  description: string;
  link: string;
}) {
  return (
    <Link
      to={link}
      className="block p-5 bg-white border border-gray-200 rounded-lg no-underline text-inherit hover:border-blue-600 hover:shadow-sm transition-all"
    >
      <h3 className="m-0 mb-2 text-base font-semibold text-gray-800">
        {title}
      </h3>
      <p className="m-0 text-sm text-gray-500">{description}</p>
    </Link>
  );
}
