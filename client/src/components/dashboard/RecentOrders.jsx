const orders = [
  {
    customer: "Rahul",
    items: 3,
    status: "Pending",
    amount: "₹750",
  },
  {
    customer: "Priya",
    items: 5,
    status: "Packed",
    amount: "₹1400",
  },
  {
    customer: "Amit",
    items: 2,
    status: "Collected",
    amount: "₹450",
  },
];

function RecentOrders() {
  return (
    <div className="recent-orders">
      <h2>Recent Orders</h2>

      <table>

        <thead>
          <tr>
            <th>Customer</th>
            <th>Items</th>
            <th>Status</th>
            <th>Amount</th>
          </tr>
        </thead>

        <tbody>

          {orders.map((order, index) => (
            <tr key={index}>
              <td>{order.customer}</td>
              <td>{order.items}</td>
              <td>
                <span className={`status ${order.status.toLowerCase()}`}>
                    {order.status}
                </span>
             </td>
              <td>{order.amount}</td>
            </tr>
          ))}

        </tbody>

      </table>
    </div>
  );
}

export default RecentOrders;