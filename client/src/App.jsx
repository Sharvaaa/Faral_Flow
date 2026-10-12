
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
import inventoryItems from "./data/inventoryItems";

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

  // Temporary local state for existing Orders and Inventory pages.
  const [orders, setOrders] = useState(sampleOrders);
  const [inventory, setInventory] = useState(inventoryItems);

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