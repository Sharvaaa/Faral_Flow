import { useState } from "react";

function StockForm({ inventory, addStock }) {
  const [productId, setProductId] = useState(inventory[0]?.id || "");
  const [quantity, setQuantity] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!quantity || Number(quantity) <= 0) return;

    addStock(productId, quantity);

    setQuantity("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-lg p-5 flex gap-4 items-end"
    >
      <div className="flex flex-col">
        <label className="mb-1 font-medium">Product</label>

        <select
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          className="border rounded px-3 py-2"
        >
          {inventory.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col">
        <label className="mb-1 font-medium">Quantity</label>

        <input
          type="number"
          placeholder="Enter stock"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="border rounded px-3 py-2"
        />
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
      >
        Add Stock
      </button>
    </form>
  );
}

export default StockForm;