// ============================================================================
// FAIL: data/zones.js
// Senarai zon JAKIM dan koordinat anggaran untuk auto-detect lokasi
// ============================================================================

export const zones = [
  {
    code: "WLY01",
    negeri: "Wilayah Persekutuan",
    daerah: "Kuala Lumpur, Putrajaya",
    lat: 3.139,
    lng: 101.6869,
  },
  {
    code: "SGR01",
    negeri: "Selangor",
    daerah: "Shah Alam, Petaling, Gombak, Klang, Sepang",
    lat: 3.0738,
    lng: 101.5183,
  },
  {
    code: "JHR02",
    negeri: "Johor",
    daerah: "Johor Bahru, Kulai, Kota Tinggi",
    lat: 1.4927,
    lng: 103.7414,
  },
  {
    code: "PNG01",
    negeri: "Pulau Pinang",
    daerah: "Seluruh Pulau Pinang",
    lat: 5.4141,
    lng: 100.3288,
  },
  {
    code: "PRK02",
    negeri: "Perak",
    daerah: "Ipoh, Batu Gajah, Kampar",
    lat: 4.5975,
    lng: 101.0901,
  },
  {
    code: "KDH01",
    negeri: "Kedah",
    daerah: "Kota Setar, Kubang Pasu",
    lat: 6.1184,
    lng: 100.3685,
  },
  {
    code: "KTN01",
    negeri: "Kelantan",
    daerah: "Kota Bharu, Bachok, Tumpat",
    lat: 6.1254,
    lng: 102.2386,
  },
  {
    code: "TRG01",
    negeri: "Terengganu",
    daerah: "Kuala Terengganu, Marang",
    lat: 5.3117,
    lng: 103.1324,
  },
  {
    code: "MLK01",
    negeri: "Melaka",
    daerah: "Seluruh Negeri Melaka",
    lat: 2.1896,
    lng: 102.2501,
  },
  {
    code: "NSN02",
    negeri: "Negeri Sembilan",
    daerah: "Seremban, Port Dickson",
    lat: 2.7258,
    lng: 101.9424,
  },
  {
    code: "PHG02",
    negeri: "Pahang",
    daerah: "Kuantan, Pekan, Rompin",
    lat: 3.8077,
    lng: 103.326,
  },
  {
    code: "SBH07",
    negeri: "Sabah",
    daerah: "Kota Kinabalu, Penampang",
    lat: 5.9804,
    lng: 116.0735,
  },
  {
    code: "SWK08",
    negeri: "Sarawak",
    daerah: "Kuching, Bau, Lundu",
    lat: 1.5533,
    lng: 110.3592,
  },
];

export function getZoneByCode(code) {
  return zones.find((z) => z.code.toUpperCase() === code.toUpperCase()) || null;
}

export function findNearestZone(lat, lng) {
  let nearest = zones[0];
  let minDistance = Infinity;

  for (const z of zones) {
    const dLat = z.lat - lat;
    const dLng = z.lng - lng;
    const dist = dLat * dLat + dLng * dLng;
    if (dist < minDistance) {
      minDistance = dist;
      nearest = z;
    }
  }

  return nearest;
}

