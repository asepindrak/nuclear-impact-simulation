export function hitungDampakNuklir(kg_uranium_235) {
    const energi_joule = kg_uranium_235 * 8.2e13
    const kiloton_tnt = energi_joule / 4.184e12

    const bola_api_radius = Math.cbrt(kiloton_tnt) * 120
    const total_kerusakan_radius = Math.cbrt(kiloton_tnt) * 1000
    const kerusakan_ringan_radius = Math.cbrt(kiloton_tnt) * 1500
    const radiasi_radius = Math.cbrt(kiloton_tnt) * 900

    const luas = (r) => Math.PI * r * r

    // Uranium alam yang dibutuhkan
    const kandungan_u235 = 0.007 // 0.7%
    const uranium_alam_kg = kg_uranium_235 / kandungan_u235

    // Harga uranium alam (USD dan IDR)
    const harga_usd_min = 150
    const harga_usd_max = 205
    const kurs = 16293

    const harga_rupiah_min = uranium_alam_kg * harga_usd_min * kurs
    const harga_rupiah_max = uranium_alam_kg * harga_usd_max * kurs

    return {
        input: {
            jumlah_kg_uranium_235: kg_uranium_235,
        },
        energi_joule,
        kiloton_tnt: parseFloat(kiloton_tnt.toFixed(2)),
        uranium_alam: {
            dibutuhkan_kg: Math.ceil(uranium_alam_kg),
            estimasi_harga: {
                usd: {
                    per_kg: { min: harga_usd_min, max: harga_usd_max },
                    total_min: Math.round(uranium_alam_kg * harga_usd_min),
                    total_max: Math.round(uranium_alam_kg * harga_usd_max),
                },
                idr: {
                    kurs_per_usd: kurs,
                    total_min: Math.round(harga_rupiah_min),
                    total_max: Math.round(harga_rupiah_max),
                },
            },
            catatan: "Asumsi kandungan U-235 dalam uranium alam 0.7%",
        },
        estimasi: {
            bola_api: {
                radius_m: Math.round(bola_api_radius),
                area_m2: Math.round(luas(bola_api_radius)),
            },
            kerusakan_total: {
                radius_m: Math.round(total_kerusakan_radius),
                area_m2: Math.round(luas(total_kerusakan_radius)),
            },
            kerusakan_ringan: {
                radius_m: Math.round(kerusakan_ringan_radius),
                area_m2: Math.round(luas(kerusakan_ringan_radius)),
            },
            radiasi_berbahaya: {
                radius_m: Math.round(radiasi_radius),
                area_m2: Math.round(luas(radiasi_radius)),
            },
        },
        catatan: "Simulasi kasar dengan asumsi uranium weapon-grade (U-235) dan efisiensi penuh.",
    }
}
