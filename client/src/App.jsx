
import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { supabase } from "./services/supabase";

import Layout from "./components/layout/Layout";

import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Inventory from "./pages/Inventory";
import RateCard from "./pages/RateCard";
import Login from "./pages/Login";

import sampleOrders from "./data/sampleOrders";
import inventoryItems from "./data/inventoryitems.js";

function ProtectedRoute({ session, loading, children }) {
  if (loading) {
    return <p className="p-6">Checking your session...</p>;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Existing order and inventory state.
  const [orders, setOrders] = useState(sampleOrders);
  const [inventory, setInventory] = useState(inventoryItems);

  // Products loaded from Supabase.
  const [products, setProducts] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (isMounted) {
        setSession(newSession);
        setAuthLoading(false);
      }
    });

    supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (!isMounted) return;

        if (error) {
          console.error("Unable to check session:", error.message);
        }

        setSession(data?.session ?? null);
        setAuthLoading(false);
      })
      .catch((error) => {
        if (!isMounted) return;

        console.error("Unable to check session:", error);
        setAuthLoading(false);
      });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Load active products from the database after login.
  useEffect(() => {
    let isMounted = true;

    async function fetchProducts() {
      if (!session) {
        setProducts([]);
        return;
      }

      const { data, error } = await supabase
        .from("products")
        .select(`
          id,
          name,
          retail_price_250g,
          retail_price_500g,
          retail_price_750g,
          retail_price_1kg,
          wholesale_price_per_kg,
          is_active
        `)
        .eq("is_active", true)
        .order("name", { ascending: true });

      if (!isMounted) return;

      if (error) {
        console.error("Unable to load products:", error.message);
        setProducts([]);
        return;
      }

      const mappedProducts = (data || []).map((product) => ({
        id: product.id,
        name: product.name,
        unit: "kg",

        // Keep the actual packet prices for order calculations.
        retailPrice250g: Number(product.retail_price_250g),
        retailPrice500g: Number(product.retail_price_500g),
        retailPrice750g: Number(product.retail_price_750g),
        retailPrice1kg: Number(product.retail_price_1kg),

        // Retain the per-kg wholesale price separately.
        wholesalePricePerKg: Number(
          product.wholesale_price_per_kg
        ),
      }));

      setProducts(mappedProducts);
    }

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, [session]);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/dashboard" replace />}
        />

        <Route
          path="/login"
          element={
            authLoading ? (
              <p className="p-6">Checking your session...</p>
            ) : session ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Login />
            )
          }
        />

        <Route
          element={
            <ProtectedRoute
              session={session}
              loading={authLoading}
            >
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/orders"
            element={
              <Orders
                orders={orders}
                setOrders={setOrders}
                inventory={inventory}
                setInventory={setInventory}
                products={products}
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

          <Route
            path="/ratecard"
            element={<RateCard />}
          />
        </Route>

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
