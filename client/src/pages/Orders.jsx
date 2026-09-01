import { useState } from "react";
import OrderForm from "../components/orders/OrderForm";
import OrdersList from "../components/orders/OrdersList";
import sampleOrders from "../data/sampleOrders";
import sampleProducts from "../data/sampleProducts";

function Orders() {
  const [orders, setOrders] = useState(sampleOrders);

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
      (total, item) => total + item.total,
      0
    );

    if (editingOrder) {
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
                grandTotal: grandTotal,
              }
            : order
        )
      );

      alert("Order updated successfully!");
    } else {
      const newOrder = {
        id: crypto.randomUUID(),
        customerName: formData.customerName,
        phone: formData.phone,
        orderDate: formData.orderDate,
        pickupDate: formData.pickupDate,
        status: formData.status,
        items: formData.items,
        grandTotal: grandTotal,
      };

      setOrders((prevOrders) => [...prevOrders, newOrder]);

      alert("Order saved successfully!");
    }

    resetForm();
  };

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

  const handleDeleteOrder = (orderId) => {
    setOrders((prevOrders) =>
      prevOrders.filter((order) => order.id !== orderId)
    );
  };

  const handleStatusChange = (orderId, newStatus) => {
    const validStatuses = ["Pending", "Packed", "Collected"];

    if (!validStatuses.includes(newStatus)) {
      return;
    }

    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId
          ? { ...order, status: newStatus }
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