
import { FaClipboardList } from "react-icons/fa";

function RecentOrders({
  orders = [],
  loading = false,
  error = "",
  formatMoney = (amount) =>
    `₹${Number(amount || 0).toLocaleString("en-IN")}`,
}) {
  return (
    <div className="recent-orders">
      <div className="recent-orders-toolbar">
        <div>
          <h3>Order activity</h3>
          <p>Your latest customer orders</p>
        </div>

        <span className="orders-count">
          {loading ? "Loading…" : `${orders.length} orders`}
        </span>
      </div>

      {loading ? (
        <div className="orders-empty-state">
          <div className="orders-empty-icon">
            <FaClipboardList />
          </div>
          <h3>Loading recent orders</h3>
          <p>Fetching your latest orders from Supabase…</p>
        </div>
      ) : error ? (
        <div className="orders-empty-state">
          <div className="orders-empty-icon">
            <FaClipboardList />
          </div>
          <h3>Orders unavailable</h3>
          <p>Check the dashboard error message and try again.</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="orders-empty-state">
          <div className="orders-empty-icon">
            <FaClipboardList />
          </div>
          <h3>No orders yet</h3>
          <p>New customer orders will appear here.</p>
        </div>
      ) : (
        <div className="orders-table-wrap">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Items</th>
                <th>Status</th>
                <th className="amount-cell">Amount</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order, index) => {
                const status = order.status || "Pending";
                const statusClass = status.toLowerCase().trim();

                return (
                  <tr key={order.id || index}>
                    <td>
                      <div className="customer-cell">
                        <div className="customer-avatar">
                          {String(order.customerName || "?")
                            .trim()
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div>
                          <span className="customer-name">
                            {order.customerName || "Unknown customer"}
                          </span>

                          {order.phone && (
                            <p className="text-sm text-slate-500">
                              {order.phone}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    <td>
                      {order.itemCount}{" "}
                      {order.itemCount === 1 ? "item" : "items"}
                    </td>

                    <td>
                      <span className={`status ${statusClass}`}>
                        <span className="status-dot" />
                        {status}
                      </span>
                    </td>

                    <td className="amount-cell">
                      <span className="order-amount">
                        {formatMoney(order.grandTotal)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default RecentOrders;
