import InventoryTable from "../components/inventory/InventoryTable";

function Inventory({ inventory, setInventory }) {
  // --------------------------------------------------
  // STOCK STATUS
  // --------------------------------------------------

  // --------------------------------------------------
  // INCREASE STOCK
  // --------------------------------------------------

  const increaseStock = (id) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              stock: item.stock + 1,
            }
          : item
      )
    );
  };

  // --------------------------------------------------
  // DECREASE STOCK
  // --------------------------------------------------

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

  // --------------------------------------------------
  // EDIT STOCK
  // --------------------------------------------------

  const editStock = (item) => {
    const value = prompt(
      `Enter new stock for ${item.name}`,
      item.stock
    );

    if (value === null) return;

    const newStock = Number(value);

    if (isNaN(newStock) || newStock < 0) {
      alert("Please enter a valid stock quantity.");
      return;
    }

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
    </div>
  );
}

export default Inventory;