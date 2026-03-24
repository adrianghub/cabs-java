import { NavLink } from "react-router";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard" },
  { to: "/clients", label: "Clients" },
  { to: "/drivers", label: "Drivers" },
  { to: "/transits", label: "Transits" },
  { to: "/claims", label: "Claims" },
  { to: "/contracts", label: "Contracts" },
  { to: "/car-types", label: "Car Types" },
];

export function Sidebar() {
  return (
    <nav className="w-56 min-h-screen bg-gray-800 py-4 shrink-0">
      <div className="px-4 pb-4 border-b border-gray-700 mb-2">
        <h1 className="text-white text-xl font-bold m-0">CABS</h1>
        <p className="text-gray-400 text-xs mt-1 mb-0">Cab Dispatch System</p>
      </div>
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === "/"}
          className={({ isActive }) =>
            `block px-4 py-2.5 text-sm no-underline border-l-3 ${
              isActive
                ? "text-white bg-gray-700 border-blue-600"
                : "text-gray-400 border-transparent hover:text-gray-200 hover:bg-gray-700/50"
            }`
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
