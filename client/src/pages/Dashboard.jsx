import StatCard from "../components/dashboard/StatCard";
import RecentOrders from "../components/dashboard/RecentOrders";

import {
  FaClipboardList,
  FaClock,
  FaCheckCircle,
} from "react-icons/fa";

import { FaIndianRupeeSign } from "react-icons/fa6";

function Dashboard() {
  return (
    <>
      <h1 className="dashboard-title">Dashboard</h1>

      <div className="stats-grid">
        <StatCard
          title="Total Orders"
          value="24"
          icon={<FaClipboardList size={30} />}
        />

        <StatCard
          title="Pending Orders"
          value="7"
          icon={<FaClock size={30} />}
        />

        <StatCard
          title="Packed Orders"
          value="12"
          icon={<FaCheckCircle size={30} />}
        />

        <StatCard
          title="Revenue"
          value="₹28,500"
          icon={<FaIndianRupeeSign size={30} />}
        />
      </div>

      <RecentOrders />
    </>
  );
}

export default Dashboard;