
import {
  FaBoxOpen,
  FaClipboardList,
  FaChartBar,
  FaWarehouse,
  FaTags,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";

const menuItems = [
  { name: "Dashboard", icon: <FaChartBar />, path: "/dashboard" },
  { name: "Orders", icon: <FaClipboardList />, path: "/orders" },
  { name: "Inventory", icon: <FaWarehouse />, path: "/inventory" },
  { name: "Rate Card", icon: <FaTags />, path: "/ratecard" },
];

function Sidebar({
  collapsed,
  mobileOpen,
  onToggle,
  onNavigate,
}) {
  return (
    <aside
      className={[
        "sidebar",
        collapsed ? "sidebar-compact" : "",
        mobileOpen ? "sidebar-mobile-open" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      aria-label="Main sidebar"
    >
      <div className="sidebar-top">
        <div className="logo">
          <div className="logo-mark">
            <FaBoxOpen />
          </div>

          {!collapsed && (
            <div className="logo-copy">
              <h2>Faral Flow</h2>
              <p>Management System</p>
            </div>
          )}
        </div>

        <button
          type="button"
          className="sidebar-toggle"
          onClick={onToggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
        </button>
      </div>

      <nav className="menu" aria-label="Main navigation">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === "/dashboard"}
            title={collapsed ? item.name : undefined}
            onClick={onNavigate}
            className={({ isActive }) =>
              isActive ? "menu-item active" : "menu-item"
            }
          >
            {item.icon}
            {!collapsed && <span>{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        {!collapsed && <span>Faral Flow · Admin</span>}
      </div>
    </aside>
  );
}

export default Sidebar;
