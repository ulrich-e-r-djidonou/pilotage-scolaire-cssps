import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

function couleurImse(rang) {
  if (!rang) return '#9ca3af'
  if (rang >= 8) return '#ef4444'
  if (rang >= 5) return '#f59e0b'
  return '#22c55e'
}

export default function CarteEcoles({ ecoles, defavorisation }) {
  // Créer un index des données de défavorisation par code école
  const defavIndex = {}
  defavorisation.forEach(d => { defavIndex[d.code] = d })

  // Filtrer les écoles avec coordonnées valides
  const ecolesAvecCoords = ecoles.filter(e => e.lat && e.lon)

  // Centre approximatif du CSSPS (Beauport/Charlesbourg)
  const centre = [46.88, -71.18]

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800">Carte des écoles</h2>
        <p className="text-sm text-gray-500 mt-1">
          Couleur selon le rang IMSE :
          <span className="inline-block w-3 h-3 rounded-full bg-green-500 mx-1 align-middle" /> 1-4 (favorisé)
          <span className="inline-block w-3 h-3 rounded-full bg-yellow-500 mx-1 align-middle" /> 5-7
          <span className="inline-block w-3 h-3 rounded-full bg-red-500 mx-1 align-middle" /> 8-10 (défavorisé)
          <span className="inline-block w-3 h-3 rounded-full bg-gray-400 mx-1 align-middle" /> sans donnée
        </p>
      </div>
      <MapContainer center={centre} zoom={11} style={{ height: '500px', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {ecolesAvecCoords.map((e, i) => {
          const defav = defavIndex[e.code]
          return (
            <CircleMarker
              key={i}
              center={[e.lat, e.lon]}
              radius={defav?.nb_eleves ? Math.max(4, Math.min(12, defav.nb_eleves / 150)) : 5}
              fillColor={couleurImse(defav?.rang_imse)}
              color="#fff"
              weight={1.5}
              fillOpacity={0.85}
            >
              <Popup>
                <div className="text-sm">
                  <p className="font-semibold">{e.nom_court}</p>
                  <p className="text-gray-500">{e.ordre}</p>
                  <p className="text-gray-500">{e.municipalite}</p>
                  {defav && (
                    <>
                      <hr className="my-1" />
                      <p>Élèves : <strong>{defav.nb_eleves?.toLocaleString('fr-CA') || '—'}</strong></p>
                      <p>IMSE : <strong>{defav.imse?.toFixed(1) || '—'}</strong> (rang {defav.rang_imse || '—'})</p>
                      <p>SFR : <strong>{defav.sfr?.toFixed(1) || '—'}</strong> (rang {defav.rang_sfr || '—'})</p>
                    </>
                  )}
                </div>
              </Popup>
            </CircleMarker>
          )
        })}
      </MapContainer>
    </div>
  )
}
