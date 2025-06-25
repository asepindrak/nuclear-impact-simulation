export async function hitungDampakNuklir(kg) {
    const energi_joule = kg * 8.2e13
    const kiloton_tnt = energi_joule / 4.184e12

    const bola_api_radius = Math.cbrt(kiloton_tnt) * 120
    const total_kerusakan_radius = Math.cbrt(kiloton_tnt) * 1000
    const kerusakan_ringan_radius = Math.cbrt(kiloton_tnt) * 1500
    const radiasi_radius = Math.cbrt(kiloton_tnt) * 900

    const luas = (r) => Math.PI * r * r

    return {
        input: { jumlah_kg_uranium: kg },
        energi_joule,
        kiloton_tnt,
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
            }
        },
        catatan: "Simulasi kasar dengan asumsi uranium weapon-grade dan efisiensi penuh.",
    }
}
