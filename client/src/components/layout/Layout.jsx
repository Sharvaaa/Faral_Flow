
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function Layout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    if (window.innerWidth <= 768) {
      setMobileSidebarOpen((open) => !open);
    } else {
      setSidebarCollapsed((collapsed) => !collapsed);
    }
  };

  const closeMobileSidebar = () => setMobileSidebarOpen(false);

  return (
    <div
      className={[
        "layout",
        sidebarCollapsed ? "sidebar-collapsed" : "",
        mobileSidebarOpen ? "mobile-sidebar-open" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {mobileSidebarOpen && (
        <button
          type="button"
          className="sidebar-overlay"
          aria-label="Close navigation menu"
          onClick={closeMobileSidebar}
        />
      )}

      <Sidebar
        collapsed={sidebarCollapsed}
        mobileOpen={mobileSidebarOpen}
        onToggle={toggleSidebar}
        onNavigate={closeMobileSidebar}
      />

      <div className="main">
        <Navbar
          onMenuClick={toggleSidebar}
          sidebarCollapsed={sidebarCollapsed}
        />

        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
