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

  return (
    <div className="space-y-8">
      <OrderForm
        formData={formData}
        setFormData={setFormData}
        products={sampleProducts}
      />

      <OrdersList orders={orders} />
    </div>
  );
}

export default Orders;