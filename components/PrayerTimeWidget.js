// ============================================================================
// FAIL: components/PrayerTimeWidget.js
// KONSEP: Waktu Solat Bar dengan Auto-Detect Location (1 Zon Terdekat)
// ============================================================================

"use client";

import { useEffect, useState } from "react";
import { MapPin, Clock, Moon, Sun, Sunrise } from "lucide-react";

export default function PrayerTimeWidget() {
  const [solatData, setSolatData] = useState(null);
  const [locationName, setLocationName] = useState("Kuala Lumpur, Putrajaya");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSolat(lat, lng) {
      try {
        let url = "/api/solat";
        if (lat && lng) {
          url += `?lat=${lat}&lng=${lng}`;
        }
        const res = await fetch(url);
        const data = await res.json();
        setSolatData(data);
        if (data.daerah) setLocationName(data.daerah);
      } catch (e) {
        console.error("Gagal load waktu solat:", e);
      } finally {
        setLoading(false);
      }
    }

    // Auto-detect browser geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          fetchSolat(pos.coords.latitude, pos.coords.longitude);
        },
        () => {
          // Default jika user block location
          fetchSolat();
        },
        { timeout: 5000 }
      );
    } else {
      fetchSolat();
    }
  }, []);

  const prayers = [
    { name: "Subuh", time: solatData?.today?.fajr || "05:54 AM", icon: Sunrise },
    { name: "Zohor", time: solatData?.today?.dhuhr || "01:12 PM", icon: Sun },
    { name: "Asar", time: solatData?.today?.asr || "04:30 PM", icon: Sun },
    { name: "Maghrib", time: solatData?.today?.maghrib || "07:15 PM", icon: Moon },
    { name: "Isyak", time: solatData?.today?.isha || "08:26 PM", icon: Moon },
  ];

  return (
    <div className="bg-[#f0fdf4] border border-emerald-200 rounded-2xl p-3 sm:p-4 mb-6 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-emerald-100">
        <div className="flex items-center gap-2 text-xs font-black text-emerald-950">
          <span className="p-1.5 rounded-xl bg-emerald-100 text-emerald-700">
            🕌
          </span>
          <span>Waktu Solat Hari Ini</span>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-emerald-800 font-semibold bg-white/80 px-2.5 py-1 rounded-full border border-emerald-200">
          <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
          <span className="truncate max-w-[200px]">{locationName}</span>
          <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-mono font-bold">
            {solatData?.zone || "WLY01"}
          </span>
        </div>
      </div>

      {/* 5 Waktu Solat Horizontal Row */}
      <div className="grid grid-cols-5 gap-1.5 sm:gap-2 text-center">
        {prayers.map((p) => {
          const Icon = p.icon;
          return (
            <div
              key={p.name}
              className="bg-white rounded-xl p-2 border border-emerald-100/80 shadow-2xs flex flex-col items-center justify-center"
            >
              <span className="text-[10px] font-bold text-zinc-500 uppercase">
                {p.name}
              </span>
              <span className="text-xs sm:text-sm font-black text-emerald-950 mt-0.5">
                {loading ? "..." : p.time.replace(/ (AM|PM)/, "")}
              </span>
              <span className="text-[9px] font-semibold text-emerald-700">
                {p.time.includes("PM") ? "PTG" : "PGI"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

