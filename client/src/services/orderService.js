
import { supabase } from "./supabase";

export async function recordCollection(
  orderItemId,
  collectedPackets
) {
  const { data, error } = await supabase.rpc(
    "record_partial_collection",
    {
      p_order_item_id: orderItemId,
      p_collected_packet_count: Number(collectedPackets),
    }
  );

  if (error) {
    console.error("Collection failed:", error.message);
    throw error;
  }

  return data;
}
