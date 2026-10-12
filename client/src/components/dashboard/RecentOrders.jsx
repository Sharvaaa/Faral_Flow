
import { recentOrders } from "../../data/orders";
import { FaClipboardList } from "react-icons/fa";

function RecentOrders() {
  return (
    <div className="recent-orders">
      <div className="recent-orders-toolbar">
        <div>
          <h3>Order activity</h3>
          <p>Your latest customer orders</p>
        </div>

        <span className="orders-count">
          {recentOrders.length} orders
        </span>
      </div>

      {recentOrders.length === 0 ? (
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
              {recentOrders.map((order, index) => {
                const statusClass = String(order.status || "")
                  .toLowerCase()
                  .trim();

                return (
                  <tr key={order.id ?? `${order.customer}-${index}`}>
                    <td>
                      <div className="customer-cell">
                        <div className="customer-avatar">
                          {String(order.customer || "?")
                            .trim()
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <span className="customer-name">
                          {order.customer || "Unknown customer"}
                        </span>
                      </div>
                    </td>

                    <td>{order.items}</td>

                    <td>
                      <span className={`status ${statusClass}`}>
                        <span className="status-dot" />
                        {order.status}
                      </span>
                    </td>

                    <td className="amount-cell">
                      <span className="order-amount">
                        {order.amount}
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