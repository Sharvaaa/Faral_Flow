
import { supabase } from "./supabase";

export async function getInventory() {
  const { data, error } = await supabase
    .from("products")
    .select(`
      id,
      name,
      is_active,
      inventory (
        stock_kg,
        updated_at
      )
    `)
    .eq("is_active", true)
    .order("name", { ascending: true });

  if (error) {
    throw new Error(`Unable to load inventory: ${error.message}`);
  }

  return (data ?? []).map((product) => {
    const stockRecord = Array.isArray(product.inventory)
      ? product.inventory[0]
      : product.inventory;

    return {
      id: product.id,
      product_id: product.id,
      name: product.name,
      stock: Number(stockRecord?.stock_kg ?? 0),
      unit: "kg",
      updatedAt: stockRecord?.updated_at ?? null,
    };
  });
}
