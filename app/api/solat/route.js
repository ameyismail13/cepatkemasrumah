// ============================================================================
// FAIL: app/api/solat/route.js
// Route Handler Waktu Solat
// ============================================================================

import { getWaktuSolat } from "@/lib/waktusolat";
import { findNearestZone } from "@/data/zones";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  let zone = searchParams.get("zone");

  // Jika dapat koordinat lokasi pengguna, auto-detect zon terdekat
  if (lat && lng && !zone) {
    const nearest = findNearestZone(parseFloat(lat), parseFloat(lng));
    zone = nearest.code;
  }

  if (!zone) zone = "WLY01";

  try {
    const data = await getWaktuSolat(zone, "no-store");
    return Response.json(data);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

