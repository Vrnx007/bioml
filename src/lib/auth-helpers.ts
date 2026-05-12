import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/** True when logged-in user may read price tiers per RLS (buyer, vendor, admin). */
export async function canViewPricing(): Promise<boolean> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return false;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (!profile) return false;
  return profile.role === "buyer_user" || profile.role === "vendor_staff" || profile.role === "platform_admin";
}
