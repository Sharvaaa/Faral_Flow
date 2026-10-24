
import { useCallback, useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import OrderForm from "../components/orders/OrderForm";
import OrdersList from "../components/orders/OrdersList";
import { markOrderCollected } from "../services/orderService";

const EMPTY_FORM = {
  customerName: "",
  phone: "",
  orderDate: "",
  pickupDate: "",
  status: "Pending",
  items: [],
};

function mapDatabaseOrder(order) {
  return {
    id: order.id,
    customerName: order.customer_name,
    phone: order.phone,
    orderDate: order.order_date,
    pickupDate: order.pickup_date,
    status: order.status,
    grandTotal: Number(order.grand_total || 0),
    items: (order.order_items || []).map((item) => ({
      id: item.id,
      orderItemId: item.id,
      productId: item.product_id,
      productName: item.product_name_snapshot,
      packetCount: item.packet_count,
      packetSize: item.packet_size_grams,
      quantityInKg: Number(item.total_weight_kg || 0),
      quantity: Number(item.total_weight_kg || 0),
      unit: "kg",
      price: Number(item.unit_price || 0),
      total: Number(item.line_total || 0),
    })),
  };
}

function mapDatabaseProduct(product) {
  return {
    ...product,
    id: product.id,
    name: product.name,
    unit: "kg",
    retailPrice: Number(product.retail_price_1kg || 0),
    retailPrice250g: Number(product.retail_price_250g || 0),
    retailPrice500g: Number(product.retail_price_500g || 0),
    retailPrice750g: Number(product.retail_price_750g || 0),
    retailPrice1kg: Number(product.retail_price_1kg || 0),
  };
}

function Orders({ orders, setOrders, setInventory }) {
  const [editingOrder, setEditingOrder] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [view, setView] = useState("list");
  const [actionOrderId, setActionOrderId] = useState(null);

  // Customer-name search
  const [searchName, setSearchName] = useState("");

  const refreshData = useCallback(async () => {
    setLoading(true);

    try {
      const [
        { data: orderRows, error: ordersError },
        { data: productRows, error: productsError },
        { data: inventoryRows, error: inventoryError },
      ] = await Promise.all([
        supabase
          .from("orders")
          .select("*, order_items(*)")
          .order("created_at", { ascending: false }),

        supabase
          .from("products")
          .select("*")
          .eq("is_active", true)
          .order("name"),

        supabase
          .from("inventory")
          .select("product_id, stock_kg, products(name)"),
      ]);

      if (ordersError) throw ordersError;
      if (productsError) throw productsError;
      if (inventoryError) throw inventoryError;

      setOrders((orderRows || []).map(mapDatabaseOrder));
      setProducts((productRows || []).map(mapDatabaseProduct));

      setInventory(
        (inventoryRows || []).map((row) => ({
          id: row.product_id,
          productId: row.product_id,
          name: row.products?.name || "Unknown product",
          stock: Number(row.stock_kg || 0),
          stock_kg: Number(row.stock_kg || 0),
          unit: "kg",
        }))
      );
    } catch (error) {
      console.error("Failed to load orders data:", error);
      alert(error.message || "Unable to load orders from Supabase.");
    } finally {
      setLoading(false);
    }
  }, [setOrders, setInventory]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  function resetForm() {
    setFormData({ ...EMPTY_FORM, items: [] });
    setEditingOrder(null);
  }

  function showCreateOrder() {
    resetForm();
    setView("form");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSaveOrder() {
    if (saving) return;

    if (!formData.customerName.trim()) {
      alert("Please enter customer name.");
      return;
    }

    if (!formData.phone.trim()) {
      alert("Please enter phone number.");
      return;
    }

    if (!formData.orderDate || !formData.pickupDate) {
      alert("Please enter both the order date and pickup date.");
      return;
    }

    if (formData.pickupDate < formData.orderDate) {
      alert("Pickup date cannot be before the order date.");
      return;
    }

    if (!formData.items.length) {
      alert("Please add at least one product.");
      return;
    }

    if (editingOrder?.status === "Collected") {
      alert("Collected orders cannot be edited.");
      resetForm();
      setView("list");
      return;
    }

    if (editingOrder) {
      const confirmed = window.confirm(
        `Update order for ${editingOrder.customerName}?\n\n` +
          "The database will calculate the inventory adjustment."
      );

      if (!confirmed) return;
    }

    const rpcItems = formData.items.map((item) => ({
      product_id: item.productId || item.product_id,
      packet_size_grams: Number(
        item.packetSize ?? item.packet_size_grams
      ),
      packet_count: Number(item.packetCount ?? item.packet_count),
    }));

    const invalidItem = rpcItems.some(
      (item) =>
        !item.product_id ||
        !Number.isInteger(item.packet_size_grams) ||
        ![250, 500, 750, 1000].includes(item.packet_size_grams) ||
        !Number.isInteger(item.packet_count) ||
        item.packet_count < 1
    );

    if (invalidItem) {
      alert("Please review the product, packet size, and packet count.");
      return;
    }

    setSaving(true);

    try {
      const { error } = await supabase.rpc("save_order", {
        p_order_id: editingOrder?.id || null,
        p_customer_name: formData.customerName.trim(),
        p_phone: formData.phone.trim(),
        p_order_date: formData.orderDate,
        p_pickup_date: formData.pickupDate,
        p_status: formData.status,
        p_items: rpcItems,
      });

      if (error) throw error;

      await refreshData();
      resetForm();
      setView("list");

      alert(
        editingOrder
          ? "Order updated successfully."
          : "Order saved successfully."
      );
    } catch (error) {
      console.error("Failed to save order:", error);
      alert(error.message || "Unable to save order.");
    } finally {
      setSaving(false);
    }
  }

  function handleEditOrder(order) {
    if (order.status === "Collected") {
      alert("Collected orders cannot be edited.");
      return;
    }

    setEditingOrder(order);

    setFormData({
      customerName: order.customerName || "",
      phone: order.phone || "",
      orderDate: order.orderDate || "",
      pickupDate: order.pickupDate || "",
      status: order.status || "Pending",
      items: order.items || [],
    });

    setView("form");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDeleteOrder(orderId) {
    const order = (orders || []).find((item) => item.id === orderId);
    if (!order) return;

    if (order.status === "Collected") {
      alert("Collected orders cannot be deleted.");
      return;
    }

    const confirmed = window.confirm(
      `Delete the order for ${order.customerName}?\n\n` +
        "Reserved stock will be restored if deletion is allowed."
    );

    if (!confirmed) return;

    setActionOrderId(orderId);

    try {
      const { error } = await supabase.rpc("delete_order", {
        p_order_id: orderId,
      });

      if (error) throw error;

      if (editingOrder?.id === orderId) resetForm();

      await refreshData();
      alert("Order deleted successfully.");
    } catch (error) {
      console.error("Failed to delete order:", error);
      alert(error.message || "Unable to delete order.");
    } finally {
      setActionOrderId(null);
    }
  }

  async function handleStatusChange(orderId, newStatus) {
    if (!["Pending", "Packed"].includes(newStatus)) {
      alert("Use the Mark Collected action to complete the entire order.");
      await refreshData();
      return;
    }

    const order = (orders || []).find((item) => item.id === orderId);

    if (!order || order.status === "Collected") {
      alert("Collected orders cannot change status.");
      await refreshData();
      return;
    }

    if (order.status === newStatus) return;

    const confirmed = window.confirm(
      `Change order status from ${order.status} to ${newStatus}?\n\n` +
        "This will not change inventory."
    );

    if (!confirmed) {
      await refreshData();
      return;
    }

    setActionOrderId(orderId);

    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId);

      if (error) throw error;

      await refreshData();
    } catch (error) {
      console.error("Failed to change order status:", error);
      alert(error.message || "Unable to change order status.");
      await refreshData();
    } finally {
      setActionOrderId(null);
    }
  }

  async function handleMarkCollected(orderId) {
    const order = (orders || []).find((item) => item.id === orderId);

    if (!order || order.status === "Collected") return;

    if (order.status !== "Packed") {
      alert("Pack the order before marking it as collected.");
      return;
    }

    const confirmed = window.confirm(
      `Mark the entire order for ${order.customerName} as Collected?\n\n` +
        "This confirms the full order was collected. Inventory will not change."
    );

    if (!confirmed) return;

    setActionOrderId(orderId);

    try {
      await markOrderCollected(orderId);
      await refreshData();
      alert("Entire order marked as collected.");
    } catch (error) {
      console.error("Failed to mark order collected:", error);
      alert(error.message || "Unable to mark order collected.");
      await refreshData();
    } finally {
      setActionOrderId(null);
    }
  }

  // Filter by customer name only; ignore capitalization and extra spaces.
  const filteredOrders = (orders || []).filter((order) =>
    String(order.customerName || "")
      .toLowerCase()
      .includes(searchName.trim().toLowerCase())
  );

  const buttonBase =
    "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2";

  return (
    <main className="w-full min-w-0 space-y-6 text-slate-800">
      <header className="flex w-full min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-orange-600">
            Faral Flow
          </p>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Order Management
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Create orders and manage customer pickups in one place.
          </p>
        </div>

        <button
          type="button"
          onClick={showCreateOrder}
          className={`${buttonBase} w-full shrink-0 bg-orange-500 text-white shadow-sm hover:bg-orange-600 sm:w-auto`}
        >
          <span aria-hidden="true" className="text-lg leading-none">
            +
          </span>
          Create Order
        </button>
      </header>

      <nav
        aria-label="Order views"
        className="flex w-full flex-wrap items-center gap-2 border-b border-slate-200 pb-3"
      >
        <button
          type="button"
          onClick={showCreateOrder}
          className={`${buttonBase} ${
            view === "form"
              ? "bg-orange-500 text-white shadow-sm hover:bg-orange-600"
              : "border border-slate-200 bg-white text-slate-600 hover:border-orange-200 hover:bg-orange-50 hover:text-orange-700"
          }`}
        >
          {editingOrder ? "Edit Order" : "Create Order"}
        </button>

        <button
          type="button"
          onClick={() => {
            resetForm();
            setView("list");
          }}
          className={`${buttonBase} ${
            view === "list"
              ? "bg-slate-900 text-white shadow-sm hover:bg-slate-800"
              : "border border-slate-200 bg-white text-slate-600 hover:border-orange-200 hover:bg-orange-50 hover:text-orange-700"
          }`}
        >
          All Orders
          <span
            className={`rounded-full px-2 py-0.5 text-xs ${
              view === "list"
                ? "bg-white/15 text-white"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {(orders || []).length}
          </span>
        </button>
      </nav>

      {view === "form" ? (
        <OrderForm
          formData={formData}
          setFormData={setFormData}
          products={products}
          onSaveOrder={handleSaveOrder}
          editingOrder={editingOrder}
          onCancelEdit={() => {
            resetForm();
            setView("list");
          }}
          saving={saving}
        />
      ) : loading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          Loading orders from Supabase...
        </div>
      ) : (
        <section className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <label
              htmlFor="customer-name-search"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Search orders by customer name
            </label>

            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                id="customer-name-search"
                type="search"
                value={searchName}
                onChange={(event) => setSearchName(event.target.value)}
                placeholder="Enter customer name..."
                autoComplete="off"
                className="min-h-11 w-full min-w-0 rounded-lg border border-slate-300 bg-white px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />

              {searchName && (
                <button
                  type="button"
                  onClick={() => setSearchName("")}
                  className={`${buttonBase} border border-slate-200 bg-white text-slate-600 hover:bg-slate-50`}
                >
                  Clear search
                </button>
              )}
            </div>

            {searchName.trim() && (
              <p className="mt-2 text-xs text-slate-500">
                Showing {filteredOrders.length} of {(orders || []).length}{" "}
                orders matching “{searchName.trim()}”.
              </p>
            )}
          </div>

          {filteredOrders.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
              <p className="font-semibold text-slate-800">
                {searchName.trim()
                  ? "No matching customer orders found."
                  : "No orders yet."}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                {searchName.trim()
                  ? "Try another customer name or clear your search."
                  : "Create an order to get started."}
              </p>

              {searchName.trim() && (
                <button
                  type="button"
                  onClick={() => setSearchName("")}
                  className={`${buttonBase} mt-4 bg-orange-500 text-white hover:bg-orange-600`}
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <OrdersList
              orders={filteredOrders}
              onEdit={handleEditOrder}
              onDelete={handleDeleteOrder}
              onStatusChange={handleStatusChange}
              onMarkCollected={handleMarkCollected}
              actionOrderId={actionOrderId}
            />
          )}
        </section>
      )}
    </main>
  );
}

export default Orders;
