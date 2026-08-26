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

    setOrders((prevOrders) => [
      ...prevOrders,
      newOrder,
    ]);

    setFormData({
      customerName: "",
      phone: "",
      orderDate: "",
      pickupDate: "",
      status: "Pending",
      items: [],
    });

    alert("Order saved successfully!");
  };

  return (
    <div className="space-y-8">
      <OrderForm
        formData={formData}
        setFormData={setFormData}
        products={sampleProducts}
        onSaveOrder={handleSaveOrder}
      />

      <OrdersList orders={orders} />
    </div>
  );
}

export default Orders;