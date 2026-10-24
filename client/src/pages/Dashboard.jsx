
import { useCallback, useEffect, useState } from "react";

import StatCard from "../components/dashboard/StatCard";
import RecentOrders from "../components/dashboard/RecentOrders";
import { supabase } from "../services/supabase";

import {
  FaClipboardList,
  FaClock,
  FaCheckCircle,
} from "react-icons/fa";

import { FaIndianRupeeSign } from "react-icons/fa6";

function Dashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    packedOrders: 0,
    orderValue: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [
        { data: orderRows, error: ordersError },
        { data: itemRows, error: itemsError },
      ] = await Promise.all([
        supabase
          .from("orders")
          .select("id, customer_name, phone, status, grand_total, created_at")
          .order("created_at", { ascending: false }),

        supabase
          .from("order_items")
          .select("order_id"),
      ]);

      if (ordersError) throw ordersError;
      if (itemsError) throw itemsError;

      const orders = orderRows || [];
      const items = itemRows || [];

      const orderItemCounts = items.reduce((counts, item) => {
        counts[item.order_id] = (counts[item.order_id] || 0) + 1;
        return counts;
      }, {});

      const orderValue = orders.reduce(
        (total, order) => total + Number(order.grand_total || 0),
        0
      );

      setStats({
        totalOrders: orders.length,
        pendingOrders: orders.filter(
          (order) => order.status === "Pending"
        ).length,
        packedOrders: orders.filter(
          (order) => order.status === "Packed"
        ).length,
        orderValue,
      });

      setRecentOrders(
        orders.slice(0, 3).map((order) => ({
          id: order.id,
          customerName: order.customer_name || "Unnamed customer",
          phone: order.phone || "",
          status: order.status || "Pending",
          grandTotal: Number(order.grand_total || 0),
          itemCount: orderItemCounts[order.id] || 0,
          createdAt: order.created_at,
        }))
      );
    } catch (err) {
      console.error("Failed to load dashboard:", err);
      setError(err.message || "Unable to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const formatMoney = (amount) =>
    `₹${Number(amount || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`;

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

        {error && (
          <div
            role="alert"
            className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            <p className="font-semibold">Dashboard data couldn't load.</p>
            <p className="mt-1">{error}</p>
            <button
              type="button"
              onClick={fetchDashboardData}
              className="mt-3 rounded-lg bg-white px-3 py-2 font-semibold text-red-700 ring-1 ring-red-200 hover:bg-red-100"
            >
              Try again
            </button>
          </div>
        )}

        <div className="stats-grid dashboard-stats">
          <StatCard
            title="Total Orders"
            value={loading ? "…" : String(stats.totalOrders)}
            icon={<FaClipboardList size={24} />}
          />

          <StatCard
            title="Pending Orders"
            value={loading ? "…" : String(stats.pendingOrders)}
            icon={<FaClock size={24} />}
          />

          <StatCard
            title="Packed Orders"
            value={loading ? "…" : String(stats.packedOrders)}
            icon={<FaCheckCircle size={24} />}
          />

          <StatCard
            title="Order Value"
            value={loading ? "…" : formatMoney(stats.orderValue)}
            icon={<FaIndianRupeeSign size={24} />}
          />
        </div>

        <p className="dashboard-data-note">
          {loading
            ? "Loading live data from Supabase…"
            : "Statistics are based on your current orders in Supabase. Order value is not the same as money collected."}
        </p>
      </section>

      <section className="dashboard-orders-section">
        <div className="dashboard-section-heading">
          <div>
            <h2>Recent orders</h2>
            <p>Keep track of your latest customer orders.</p>
          </div>
        </div>

        <RecentOrders
          orders={recentOrders}
          loading={loading}
          error={error}
          formatMoney={formatMoney}
        />
      </section>
    </div>
  );
}

export default Dashboard;
