
import { useState } from "react";

function OrderRow({
  order,
  serialNumber,
  formatMoney = (value) => `₹${Number(value || 0).toFixed(2)}`,
  onEdit,
  onDelete,
  onStatusChange,
  onMarkCollected,
  busy = false,
}) {
  const [expanded, setExpanded] = useState(false);

  if (!order) return null;

  const items = order.items || [];
  const isCollected = order.status === "Collected";
  const status = order.status || "Pending";

  const orderDate = order.orderDate
    ? new Date(`${order.orderDate}T00:00:00`).toLocaleDateString("en-IN")
    : "—";

  const pickupDate = order.pickupDate
    ? new Date(`${order.pickupDate}T00:00:00`).toLocaleDateString("en-IN")
    : "—";

  const shortOrderId = order.id
    ? order.id.slice(0, 8).toUpperCase()
    : "—";

  const statusClass = {
    Pending: "orders-status-pending",
    Packed: "orders-status-packed",
    Collected: "orders-status-collected",
  }[status] || "orders-status-default";

  const getPackets = (item) =>
    Number(item.packetCount ?? item.packet_count ?? 0);

  const getWeight = (item) =>
    Number(
      item.quantityInKg ??
        item.quantity ??
        item.total_weight_kg ??
        (getPackets(item) *
          Number(item.packetSize ?? item.packet_size_grams ?? 250)) /
          1000
    );

  const getLineTotal = (item) =>
    Number(item.total ?? item.line_total ?? 0);

  return (
    <>
      <tr className="faral-order-row">
        <td>
          <div className="orders-id-cell">
            <button
              type="button"
              className="orders-serial-button"
              onClick={() => setExpanded((value) => !value)}
              aria-expanded={expanded}
              aria-label={`${expanded ? "Hide" : "View"} order ${serialNumber} details`}
            >
              {String(serialNumber || 1).padStart(2, "0")}
            </button>

            <div className="orders-id-copy">
              <span className="orders-id-label">ORDER ID</span>
              <span className="orders-id-value" title={order.id || ""}>
                {shortOrderId}
              </span>
            </div>
          </div>
        </td>

        <td>
          <div className="orders-customer-cell">
            <div className="orders-customer-avatar" aria-hidden="true">
              {(order.customerName || "?").trim().charAt(0).toUpperCase()}
            </div>

            <div className="orders-customer-copy">
              <p className="orders-customer-name">
                {order.customerName || "Unnamed customer"}
              </p>
              <p className="orders-customer-phone">
                {order.phone || "No phone number"}
              </p>
            </div>
          </div>
        </td>

        <td>
          <div className="orders-items-cell">
            {items.length === 0 ? (
              <span className="orders-muted">No items</span>
            ) : (
              items.map((item, index) => {
                const packets = getPackets(item);
                const weight = getWeight(item);
                const itemKey =
                  item.id || item.productId || item.product_id || index;
                const itemTotal = getLineTotal(item);

                return (
                  <div className="orders-item-line" key={itemKey}>
                    <p className="orders-item-name">
                      {item.productName ||
                        item.product_name_snapshot ||
                        item.product_name ||
                        "Product"}
                    </p>

                    <p className="orders-item-meta">
                      {Number.isFinite(weight) ? `${weight} kg` : "—"}
                      <span className="orders-meta-dot">·</span>
                      {packets} {packets === 1 ? "packet" : "packets"}
                    </p>

                    <div className="orders-item-prices">
                      <span>Combined-weight price</span>
                      <strong>{formatMoney(itemTotal)}</strong>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </td>

        <td className="orders-total-cell">
          <strong>{formatMoney(order.grandTotal)}</strong>
          <span>
            {items.length} {items.length === 1 ? "product" : "products"}
          </span>
        </td>

        <td>
          <div className="orders-status-cell">
            <span className={`orders-status ${statusClass}`}>
              <span className="orders-status-dot" />
              {status}
            </span>

            <label className="orders-status-select-label">
              <span className="sr-only">Change order status</span>
              <select
                aria-label={`Status for ${order.customerName || "order"}`}
                value={status}
                disabled={isCollected || busy}
                onChange={(event) =>
                  onStatusChange?.(order.id, event.target.value)
                }
                className="orders-status-select"
              >
                <option value="Pending">Pending</option>
                <option value="Packed">Packed</option>
              </select>
            </label>
          </div>
        </td>

        <td>
          <div className="orders-actions">
            <button
              type="button"
              onClick={() => setExpanded((value) => !value)}
              className="orders-action-button orders-action-view"
              aria-expanded={expanded}
            >
              {expanded ? "Hide details" : "View details"}
            </button>

            <button
              type="button"
              onClick={() => onEdit?.(order)}
              disabled={isCollected || busy}
              className="orders-action-button orders-action-edit"
            >
              Edit
            </button>

            <button
              type="button"
              onClick={() => onDelete?.(order.id)}
              disabled={isCollected || busy}
              className="orders-action-button orders-action-delete"
            >
              Delete
            </button>
          </div>
        </td>
      </tr>

      {expanded && (
        <tr className="orders-expanded-row">
          <td colSpan={6}>
            <div className="orders-expanded-grid">
              <section className="orders-detail-panel">
                <div className="orders-detail-heading">
                  <div className="orders-detail-icon orders-detail-icon-orange">
                    #
                  </div>
                  <div>
                    <h3>Order details</h3>
                    <p>Customer reference and pickup schedule</p>
                  </div>
                </div>

                <dl className="orders-detail-list">
                  <div>
                    <dt>Customer</dt>
                    <dd>{order.customerName || "—"}</dd>
                  </div>
                  <div>
                    <dt>Phone</dt>
                    <dd>{order.phone || "—"}</dd>
                  </div>
                  <div>
                    <dt>Order date</dt>
                    <dd>{orderDate}</dd>
                  </div>
                  <div>
                    <dt>Pickup date</dt>
                    <dd>{pickupDate}</dd>
                  </div>
                  <div className="orders-full-id">
                    <dt>Full order ID</dt>
                    <dd>{order.id || "—"}</dd>
                  </div>
                </dl>
              </section>

              <section className="orders-detail-panel">
                <div className="orders-detail-heading">
                  <div className="orders-detail-icon orders-detail-icon-green">
                    ✓
                  </div>
                  <div>
                    <h3>Order collection</h3>
                    <p>Confirm the customer collected the complete order.</p>
                  </div>
                </div>

                <div className="orders-collection-list">
                  <p>
                    {items.length}{" "}
                    {items.length === 1 ? "product" : "products"} ·{" "}
                    {items.reduce((sum, item) => sum + getPackets(item), 0)}{" "}
                    packets in this order
                  </p>

                  {isCollected ? (
                    <p className="orders-complete-badge">
                      Entire order collected
                    </p>
                  ) : status === "Packed" ? (
                    <>
                      <p>
                        Confirm only when the customer has collected every
                        item and packet.
                      </p>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => onMarkCollected?.(order.id)}
                        className="orders-record-button"
                      >
                        {busy
                          ? "Updating..."
                          : "Mark Entire Order Collected"}
                      </button>
                    </>
                  ) : (
                    <p className="orders-collection-note">
                      Mark the order as Packed before confirming collection.
                    </p>
                  )}
                </div>
              </section>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export default OrderRow;
