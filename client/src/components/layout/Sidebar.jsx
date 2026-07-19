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
    <div className="sidebar">
      <div className="logo">
        <FaBoxOpen size={28} />
        <h2>Faral</h2>
      </div>

      <div className="menu">
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
      </div>
    </div>
  );
}

export default Sidebar;