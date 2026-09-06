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

  // --------------------------------------------------
  // RESET FORM
  // --------------------------------------------------

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
  // CHECK INVENTORY AVAILABILITY
  // --------------------------------------------------

  const checkInventoryAvailability = (
    items,
    currentInventory
  ) => {
    for (const item of items) {
      const inventoryItem = currentInventory.find(
        (inventoryItem) =>
          inventoryItem.name?.trim().toLowerCase() ===
          item.productName?.trim().toLowerCase()
      );

      // Product doesn't exist in inventory
      if (!inventoryItem) {
        return {
          available: false,
          message: `${item.productName} is not available in inventory.`,
        };
      }

      const requiredQuantity = Number(item.quantity);
      const availableQuantity = Number(
        inventoryItem.stock
      );

      if (availableQuantity < requiredQuantity) {
        return {
          available: false,
          message:
            `Cannot pack this order.\n\n` +
            `${item.productName}: ` +
            `${requiredQuantity} ${item.unit} required, ` +
            `but only ${availableQuantity} ${inventoryItem.unit} available.`,
        };
      }
    }

    return {
      available: true,
      message: "",
    };
  };

  // --------------------------------------------------
  // UPDATE INVENTORY
  // --------------------------------------------------

  const updateInventory = (items, action) => {
    setInventory((prevInventory) =>
      prevInventory.map((inventoryItem) => {
        const orderedItems = items.filter(
          (item) =>
            item.productName?.trim().toLowerCase() ===
            inventoryItem.name?.trim().toLowerCase()
        );

        if (orderedItems.length === 0) {
          return inventoryItem;
        }

        const totalQuantity = orderedItems.reduce(
          (sum, item) =>
            sum + Number(item.quantity),
          0
        );

        console.log(
          `${action}: ${inventoryItem.name} - ${totalQuantity}`
        );

        if (action === "deduct") {
          return {
            ...inventoryItem,
            stock: Math.max(
              0,
              inventoryItem.stock - totalQuantity
            ),
          };
        }

        if (action === "restore") {
          return {
            ...inventoryItem,
            stock:
              inventoryItem.stock + totalQuantity,
          };
        }

        return inventoryItem;
      })
    );
  };

  // --------------------------------------------------
  // CREATE ORDER
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
      (total, item) =>
        total + Number(item.total),
      0
    );

    // ==================================================
    // EDITING EXISTING ORDER
    // ==================================================

    if (editingOrder) {
      const oldOrderUsesStock =
        editingOrder.status === "Packed" ||
        editingOrder.status === "Collected";

      const newOrderUsesStock =
        formData.status === "Packed" ||
        formData.status === "Collected";

      /*
        If the old order had already consumed inventory,
        temporarily restore its stock before checking the
        new order.

        Example:

        Current stock = 2 kg
        Old order     = 2 kg
        New order     = 3 kg

        After restoring old order:
        2 + 2 = 4 kg

        New order requires 3 kg
        → allowed
      */

      let inventoryForValidation = inventory;

      if (oldOrderUsesStock) {
        inventoryForValidation =
          inventory.map((inventoryItem) => {
            const oldItems =
              editingOrder.items.filter(
                (item) =>
                  item.productName
                    ?.trim()
                    .toLowerCase() ===
                  inventoryItem.name
                    ?.trim()
                    .toLowerCase()
              );

            const restoredQuantity =
              oldItems.reduce(
                (sum, item) =>
                  sum + Number(item.quantity),
                0
              );

            return {
              ...inventoryItem,
              stock:
                inventoryItem.stock +
                restoredQuantity,
            };
          });
      }

      // Check inventory before saving a Packed/Collected order
      if (newOrderUsesStock) {
        const inventoryCheck =
          checkInventoryAvailability(
            formData.items,
            inventoryForValidation
          );

        if (!inventoryCheck.available) {
          alert(inventoryCheck.message);
          return;
        }
      }

      // Restore old inventory
      if (oldOrderUsesStock) {
        updateInventory(
          editingOrder.items,
          "restore"
        );
      }

      // Deduct new inventory
      if (newOrderUsesStock) {
        updateInventory(
          formData.items,
          "deduct"
        );
      }

      // Update order
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === editingOrder.id
            ? {
                ...order,
                customerName:
                  formData.customerName,
                phone: formData.phone,
                orderDate:
                  formData.orderDate,
                pickupDate:
                  formData.pickupDate,
                status: formData.status,
                items: formData.items,
                grandTotal,
              }
            : order
        )
      );

      alert("Order updated successfully!");
    }

    // ==================================================
    // CREATING NEW ORDER
    // ==================================================

    else {
      const newOrder = {
        id: crypto.randomUUID(),
        customerName:
          formData.customerName,
        phone: formData.phone,
        orderDate:
          formData.orderDate,
        pickupDate:
          formData.pickupDate,
        status: formData.status,
        items: formData.items,
        grandTotal,
      };

      const newOrderUsesStock =
        newOrder.status === "Packed" ||
        newOrder.status === "Collected";

      // Check inventory BEFORE saving
      if (newOrderUsesStock) {
        const inventoryCheck =
          checkInventoryAvailability(
            newOrder.items,
            inventory
          );

        if (!inventoryCheck.available) {
          alert(inventoryCheck.message);
          return;
        }

        updateInventory(
          newOrder.items,
          "deduct"
        );
      }

      setOrders((prevOrders) => [
        ...prevOrders,
        newOrder,
      ]);

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

    if (!orderToDelete) {
      return;
    }

    const orderUsesStock =
      orderToDelete.status === "Packed" ||
      orderToDelete.status === "Collected";

    // Restore inventory if this order had consumed stock
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

  const handleStatusChange = (
    orderId,
    newStatus
  ) => {
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

    // ==================================================
    // PENDING → PACKED / COLLECTED
    // ==================================================

    if (
      !oldStatusUsesStock &&
      newStatusUsesStock
    ) {
      const inventoryCheck =
        checkInventoryAvailability(
          currentOrder.items,
          inventory
        );

      if (!inventoryCheck.available) {
        alert(inventoryCheck.message);
        return;
      }

      updateInventory(
        currentOrder.items,
        "deduct"
      );
    }

    // ==================================================
    // PACKED / COLLECTED → PENDING
    // ==================================================

    if (
      oldStatusUsesStock &&
      !newStatusUsesStock
    ) {
      updateInventory(
        currentOrder.items,
        "restore"
      );
    }

    // ==================================================
    // UPDATE STATUS
    // ==================================================

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

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

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