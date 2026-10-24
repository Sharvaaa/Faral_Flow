
import { useState } from "react";

const PACKET_GRAMS = 250;

function OrderForm({
  formData,
  setFormData,
  products = [],
  onSaveOrder,
  editingOrder,
  onCancelEdit,
  saving = false,
}) {
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantityInput, setQuantityInput] = useState("");

  const selectedProduct = products.find(
    (product) => String(product.id) === String(selectedProductId)
  );

  const getPrice = (product, grams) => {
    const price = (camel, snake) =>
      Number(product?.[camel] ?? product?.[snake] ?? 0);

    const wholeKg = Math.floor(grams / 1000);
    const remainder = grams % 1000;

    let total = wholeKg * price("retailPrice1kg", "retail_price_1kg");

    if (remainder === 250) {
      total += price("retailPrice250g", "retail_price_250g");
    } else if (remainder === 500) {
      total += price("retailPrice500g", "retail_price_500g");
    } else if (remainder === 750) {
      total += price("retailPrice750g", "retail_price_750g");
    }

    return Math.round((total + Number.EPSILON) * 100) / 100;
  };

  const getPacketCount = (quantity) => {
    const value = Number(quantity);
    if (!Number.isFinite(value) || value <= 0) return 0;

    // 10 or greater means grams; smaller values mean kilograms.
    const grams = value >= 10 ? value : value * 1000;

    if (!Number.isInteger(grams) || grams % PACKET_GRAMS !== 0) {
      return 0;
    }

    return grams / PACKET_GRAMS;
  };

  const handleFieldChange = (field, value) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleAddProduct = () => {
    if (!selectedProduct) {
      alert("Please select a product.");
      return;
    }

    const packetCount = getPacketCount(quantityInput);

    if (!packetCount || !Number.isInteger(packetCount)) {
      alert(
        "Enter a quantity in 250g increments, such as 250, 500, 750, 1000 grams or 0.25, 0.5, 0.75, 1 kg."
      );
      return;
    }

    const productId = String(selectedProduct.id);

    setFormData((previous) => {
      const existingItem = previous.items.find(
        (item) => String(item.productId) === productId
      );

      const updatedCount =
        Number(existingItem?.packetCount || 0) + packetCount;

      const totalGrams = updatedCount * PACKET_GRAMS;
      const totalKg = totalGrams / 1000;
      const totalPrice = getPrice(selectedProduct, totalGrams);

      const newItem = {
        ...(existingItem || {}),
        id: existingItem?.id || crypto.randomUUID(),
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        packetCount: updatedCount,
        packetSize: PACKET_GRAMS,
        quantityInKg: totalKg,
        quantity: totalKg,
        unit: "kg",
        // Price is the total for the combined product weight,
        // not the price of one 250g packet.
        price: totalPrice,
        total: totalPrice,
      };

      const items = existingItem
        ? previous.items.map((item) =>
            String(item.productId) === productId ? newItem : item
          )
        : [...previous.items, newItem];

      return { ...previous, items };
    });

    setSelectedProductId("");
    setQuantityInput("");
  };

  const handleRemoveItem = (itemId) => {
    setFormData((previous) => ({
      ...previous,
      items: previous.items.filter((item) => item.id !== itemId),
    }));
  };

  const formatMoney = (amount) =>
    `₹${Number(amount || 0).toFixed(2)}`;

  const orderTotal = formData.items.reduce(
    (total, item) => total + Number(item.total || 0),
    0
  );

  const inputClass =
    "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-100";

  const labelClass = "block text-sm font-medium text-slate-700";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-orange-600">
            ORDER MANAGEMENT
          </p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
            {editingOrder ? "Edit Order" : "Create New Order"}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Enter customer details and add products to the order.
          </p>
        </div>

        {onCancelEdit && (
          <button
            type="button"
            onClick={onCancelEdit}
            disabled={saving}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            {editingOrder ? "Cancel Editing" : "Back to All Orders"}
          </button>
        )}
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h3 className="mb-5 text-base font-semibold text-slate-900">
          Customer Details
        </h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="customerName">
              Customer Name *
            </label>
            <input
              id="customerName"
              required
              value={formData.customerName || ""}
              onChange={(e) =>
                handleFieldChange("customerName", e.target.value)
              }
              placeholder="Enter customer name"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="phone">
              Phone Number *
            </label>
            <input
              id="phone"
              type="tel"
              required
              value={formData.phone || ""}
              onChange={(e) => handleFieldChange("phone", e.target.value)}
              placeholder="Enter phone number"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="orderDate">
              Order Date *
            </label>
            <input
              id="orderDate"
              type="date"
              required
              value={formData.orderDate || ""}
              onChange={(e) =>
                handleFieldChange("orderDate", e.target.value)
              }
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="pickupDate">
              Pickup Date *
            </label>
            <input
              id="pickupDate"
              type="date"
              required
              min={formData.orderDate || undefined}
              value={formData.pickupDate || ""}
              onChange={(e) =>
                handleFieldChange("pickupDate", e.target.value)
              }
              className={inputClass}
            />
          </div>

          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="status">
              Order Status
            </label>
            <select
              id="status"
              value={formData.status || "Pending"}
              onChange={(e) => handleFieldChange("status", e.target.value)}
              className={inputClass}
            >
              <option value="Pending">Pending</option>
              <option value="Packed">Packed</option>
              <option value="Collected">Collected</option>
            </select>
            <p className="mt-1.5 text-xs text-slate-500">
              Collection tracking is handled through the order details.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h3 className="text-base font-semibold text-slate-900">
          Add Products
        </h3>
        <p className="mt-1 mb-5 text-sm text-slate-500">
          Quantities must be multiples of 250g. Pricing uses the combined
          weight price saved for each product.
        </p>

        <div className="grid grid-cols-1 items-end gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(150px,0.7fr)_auto]">
          <div>
            <label className={labelClass} htmlFor="product">
              Product
            </label>
            <select
              id="product"
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className={inputClass}
            >
              <option value="">Select a product</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass} htmlFor="quantity">
              Quantity (g or kg)
            </label>
            <input
              id="quantity"
              type="number"
              min="0.25"
              step="0.25"
              value={quantityInput}
              onChange={(e) => setQuantityInput(e.target.value)}
              placeholder="e.g. 750 or 0.75"
              className={inputClass}
            />
          </div>

          <button
            type="button"
            onClick={handleAddProduct}
            disabled={!selectedProductId || !quantityInput || saving}
            className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-40"
          >
            <span className="text-lg leading-none">+</span>
            Add Product
          </button>
        </div>

        {selectedProduct && (
          <div className="mt-4 rounded-xl bg-orange-50 px-4 py-3 text-sm text-orange-800">
            <p className="font-semibold">{selectedProduct.name}</p>
            <p className="mt-1">
              250g: {formatMoney(getPrice(selectedProduct, 250))}
              {" · "}
              500g: {formatMoney(getPrice(selectedProduct, 500))}
              {" · "}
              750g: {formatMoney(getPrice(selectedProduct, 750))}
              {" · "}
              1kg: {formatMoney(getPrice(selectedProduct, 1000))}
            </p>
          </div>
        )}
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
          <h3 className="text-base font-semibold text-slate-900">
            Order Items
          </h3>
          <p className="text-sm text-slate-500">
            {formData.items.length}{" "}
            {formData.items.length === 1 ? "product" : "products"} added
          </p>
        </div>

        {formData.items.length === 0 ? (
          <div className="px-5 py-10 text-center sm:px-6">
            <p className="text-sm font-semibold text-slate-700">
              No products added yet
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Select a product and quantity above to get started.
            </p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-slate-100">
              {formData.items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900">
                      {item.productName}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {Number(item.quantityInKg ?? item.quantity ?? 0)
                        .toFixed(2)
                        .replace(/\.?0+$/, "")}{" "}
                      kg
                      <span className="mx-2 text-slate-300">•</span>
                      {item.packetCount} × 250g
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Combined-weight price
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-4 sm:justify-end">
                    <p className="text-base font-bold text-slate-900">
                      {formatMoney(item.total)}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={saving}
                      aria-label={`Remove ${item.productName}`}
                      className="rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-2 border-t border-slate-100 bg-slate-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <span className="text-sm font-medium text-slate-600">
                Order Total
              </span>
              <span className="text-2xl font-bold tracking-tight text-slate-900">
                {formatMoney(orderTotal)}
              </span>
            </div>
          </>
        )}
      </section>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        {onCancelEdit && (
          <button
            type="button"
            onClick={onCancelEdit}
            disabled={saving}
            className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>
        )}

        <button
          type="button"
          onClick={onSaveOrder}
          disabled={saving || formData.items.length === 0}
          className="rounded-xl bg-orange-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-4 focus:ring-orange-200 disabled:opacity-50"
        >
          {saving
            ? "Saving Order..."
            : editingOrder
              ? "Save Changes"
              : "Create Order"}
        </button>
      </div>
    </div>
  );
}

export default OrderForm;
