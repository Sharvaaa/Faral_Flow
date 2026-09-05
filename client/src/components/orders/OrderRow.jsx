function OrderRow({ order, onEdit, onDelete, onStatusChange }) {
  if (!order) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-5 mb-4">
      {/* Header */}
      <div className="flex justify-between items-start gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            {order.customerName}
          </h3>

          <p className="text-sm text-gray-500 break-all">
            Order ID: {order.id}
          </p>
        </div>

        <select
          value={order.status}
          onChange={(e) =>
            onStatusChange(order.id, e.target.value)
          }
          className={`px-3 py-2 rounded-lg text-sm font-medium border ${
            order.status === "Pending"
              ? "bg-yellow-100 text-yellow-700 border-yellow-300"
              : order.status === "Packed"
              ? "bg-blue-100 text-blue-700 border-blue-300"
              : "bg-green-100 text-green-700 border-green-300"
          }`}
        >
          <option value="Pending">Pending</option>
          <option value="Packed">Packed</option>
          <option value="Collected">Collected</option>
        </select>
      </div>

      {/* Items */}
      <div className="mt-5">
        <h4 className="font-semibold text-gray-700 mb-3">
          Items
        </h4>

        <div className="space-y-3">
          {order.items?.map((item, index) => (
            <div
              key={item.productId || index}
              className="border rounded-lg p-3"
            >
              <div className="flex justify-between items-center">
                <p className="font-semibold text-gray-800">
                  {item.productName}
                </p>

                <p className="font-semibold text-gray-800">
                  ₹{item.total}
                </p>
              </div>

              <div className="mt-1 text-sm text-gray-500">
                <p>
                  Quantity:{" "}
                  <span className="font-medium text-gray-700">
                    {item.quantity} {item.unit}
                  </span>
                </p>

                <p>
                  Rate: ₹{item.price} per {item.unit}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center mt-5 pt-4 border-t">
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