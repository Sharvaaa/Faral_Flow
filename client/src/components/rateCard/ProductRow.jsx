import { Pencil, Trash2 } from "lucide-react";

function ProductRow({ product }) {
  return (
    <tr className="border-t hover:bg-gray-50">
      <td className="p-3">{product.name}</td>

      <td className="p-3">{product.unit}</td>

      <td className="p-3">₹{product.retailPrice}</td>

      <td className="p-3">₹{product.wholesalePrice}</td>

      <td className="p-3">
        <div className="flex justify-center gap-3">
          <button>
            <Pencil size={18} />
          </button>

          <button>
            <Trash2 size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default ProductRow;