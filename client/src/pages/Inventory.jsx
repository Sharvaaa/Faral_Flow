
import { useEffect, useState } from "react";
import InventoryTable from "../components/inventory/InventoryTable";
import { getInventory } from "../services/inventoryService";
import { supabase } from "../services/supabase";
import "./Inventory.css";

function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    let isFirstLoad = true;

    async function loadInventory() {
      try {
        const items = await getInventory();

        if (isMounted) {
          setInventory(items);
          setError("");
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err.message || "Unable to load inventory."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
          isFirstLoad = false;
        }
      }
    }

    loadInventory();

    const channel = supabase
      .channel("inventory-order-quantities")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "order_items",
        },
        () => loadInventory()
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
        },
        () => loadInventory()
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="inventory-page">
      <div className="inventory-heading">
        <div className="inventory-heading-main">
          <div
            className="inventory-heading-icon"
            aria-hidden="true"
          >
            ▤
          </div>

          <div>
            <h1 className="inventory-title">
              Inventory
            </h1>

            <p className="inventory-subtitle">
              Track the quantity ordered for every product.
            </p>
          </div>
        </div>

        {!loading && !error && (
          <div className="inventory-summary">
            <div
              className="inventory-summary-icon"
              aria-hidden="true"
            >
              ◫
            </div>

            <div>
              <p className="inventory-summary-label">
                Active products
              </p>

              <p className="inventory-summary-count">
                {inventory.length}
              </p>
            </div>
          </div>
        )}
      </div>

      {loading && (
        <div className="inventory-panel inventory-state">
          Loading product quantities...
        </div>
      )}

      {!loading && error && (
        <div className="inventory-state-error">
          <strong>Could not load inventory</strong>
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && inventory.length === 0 && (
        <div className="inventory-panel inventory-state">
          <span className="inventory-empty-icon">
            ◇
          </span>

          <strong>No active products found</strong>

          <p>Active products will appear here.</p>
        </div>
      )}

      {!loading && !error && inventory.length > 0 && (
        <InventoryTable inventory={inventory} />
      )}
    </div>
  );
}

export default Inventory;
