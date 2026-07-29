import InventoryRow from "./InventoryRow";

function InventoryTable({
  inventory,
  increaseStock,
  decreaseStock,
  editStock,
}) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left px-5 py-3">Product</th>
            <th className="text-left px-5 py-3">Stock</th>
            <th className="text-left px-5 py-3">Status</th>
            <th className="text-left px-5 py-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {inventory.map((item) => (
            <InventoryRow
              key={item.id}
              item={item}
              increaseStock={increaseStock}
              decreaseStock={decreaseStock}
              editStock={editStock}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default InventoryTable;
