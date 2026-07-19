import { FaUserCircle } from "react-icons/fa";

function Navbar() {
  return (
    <div className="navbar">
      <h2>Faral Management System</h2>

      <div className="profile">
        <FaUserCircle size={32} />
        <span>Admin</span>
      </div>
    </div>
  );
}

export default Navbar;