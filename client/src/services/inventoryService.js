
import { supabase } from "./supabase";

export async function getInventory() {
  // Load active products.
  const { data: products, error: productsError } =
    await supabase
      .from("products")
      .select("id, name")
      .eq("is_active", true)
      .order("name", { ascending: true });

  if (productsError) {
    throw new Error(
      `Unable to load products: ${productsError.message}`
    );
  }

  // Load order quantities with their parent order statuses.
  const { data: items, error: itemsError } =
    await supabase
      .from("order_items")
      .select(`
        product_id,
        total_weight_kg,
        orders (
          status
        )
      `);

  if (itemsError) {
    throw new Error(
      `Unable to load ordered quantities: ${itemsError.message}`
    );
  }

  // Calculate totals from current order records.
  const totals = {};

  for (const item of items ?? []) {
    const status = String(
      item.orders?.status ?? ""
    ).toLowerCase();

    // Exclude cancelled orders.
    if (["cancelled", "canceled"].includes(status)) {
      continue;
    }

    if (!item.product_id) continue;

    totals[item.product_id] =
      (totals[item.product_id] ?? 0) +
      Number(item.total_weight_kg ?? 0);
  }

  return (products ?? []).map((product) => ({
    id: product.id,
    product_id: product.id,
    name: product.name,
    quantity_ordered: Number(
      (totals[product.id] ?? 0).toFixed(3)
    ),
    unit: "kg",
  }));
}
