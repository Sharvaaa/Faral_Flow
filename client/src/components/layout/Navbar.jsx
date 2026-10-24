
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUserCircle,
  FaSignOutAlt,
  FaBars,
  FaChevronLeft,
} from "react-icons/fa";
import { supabase } from "../../services/supabase";

function Navbar({ onMenuClick, sidebarCollapsed }) {
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState("");

  async function handleLogout() {
    setLoggingOut(true);
    setError("");

    try {
      const { error: logoutError } = await supabase.auth.signOut();

      if (logoutError) throw logoutError;

      navigate("/login", { replace: true });
    } catch (err) {
      setError(err.message || "Unable to log out. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <header className="navbar">
      <div className="navbar-heading">
        <button
          type="button"
          className="navbar-menu-button"
          onClick={onMenuClick}
          aria-label="Toggle navigation"
          title="Toggle navigation"
        >
          <FaBars />
        </button>

        <div className="navbar-title-wrap">
          <h2>Faral Management System</h2>
          <p>Manage orders, stock and customer pickups</p>
        </div>
      </div>

      <div className="profile">
        <div className="profile-identity">
          <FaUserCircle size={30} />
          <span>Admin</span>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="logout-button"
        >
          <FaSignOutAlt />
          <span>{loggingOut ? "Logging out..." : "Logout"}</span>
        </button>
      </div>

      {error && (
        <p role="alert" className="navbar-error">
          {error}
        </p>
      )}
    </header>
  );
}

export default Navbar;
