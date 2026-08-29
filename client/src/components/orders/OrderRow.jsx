function OrderRow({ order, onEdit, onDelete, onStatusChange }) {
  if (!order) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-5 mb-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            {order.customerName}
          </h3>

          <p className="text-sm text-gray-500">
            Order ID: {order.id}
          </p>
        </div>

        <select
          value={order.status}
          onChange={(e) =>
            onStatusChange(order.id, e.target.value)
          }
          className="px-3 py-1 rounded-full text-sm font-medium border"
        >
          <option value="Pending">Pending</option>
          <option value="Packed">Packed</option>
          <option value="Collected">Collected</option>
        </select>
      </div>

      <div className="mt-4">
        <h4 className="font-medium text-gray-700 mb-2">
          Items
        </h4>

        {order.items?.map((item, index) => (
          <div
            key={item.id || index}
            className="flex justify-between text-sm border-b py-2"
          >
            <span>
              {item.productName} × {item.packetCount}
            </span>

            <span>₹{item.total}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-4">
        <p className="font-semibold text-gray-800">
          Total: ₹{order.grandTotal}
        </p>

        <div className="flex gap-2">
          <button
            onClick={() => onEdit(order)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Edit
          </button>

          <button
            onClick={() => onDelete(order.id)}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderRow;