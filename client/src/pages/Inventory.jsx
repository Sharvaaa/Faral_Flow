
import { useEffect, useState } from "react";
import InventoryTable from "../components/inventory/InventoryTable";
import { getInventory } from "../services/inventoryService";

function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadInventory() {
      setLoading(true);
      setError("");

      try {
        const items = await getInventory();

        if (isMounted) {
          setInventory(items);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Unable to load inventory.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadInventory();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-2">Inventory</h1>
      <p className="text-gray-600 mb-6">
        View current stock levels for your products.
      </p>

      {loading && (
        <p className="py-6">Loading inventory...</p>
      )}

      {!loading && error && (
        <div className="rounded-lg bg-red-50 text-red-700 p-4">
          <p className="font-semibold">Could not load inventory</p>
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && inventory.length === 0 && (
        <div className="rounded-lg bg-white p-6 shadow">
          No active inventory items were found.
        </div>
      )}

      {!loading && !error && inventory.length > 0 && (
        <>
          <div className="mb-4 text-sm text-gray-600">
            {inventory.length} products
          </div>

          <InventoryTable
            inventory={inventory}
            increaseStock={() => {
              alert(
                "Stock editing will be enabled after we safely connect it to Supabase."
              );
            }}
            decreaseStock={() => {
              alert(
                "Stock editing will be enabled after we safely connect it to Supabase."
              );
            }}
            editStock={() => {
              alert(
                "Stock editing will be enabled after we safely connect it to Supabase."
              );
            }}
          />
        </>
      )}
    </div>
  );
}

export default Inventory;
