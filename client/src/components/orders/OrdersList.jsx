import OrderRow from "./OrderRow";

function OrdersList({
  orders,
  onEdit,
  onDelete,
  onStatusChange,
}) {
  if (!orders || orders.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
        No orders found.
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Orders
      </h2>

      {orders.map((order, index) => (
        <OrderRow
          key={order?.id || index}
          order={order}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
}

export default OrdersList;