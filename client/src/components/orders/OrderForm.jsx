import { useState } from "react";

function OrderForm({ formData, setFormData, products }) {
  const [selectedProductId, setSelectedProductId] = useState("");
  const [packetCount, setPacketCount] = useState("");
  const [packetSize, setPacketSize] = useState("");
  const [packetUnit, setPacketUnit] = useState("g");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddItem = () => {
    if (
      !selectedProductId ||
      !packetCount ||
      !packetSize ||
      Number(packetCount) <= 0 ||
      Number(packetSize) <= 0
    ) {
      alert("Please enter product, packet count and packet size.");
      return;
    }

    const selectedProduct = products.find(
      (product) =>
        String(product.id) === String(selectedProductId)
    );

    if (!selectedProduct) {
      alert("Product not found.");
      return;
    }

    const count = Number(packetCount);
    const size = Number(packetSize);

    // Convert packet size into kg
    let quantityInKg;

    if (packetUnit === "g") {
      quantityInKg = (count * size) / 1000;
    } else {
      quantityInKg = count * size;
    }

    const price = Number(selectedProduct.retailPrice);

    const itemTotal = quantityInKg * price;

    const newItem = {
      productId: selectedProduct.id,
      productName: selectedProduct.name,

      packetCount: count,
      packetSize: size,
      packetUnit: packetUnit,

      quantityInKg: quantityInKg,

      unit: selectedProduct.unit,
      price: price,

      total: itemTotal,
    };

    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }));

    // Reset product fields
    setSelectedProductId("");
    setPacketCount("");
    setPacketSize("");
    setPacketUnit("g");
  };

  const handleRemoveItem = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter(
        (_, index) => index !== indexToRemove
      ),
    }));
  };

  const grandTotal = formData.items.reduce(
    (total, item) => total + item.total,
    0
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-6">
        Create Order
      </h2>

      {/* Customer Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Customer Name */}
        <div>
          <label className="block mb-2 font-medium">
            Customer Name
          </label>

          <input
            type="text"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            placeholder="Enter customer name"
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block mb-2 font-medium">
            Phone Number
          </label>

          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="9876543210"
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        {/* Order Date */}
        <div>
          <label className="block mb-2 font-medium">
            Order Date
          </label>

          <input
            type="date"
            name="orderDate"
            value={formData.orderDate}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        {/* Pickup Date */}
        <div>
          <label className="block mb-2 font-medium">
            Pickup Date
          </label>

          <input
            type="date"
            name="pickupDate"
            value={formData.pickupDate}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block mb-2 font-medium">
            Status
          </label>

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
          >
            <option>Pending</option>
            <option>Packed</option>
            <option>Collected</option>
          </select>
        </div>
      </div>

      {/* Add Products */}
      <div className="border-t mt-8 pt-6">
        <h3 className="text-lg font-semibold mb-4">
          Add Products
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Product */}
          <div>
            <label className="block mb-2 font-medium">
              Product
            </label>

            <select
              value={selectedProductId}
              onChange={(e) =>
                setSelectedProductId(e.target.value)
              }
              className="w-full border rounded-lg px-4 py-2"
            >
              <option value="">
                Select Product
              </option>

              {products.map((product) => (
                <option
                  key={product.id}
                  value={product.id}
                >
                  {product.name}
                </option>
              ))}
            </select>
          </div>

          {/* Packet Count */}
          <div>
            <label className="block mb-2 font-medium">
              Packets
            </label>

            <input
              type="number"
              min="1"
              value={packetCount}
              onChange={(e) =>
                setPacketCount(e.target.value)
              }
              placeholder="e.g. 2"
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>

          {/* Packet Size */}
          <div>
            <label className="block mb-2 font-medium">
              Packet Size
            </label>

            <select
              value={packetSize}
              onChange={(e) => setPacketSize(e.target.value)}
              className="w-full border rounded-lg px-4 py-2"
            >
              <option value="">Select Size</option>
              <option value="250">250 g</option>
              <option value="500">500 g</option>
              <option value="750">750 g</option>
              <option value="1">1000 g</option>
            </select>
          </div>

          {/* Unit */}
          <div>
            <label className="block mb-2 font-medium">
              Unit
            </label>

            <select
              value={packetUnit}
              onChange={(e) =>
                setPacketUnit(e.target.value)
              }
              className="w-full border rounded-lg px-4 py-2"
            >
              <option value="g">Grams</option>
              <option value="kg">Kilograms</option>
            </select>
          </div>
        </div>

        {/* Add Item Button */}
        <button
          type="button"
          onClick={handleAddItem}
          className="mt-5 bg-black text-white rounded-lg px-6 py-2"
        >
          Add Item
        </button>
      </div>

      {/* Order Items */}
      {formData.items.length > 0 && (
        <div className="border-t mt-8 pt-6">
          <h3 className="text-lg font-semibold mb-4">
            Order Items
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left">
                  <th className="py-3">Product</th>
                  <th className="py-3">Packets</th>
                  <th className="py-3">Packet Size</th>
                  <th className="py-3">Price</th>
                  <th className="py-3">Total</th>
                  <th className="py-3">Action</th>
                </tr>
              </thead>

              <tbody>
                {formData.items.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b"
                  >
                    <td className="py-3">
                      {item.productName}
                    </td>

                    <td className="py-3">
                      {item.packetCount}
                    </td>

                    <td className="py-3">
                      {item.packetSize} {item.packetUnit}
                    </td>

                    <td className="py-3">
                      ₹{item.price}/kg
                    </td>

                    <td className="py-3">
                      ₹{item.total.toFixed(2)}
                    </td>

                    <td className="py-3">
                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveItem(index)
                        }
                        className="text-red-500"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end mt-6">
            <div className="text-xl font-semibold">
              Grand Total: ₹{grandTotal.toFixed(2)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderForm;