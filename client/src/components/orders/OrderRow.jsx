
import { useState } from "react";

function OrderRow({
  order,
  onEdit,
  onDelete,
  onStatusChange,
  onRecordCollection,
}) {
  const [collectedPackets, setCollectedPackets] = useState({});

  if (!order) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-5 mb-4">
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
          className="px-3 py-2 rounded-lg text-sm font-medium border"
        >
          <option value="Pending">Pending</option>
          <option value="Packed">Packed</option>
          <option value="Collected">Collected</option>
        </select>
      </div>

      <div className="mt-5">
        <h4 className="font-semibold text-gray-700 mb-3">
          Items
        </h4>

        <div className="space-y-3">
          {order.items?.map((item, index) => {
            const itemKey = item.id || item.productId || index;

            const orderedPackets = Number(
              item.packetCount ?? 0
            );

            return (
              <div
                key={itemKey}
                className="border rounded-lg p-3"
              >
                <div className="flex justify-between items-center gap-3">
                  <p className="font-semibold text-gray-800">
                    {item.productName}
                  </p>

                  <p className="font-semibold text-gray-800">
                    ₹{Number(item.total || 0).toFixed(2)}
                  </p>
                </div>

                <div className="mt-1 text-sm text-gray-500">
                  <p>
                    Quantity:{" "}
                    <span className="font-medium text-gray-700">
                      {item.quantity ?? item.quantityInKg ?? "—"}{" "}
                      {item.unit || "kg"}
                    </span>
                  </p>

                  <p>
                    Rate: ₹{Number(item.price || 0).toFixed(2)}
                  </p>
                </div>

                <div className="mt-4 border-t pt-3">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Collection tracker
                  </p>

                  <p className="text-sm text-gray-500 mb-2">
                    Ordered packets: {orderedPackets}
                  </p>

                  <div className="flex flex-wrap items-end gap-3">
                    <label className="text-sm text-gray-700">
                      Packets collected
                      <input
                        type="number"
                        min="0"
                        max={orderedPackets}
                        step="1"
                        value={collectedPackets[itemKey] ?? ""}
                        onChange={(e) =>
                          setCollectedPackets((previous) => ({
                            ...previous,
                            [itemKey]: e.target.value,
                          }))
                        }
                        className="block w-32 border rounded-lg px-3 py-2 mt-1"
                      />
                    </label>

                    <button
                      type="button"
                      disabled={
                        !item.id ||
                        !Number.isInteger(
                          Number(collectedPackets[itemKey])
                        ) ||
                        collectedPackets[itemKey] === "" ||
                        Number(collectedPackets[itemKey]) < 0 ||
                        Number(collectedPackets[itemKey]) > orderedPackets ||
                        !onRecordCollection
                      }
                      onClick={() =>
                        onRecordCollection(
                          item.id,
                          Number(collectedPackets[itemKey])
                        )
                      }
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Record collection
                    </button>
                  </div>

                  {!item.id && (
                    <p className="text-xs text-amber-700 mt-2">
                      Collection will be enabled when this item is saved in the database.
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-between items-center mt-5 pt-4 border-t gap-3">
        <p className="font-semibold text-gray-800">
          Total: ₹{Number(order.grandTotal || 0).toFixed(2)}
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
