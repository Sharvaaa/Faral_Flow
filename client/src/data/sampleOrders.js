const sampleOrders = [
  {
    id: crypto.randomUUID(),
    customerName: "Rahul Sharma",
    phone: "9876543210",
    orderDate: "2026-07-28",
    pickupDate: "2026-07-30",
    status: "Pending",

    items: [
      {
        productId: "p1",
        productName: "Chakli",
        quantity: 2,
        unit: "kg",
        price: 350,
        total: 700,
      },
      {
        productId: "p2",
        productName: "Ladoo",
        quantity: 1,
        unit: "kg",
        price: 500,
        total: 500,
      },
    ],

    grandTotal: 1200,
  },

  {
    id: crypto.randomUUID(),
    customerName: "Priya Verma",
    phone: "9123456780",
    orderDate: "2026-07-27",
    pickupDate: "2026-07-29",
    status: "Packed",

    items: [
      {
        productId: "p3",
        productName: "Shankarpali",
        quantity: 3,
        unit: "kg",
        price: 280,
        total: 840,
      },
    ],

    grandTotal: 840,
  },
];

export default sampleOrders;