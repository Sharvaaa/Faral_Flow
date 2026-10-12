
import {
  FaBoxOpen,
  FaClipboardList,
  FaChartBar,
  FaWarehouse,
  FaTags,
} from "react-icons/fa";

import { NavLink } from "react-router-dom";

const menuItems = [
  {
    name: "Dashboard",
    icon: <FaChartBar />,
    path: "/dashboard",
  },
  {
    name: "Orders",
    icon: <FaClipboardList />,
    path: "/orders",
  },
  {
    name: "Inventory",
    icon: <FaWarehouse />,
    path: "/inventory",
  },
  {
    name: "Rate Card",
    icon: <FaTags />,
    path: "/ratecard",
  },
];

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="logo">
        <div className="logo-mark">
          <FaBoxOpen />
        </div>

        <div className="logo-copy">
          <h2>Faral Flow</h2>
          <p>Management System</p>
        </div>
      </div>

      <nav className="menu" aria-label="Main navigation">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              isActive ? "menu-item active" : "menu-item"
            }
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;