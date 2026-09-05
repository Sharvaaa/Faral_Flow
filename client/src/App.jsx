import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/layout/Layout";

import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Inventory from "./pages/Inventory";
import RateCard from "./pages/RateCard";
import Login from "./pages/Login";

import sampleOrders from "./data/sampleOrders";
import inventoryItems from "./data/inventoryItems";

function App() {
  const [orders, setOrders] = useState(sampleOrders);
  const [inventory, setInventory] = useState(inventoryItems);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />

        <Route path="/login" element={<Login />} />

        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />

          <Route
            path="/orders"
            element={
              <Orders
                orders={orders}
                setOrders={setOrders}
                inventory={inventory}
                setInventory={setInventory}
              />
            }
          />

          <Route
            path="/inventory"
            element={
              <Inventory
                inventory={inventory}
                setInventory={setInventory}
              />
            }
          />

          <Route path="/ratecard" element={<RateCard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;