function OrdersList({ orders }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-6">
        Orders
      </h2>

      {orders.length === 0 ? (
        <p className="text-gray-500">
          No orders yet.
        </p>
      ) : (
        <p className="text-gray-600">
          {orders.length} order(s) found.
        </p>
      )}
    </div>
  );
}

export default OrdersList;