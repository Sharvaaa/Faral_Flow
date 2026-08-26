import OrderRow from "./OrderRow";

function OrderItemsTable({ items, onRemove }) {
  const grandTotal = items.reduce(
    (total, item) => total + item.total,
    0
  );

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="border-t mt-8 pt-6">
      <h3 className="text-lg font-semibold mb-4">
        Order Items
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b text-left">
              <th className="py-3">Product</th>
              <th className="py-3">Packets</th>
              <th className="py-3">Packet Size</th>
              <th className="py-3">Price</th>
              <th className="py-3">Total</th>
              <th className="py-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {items.map((item, index) => (
              <OrderRow
                key={index}
                item={item}
                index={index}
                onRemove={onRemove}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mt-6">
        <div className="text-xl font-semibold">
          Grand Total: ₹{grandTotal.toFixed(2)}
        </div>
      </div>
    </div>
  );
}

export default OrderItemsTable;