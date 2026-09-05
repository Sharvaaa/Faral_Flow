import { useState } from "react";
import OrderForm from "../components/orders/OrderForm";
import OrdersList from "../components/orders/OrdersList";
import sampleProducts from "../data/sampleProducts";

function Orders({
  orders,
  setOrders,
  inventory,
  setInventory,
}) {
  const [editingOrder, setEditingOrder] = useState(null);

  const [formData, setFormData] = useState({
    customerName: "",
    phone: "",
    orderDate: "",
    pickupDate: "",
    status: "Pending",
    items: [],
  });

  const resetForm = () => {
    setFormData({
      customerName: "",
      phone: "",
      orderDate: "",
      pickupDate: "",
      status: "Pending",
      items: [],
    });

    setEditingOrder(null);
  };

  // --------------------------------------------------
  // INVENTORY UPDATE
  // --------------------------------------------------

  const updateInventory = (items, action) => {
    setInventory((prevInventory) => {
      return prevInventory.map((inventoryItem) => {
        const orderedItem = items.find(
          (item) =>
            item.productName?.trim().toLowerCase() ===
            inventoryItem.name?.trim().toLowerCase()
        );

        // This inventory item is not part of the order
        if (!orderedItem) {
          return inventoryItem;
        }

        const quantity = Number(orderedItem.quantity);

        console.log(
          `${action}: ${orderedItem.productName} - ${quantity} ${orderedItem.unit}`
        );

        if (action === "deduct") {
          return {
            ...inventoryItem,
            stock: Math.max(
              0,
              inventoryItem.stock - quantity
            ),
          };
        }

        if (action === "restore") {
          return {
            ...inventoryItem,
            stock: inventoryItem.stock + quantity,
          };
        }

        return inventoryItem;
      });
    });
  };

  // --------------------------------------------------
  // SAVE ORDER
  // --------------------------------------------------

  const handleSaveOrder = () => {
    if (!formData.customerName.trim()) {
      alert("Please enter customer name.");
      return;
    }

    if (!formData.phone.trim()) {
      alert("Please enter phone number.");
      return;
    }

    if (formData.items.length === 0) {
      alert("Please add at least one product.");
      return;
    }

    const grandTotal = formData.items.reduce(
      (total, item) => total + Number(item.total),
      0
    );

    // EDITING EXISTING ORDER
    if (editingOrder) {
      const oldOrderUsesStock =
        editingOrder.status === "Packed" ||
        editingOrder.status === "Collected";

      const newOrderUsesStock =
        formData.status === "Packed" ||
        formData.status === "Collected";

      // First restore the old order's inventory
      if (oldOrderUsesStock) {
        updateInventory(editingOrder.items, "restore");
      }

      // Then deduct inventory for the new order
      if (newOrderUsesStock) {
        updateInventory(formData.items, "deduct");
      }

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === editingOrder.id
            ? {
                ...order,
                customerName: formData.customerName,
                phone: formData.phone,
                orderDate: formData.orderDate,
                pickupDate: formData.pickupDate,
                status: formData.status,
                items: formData.items,
                grandTotal,
              }
            : order
        )
      );

      alert("Order updated successfully!");
    }

    // CREATING NEW ORDER
    else {
      const newOrder = {
        id: crypto.randomUUID(),
        customerName: formData.customerName,
        phone: formData.phone,
        orderDate: formData.orderDate,
        pickupDate: formData.pickupDate,
        status: formData.status,
        items: formData.items,
        grandTotal,
      };

      setOrders((prevOrders) => [
        ...prevOrders,
        newOrder,
      ]);

      // Deduct stock if order is immediately Packed/Collected
      if (
        newOrder.status === "Packed" ||
        newOrder.status === "Collected"
      ) {
        updateInventory(newOrder.items, "deduct");
      }

      alert("Order saved successfully!");
    }

    resetForm();
  };

  // --------------------------------------------------
  // EDIT ORDER
  // --------------------------------------------------

  const handleEditOrder = (order) => {
    setEditingOrder(order);

    setFormData({
      customerName: order.customerName,
      phone: order.phone,
      orderDate: order.orderDate,
      pickupDate: order.pickupDate,
      status: order.status,
      items: order.items,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // --------------------------------------------------
  // DELETE ORDER
  // --------------------------------------------------

  const handleDeleteOrder = (orderId) => {
    const orderToDelete = orders.find(
      (order) => order.id === orderId
    );

    if (!orderToDelete) return;

    const orderUsesStock =
      orderToDelete.status === "Packed" ||
      orderToDelete.status === "Collected";

    // If stock was deducted for this order,
    // return it when deleting the order.
    if (orderUsesStock) {
      updateInventory(
        orderToDelete.items,
        "restore"
      );
    }

    setOrders((prevOrders) =>
      prevOrders.filter(
        (order) => order.id !== orderId
      )
    );
  };

  // --------------------------------------------------
  // STATUS CHANGE
  // --------------------------------------------------

  const handleStatusChange = (orderId, newStatus) => {
    const validStatuses = [
      "Pending",
      "Packed",
      "Collected",
    ];

    if (!validStatuses.includes(newStatus)) {
      return;
    }

    const currentOrder = orders.find(
      (order) => order.id === orderId
    );

    if (!currentOrder) {
      return;
    }

    const oldStatusUsesStock =
      currentOrder.status === "Packed" ||
      currentOrder.status === "Collected";

    const newStatusUsesStock =
      newStatus === "Packed" ||
      newStatus === "Collected";

    console.log("Status change:", {
      customer: currentOrder.customerName,
      oldStatus: currentOrder.status,
      newStatus,
      items: currentOrder.items,
    });

    // ------------------------------------------
    // Pending → Packed
    // Pending → Collected
    // ------------------------------------------

    if (
      !oldStatusUsesStock &&
      newStatusUsesStock
    ) {
      updateInventory(
        currentOrder.items,
        "deduct"
      );
    }

    // ------------------------------------------
    // Packed → Pending
    // Collected → Pending
    // ------------------------------------------

    if (
      oldStatusUsesStock &&
      !newStatusUsesStock
    ) {
      updateInventory(
        currentOrder.items,
        "restore"
      );
    }

    // ------------------------------------------
    // Update order status
    // ------------------------------------------

    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status: newStatus,
            }
          : order
      )
    );
  };

  return (
    <div className="space-y-8">
      <OrderForm
        formData={formData}
        setFormData={setFormData}
        products={sampleProducts}
        onSaveOrder={handleSaveOrder}
        editingOrder={editingOrder}
      />

      <OrdersList
        orders={orders}
        onEdit={handleEditOrder}
        onDelete={handleDeleteOrder}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}

export default Orders;