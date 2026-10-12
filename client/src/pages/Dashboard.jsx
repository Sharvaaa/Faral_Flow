
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
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <p className="dashboard-eyebrow">BUSINESS OVERVIEW</p>
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-description">
            Here's an overview of your Faral Flow business.
          </p>
        </div>

        <div className="dashboard-date-card">
          <span className="dashboard-date-dot" />
          <span>Business overview</span>
        </div>
      </header>

      <section className="dashboard-summary">
        <div className="dashboard-section-heading">
          <div>
            <h2>At a glance</h2>
            <p>Your key business numbers</p>
          </div>
        </div>

        <div className="stats-grid dashboard-stats">
          <StatCard
            title="Total Orders"
            value="24"
            icon={<FaClipboardList size={24} />}
          />

          <StatCard
            title="Pending Orders"
            value="7"
            icon={<FaClock size={24} />}
          />

          <StatCard
            title="Packed Orders"
            value="12"
            icon={<FaCheckCircle size={24} />}
          />

          <StatCard
            title="Revenue"
            value="₹28,500"
            icon={<FaIndianRupeeSign size={24} />}
          />
        </div>

        <p className="dashboard-data-note">
          These figures are sample values and will be replaced with
          live database totals during the dashboard integration.
        </p>
      </section>

      <section className="dashboard-orders-section">
        <div className="dashboard-section-heading">
          <div>
            <h2>Recent orders</h2>
            <p>Keep track of orders and their progress.</p>
          </div>
        </div>

        <RecentOrders />
      </section>
    </div>
  );
}

export default Dashboard;