
import { supabase } from "./supabase";

export async function markOrderCollected(orderId) {
  const { data, error } = await supabase.rpc("mark_order_collected", {
    p_order_id: orderId,
  });

  if (error) {
    console.error("Failed to mark order collected:", error.message);
    throw error;
  }

  return data;
}
