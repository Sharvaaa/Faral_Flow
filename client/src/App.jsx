import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/layout/Layout";

import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Inventory from "./pages/Inventory";
import RateCard from "./pages/RateCard";
import Login from "./pages/Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Navigate to="/dashboard" />} />

        <Route path="/login" element={<Login />} />

        <Route element={<Layout />}>

          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/orders" element={<Orders />} />

          <Route path="/inventory" element={<Inventory />} />

          <Route path="/ratecard" element={<RateCard />} />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
