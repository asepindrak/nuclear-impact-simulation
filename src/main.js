import L from 'leaflet'
import axios from 'axios'

import { hitungDampakNuklir } from './utils/nuclear.js'

// Inisialisasi Peta di tengah Jakarta
const map = L.map('map').setView([-6.2, 106.816666], 10)

// Ambil posisi tengah awal
const centerLatLng = map.getCenter()
const center = [centerLatLng.lat, centerLatLng.lng]

// Tambahkan marker di tengah
const centerMarker = L.marker(center, { draggable: false }).addTo(map)

// Update marker saat peta digeser
map.on('move', () => {
  centerMarker.setLatLng(map.getCenter())
})

// Tambahkan tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap',
}).addTo(map)

const form = document.getElementById('form')
form.addEventListener('submit', async (e) => {
  e.preventDefault()

  const kg = parseFloat(document.getElementById('kg').value)
  const center = map.getCenter()
  const lat = center.lat
  const lon = center.lng

  try {
    // const res = await axios.post('http://localhost:3000/api/nuclear-impact', {
    //   jumlah_kg_uranium: kg,
    // })

    // const result = res.data
    // const data = result.estimasi

    const result = await hitungDampakNuklir(kg)
    const data = result.estimasi

    console.log(data)
    // Clear layer lingkaran sebelumnya
    map.eachLayer((layer) => {
      if (layer instanceof L.Circle) {
        map.removeLayer(layer)
      }
    })

    // Tambahkan lingkaran dampak
    L.circle(center, {
      radius: data.kerusakan_ringan.radius_m,
      color: 'yellow',
      fillOpacity: 0.2,
    }).addTo(map).bindPopup('Kerusakan Ringan')

    L.circle(center, {
      radius: data.kerusakan_total.radius_m,
      color: 'orange',
      fillOpacity: 0.3,
    }).addTo(map).bindPopup('Kerusakan Berat')

    L.circle(center, {
      radius: data.bola_api.radius_m,
      color: 'red',
      fillOpacity: 0.4,
    }).addTo(map).bindPopup('Bola Api')

    L.circle(center, {
      radius: data.radiasi_berbahaya.radius_m,
      color: 'purple',
      dashArray: '4',
      fillOpacity: 0.15,
    }).addTo(map).bindPopup('Zona Radiasi')

    // === Tambahkan popup info lengkap ===
    const popupContent = `
      <b>Simulasi Ledakan Nuklir | mode simulasi maksimal (100% Energi) E=mc²</b><br><br>
      <b>Uranium:</b> ${result.input.jumlah_kg_uranium} kg<br>
      <b>Energi:</b> ${result.energi_joule.toExponential(2)} joule<br>
      <b>Daya Ledak:</b> ${result.kiloton_tnt} kiloton TNT<br><br>

      <b>Bola Api</b>: ${data.bola_api.radius_m} m radius (~${data.bola_api.area_m2.toLocaleString()} m²)<br>
      <b>Kerusakan Berat</b>: ${data.kerusakan_total.radius_m} m (~${data.kerusakan_total.area_m2.toLocaleString()} m²)<br>
      <b>Kerusakan Ringan</b>: ${data.kerusakan_ringan.radius_m} m (~${data.kerusakan_ringan.area_m2.toLocaleString()} m²)<br>
      <b>Zona Radiasi</b>: ${data.radiasi_berbahaya.radius_m} m (~${data.radiasi_berbahaya.area_m2.toLocaleString()} m²)<br>
    `

    const infoPopup = L.popup()
      .setLatLng(center)
      .setContent(popupContent)
      .openOn(map)

    document.getElementById('form-container').classList.remove('show')

  } catch (err) {
    alert('Gagal hitung. Pastikan backend jalan.')
    console.error(err)
  }
})
