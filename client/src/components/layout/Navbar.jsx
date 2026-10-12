
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { supabase } from "../../services/supabase";

function Navbar() {
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState("");

  async function handleLogout() {
    setLoggingOut(true);
    setError("");

    try {
      const { error: logoutError } = await supabase.auth.signOut();

      if (logoutError) {
        throw logoutError;
      }

      navigate("/login", { replace: true });
    } catch (err) {
      setError(err.message || "Unable to log out. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <div className="navbar">
      <h2>Faral Management System</h2>

      <div className="profile">
        <FaUserCircle size={32} />
        <span>Admin</span>

        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="ml-4 flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-100 disabled:opacity-60"
        >
          <FaSignOutAlt />
          {loggingOut ? "Logging out..." : "Logout"}
        </button>
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

export default Navbar;