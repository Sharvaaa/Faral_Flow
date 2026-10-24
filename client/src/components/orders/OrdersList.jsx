
import OrderRow from "./OrderRow";

function OrdersList({
  orders,
  onEdit,
  onDelete,
  onStatusChange,
  onMarkCollected,
  actionOrderId,
}) {
  const formatMoney = (value) =>
    `₹${Number(value || 0).toFixed(2)}`;

  return (
    <section className="orders-list-section">
      <div className="orders-section-heading">
        <div>
          <p className="orders-eyebrow">ORDER OVERVIEW</p>
          <h2>All Orders</h2>
          <p>
            Review orders and mark the entire order collected at pickup.
          </p>
        </div>

        <div className="orders-count-card">
          <span className="orders-count-number">
            {orders.length}
          </span>
          <span>
            {orders.length === 1
              ? "Matching order"
              : "Matching orders"}
          </span>
        </div>
      </div>

      <div className="orders-page-card orders-table-card">
        <div className="orders-table-toolbar">
          <div>
            <h3>Order records</h3>
            <p>View each order and its item-level details.</p>
          </div>

          <span className="orders-count-pill">
            {orders.length}{" "}
            {orders.length === 1 ? "order" : "orders"}
          </span>
        </div>

        {orders.length === 0 ? (
          <div className="orders-empty px-4 py-10 text-center">
            <div className="orders-empty-icon">⌕</div>
            <h3>No orders found</h3>
            <p>
              No orders match your search. Try another customer
              name or clear the search above.
            </p>
          </div>
        ) : (
          <>
            <div className="orders-table-scroll">
              <table className="faral-orders-table">
                <thead>
                  <tr>
                    <th>Sr. No. / Order ID</th>
                    <th>Customer</th>
                    <th>Order items</th>
                    <th className="orders-amount-heading">
                      Order total
                    </th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map((order, index) => (
                    <OrderRow
                      key={order?.id || index}
                      order={order}
                      serialNumber={index + 1}
                      formatMoney={formatMoney}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onStatusChange={onStatusChange}
                      onMarkCollected={onMarkCollected}
                      busy={actionOrderId === order?.id}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            <footer className="orders-table-footer">
              <span>Showing</span>
              <strong>{orders.length}</strong>
              <span>
                {orders.length === 1 ? "order" : "orders"}
              </span>
            </footer>
          </>
        )}
      </div>
    </section>
  );
}

export default OrdersList;
