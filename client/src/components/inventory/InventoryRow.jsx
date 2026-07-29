import { Plus, Minus, Pencil } from "lucide-react";

function InventoryRow({
  item,
  increaseStock,
  decreaseStock,
  editStock,
}) {
  const getStatus = () => {
    if (item.stock === 0)
      return {
        text: "Out of Stock",
        color: "bg-red-100 text-red-600",
      };

    if (item.stock <= 5)
      return {
        text: "Low Stock",
        color: "bg-yellow-100 text-yellow-700",
      };

    return {
      text: "Healthy",
      color: "bg-green-100 text-green-700",
    };
  };

  const status = getStatus();

  return (
    <tr className="border-t">
      <td className="px-5 py-4">{item.name}</td>

      <td className="px-5 py-4">
        {item.stock} {item.unit}
      </td>

      <td className="px-5 py-4">
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${status.color}`}
        >
          {status.text}
        </span>
      </td>

      <td className="px-5 py-4">
        <div className="flex gap-2">
          <button
            onClick={() => increaseStock(item.id)}
            className="p-2 rounded bg-green-100 hover:bg-green-200"
          >
            <Plus size={18} />
          </button>

          <button
            onClick={() => decreaseStock(item.id)}
            className="p-2 rounded bg-yellow-100 hover:bg-yellow-200"
          >
            <Minus size={18} />
          </button>

          <button
            onClick={() => editStock(item)}
            className="p-2 rounded bg-blue-100 hover:bg-blue-200"
          >
            <Pencil size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default InventoryRow;