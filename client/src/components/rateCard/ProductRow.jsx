import { Pencil, Trash2 } from "lucide-react";

function ProductRow({ product, deleteProduct, editProduct }) {
  return (
    <tr className="border-t hover:bg-gray-50">
      <td className="p-3">{product.name}</td>

      <td className="p-3">{product.unit}</td>

      <td className="p-3">₹{product.retailPrice}</td>

      <td className="p-3">₹{product.wholesalePrice}</td>

      <td className="p-3">
        <div className="flex justify-center gap-3">
          <button
            onClick={() => editProduct(product)}
            className="text-blue-600 hover:text-blue-800"
          >
            <Pencil size={18} />
          </button>

          <button
            onClick={() => deleteProduct(product.id)}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default ProductRow;