import { useState } from "react";
import InventoryTable from "../components/inventory/InventoryTable";
import inventoryItems from "../data/inventoryItems";

function Inventory() {
  const [inventory, setInventory] = useState(inventoryItems);

  const increaseStock = (id) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, stock: item.stock + 1 }
          : item
      )
    );
  };

  const decreaseStock = (id) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              stock: Math.max(0, item.stock - 1),
            }
          : item
      )
    );
  };

  const editStock = (item) => {
    const value = prompt(
      `Enter new stock for ${item.name}`,
      item.stock
    );

    if (value === null) return;

    const newStock = Number(value);

    if (isNaN(newStock) || newStock < 0) return;

    setInventory((prev) =>
      prev.map((product) =>
        product.id === item.id
          ? {
              ...product,
              stock: newStock,
            }
          : product
      )
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        Inventory
      </h1>

      <InventoryTable
        inventory={inventory}
        increaseStock={increaseStock}
        decreaseStock={decreaseStock}
        editStock={editStock}
      />
    </div>
  );
}

export default Inventory;