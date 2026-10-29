// ============================================================================
// FAIL: lib/waktusolat.js
// Fungsi fetch waktu solat daripada api.waktusolat.app
// ============================================================================

import { getZoneByCode } from "@/data/zones";

function formatTime(value) {
  if (!value) return "-";
  if (typeof value === "string") return value;
  return new Date(value * 1000).toLocaleTimeString("en-MY", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kuala_Lumpur",
  });
}

export async function getWaktuSolat(zone = "WLY01", cacheMode = "no-store") {
  const cleanZone = zone.toUpperCase();

  try {
    const res = await fetch(`https://api.waktusolat.app/v2/solat/${cleanZone}`, {
      cache: cacheMode,
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      throw new Error(`Waktu Solat API status ${res.status}`);
    }

    const data = await res.json();
    const zoneInfo = getZoneByCode(cleanZone);
    const rawList = data.prayers || data.prayerTime || [];
    const todayDayNumber = new Date().getDate();
    const todayRaw =
      rawList.find((item) => Number(item.day) === todayDayNumber) ||
      rawList[0] ||
      {};

    return {
      zone: data.zone || cleanZone,
      negeri: zoneInfo ? zoneInfo.negeri : "Wilayah Persekutuan",
      daerah: zoneInfo ? zoneInfo.daerah : "Kuala Lumpur, Putrajaya",
      today: {
        day: todayRaw.day || todayDayNumber,
        hijri: todayRaw.hijri || "-",
        fajr: formatTime(todayRaw.fajr),
        syuruk: formatTime(todayRaw.syuruk),
        dhuhr: formatTime(todayRaw.dhuhr),
        asr: formatTime(todayRaw.asr),
        maghrib: formatTime(todayRaw.maghrib),
        isha: formatTime(todayRaw.isha),
      },
    };
  } catch (err) {
    // Fallback jika network offline / timeout
    const zoneInfo = getZoneByCode(cleanZone);
    return {
      zone: cleanZone,
      negeri: zoneInfo ? zoneInfo.negeri : "Wilayah Persekutuan",
      daerah: zoneInfo ? zoneInfo.daerah : "Kuala Lumpur, Putrajaya",
      today: {
        fajr: "05:54 AM",
        syuruk: "07:05 AM",
        dhuhr: "01:12 PM",
        asr: "04:30 PM",
        maghrib: "07:15 PM",
        isha: "08:26 PM",
      },
    };
  }
}

