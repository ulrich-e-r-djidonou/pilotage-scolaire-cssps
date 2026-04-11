import { useState, useMemo } from 'react'
import ecoles from './data_ecoles.json'
import defavorisation from './data_defavorisation.json'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts'

const COLORS = ['#1e40af', '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe', '#f59e0b', '#ef4444', '#dc2626']

function KpiCard({ label, value, sub }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <p className="text-sm text-gray-500 uppercase tracking-wide">{label}</p>
      <p className="text-3xl font-bold text-blue-800 mt-1">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  )
}

function App() {
  const [filtre, setFiltre] = useState('')
  const [onglet, setOnglet] = useState('tableau')

  // Données filtrées pour le tableau
  const defavFiltrees = useMemo(() => {
    const terme = filtre.toLowerCase()
    return defavorisation.filter(d =>
      d.diffusion === 'OUI' &&
      (d.nom.toLowerCase().includes(terme) || d.niveau.toLowerCase().includes(terme))
    )
  }, [filtre])

  // KPIs
  const nbEcoles = ecoles.length
  const nbEleves = defavorisation.filter(d => d.nb_eleves).reduce((s, d) => s + d.nb_eleves, 0)
  const imseMoyen = defavorisation.filter(d => d.imse).reduce((s, d, _, a) => s + d.imse / a.length, 0)

  // Distribution IMSE (rang décile 1 à 10)
  const distImse = useMemo(() => {
    const counts = Array(10).fill(0)
    defavorisation.forEach(d => {
      if (d.rang_imse) counts[d.rang_imse - 1]++
    })
    return counts.map((c, i) => ({ rang: `${i + 1}`, ecoles: c }))
  }, [])

  // Répartition par ordre d'enseignement
  const repartitionOrdre = useMemo(() => {
    const ordres = {}
    ecoles.forEach(e => {
      const o = e.ordre || 'Autre'
      ordres[o] = (ordres[o] || 0) + 1
    })
    return Object.entries(ordres).map(([name, value]) => ({ name, value }))
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête */}
      <header className="bg-blue-800 text-white py-6 px-8">
        <h1 className="text-2xl font-bold">Pilotage scolaire — CSSPS</h1>
        <p className="text-blue-200 mt-1">
          Centre de services scolaire des Premières-Seigneuries | Données ouvertes MEQ 2024-2025
        </p>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <KpiCard label="Écoles" value={nbEcoles} sub="Tous ordres confondus" />
          <KpiCard label="Élèves" value={nbEleves.toLocaleString('fr-CA')} sub="Primaire + secondaire" />
          <KpiCard label="IMSE moyen" value={imseMoyen.toFixed(1)} sub="Indice socioéconomique" />
          <KpiCard label="Écoles défav." value={defavorisation.filter(d => d.rang_imse && d.rang_imse >= 8).length} sub="Rang IMSE ≥ 8 (déciles 8-10)" />
        </div>

        {/* Onglets */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          {[
            { id: 'tableau', label: 'Tableau des écoles' },
            { id: 'imse', label: 'Distribution IMSE' },
            { id: 'repartition', label: 'Répartition' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setOnglet(tab.id)}
              className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                onglet === tab.id
                  ? 'border-blue-800 text-blue-800'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Contenu de l'onglet */}
        {onglet === 'tableau' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b border-gray-100">
              <input
                type="text"
                placeholder="Filtrer par nom d'école ou niveau..."
                value={filtre}
                onChange={e => setFiltre(e.target.value)}
                className="w-full md:w-96 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                  <tr>
                    <th className="px-4 py-3">École</th>
                    <th className="px-4 py-3">Niveau</th>
                    <th className="px-4 py-3 text-right">Élèves</th>
                    <th className="px-4 py-3 text-right">IMSE</th>
                    <th className="px-4 py-3 text-right">Rang IMSE</th>
                    <th className="px-4 py-3 text-right">SFR</th>
                    <th className="px-4 py-3 text-right">Rang SFR</th>
                  </tr>
                </thead>
                <tbody>
                  {defavFiltrees.map((d, i) => (
                    <tr key={i} className={`border-t border-gray-100 ${d.rang_imse >= 8 ? 'bg-red-50' : ''}`}>
                      <td className="px-4 py-3 font-medium text-gray-800">{d.nom}</td>
                      <td className="px-4 py-3">{d.niveau}</td>
                      <td className="px-4 py-3 text-right">{d.nb_eleves?.toLocaleString('fr-CA') || '—'}</td>
                      <td className="px-4 py-3 text-right">{d.imse?.toFixed(1) || '—'}</td>
                      <td className="px-4 py-3 text-right">
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                          d.rang_imse >= 8 ? 'bg-red-100 text-red-700' :
                          d.rang_imse >= 5 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {d.rang_imse || '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">{d.sfr?.toFixed(1) || '—'}</td>
                      <td className="px-4 py-3 text-right">{d.rang_sfr || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-3 text-xs text-gray-400 border-t border-gray-100">
              {defavFiltrees.length} école(s) affichée(s) — IMSE : Indice de milieu socioéconomique | SFR : Seuil de faible revenu
            </div>
          </div>
        )}

        {onglet === 'imse' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Distribution des rangs IMSE — Écoles CSSPS
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Nombre d'écoles par décile IMSE. Les déciles 8 à 10 sont considérés défavorisés.
            </p>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={distImse}>
                <XAxis dataKey="rang" label={{ value: 'Rang décile IMSE', position: 'insideBottom', offset: -5 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="ecoles" name="Nombre d'écoles">
                  {distImse.map((_, i) => (
                    <Cell key={i} fill={i >= 7 ? '#ef4444' : i >= 4 ? '#f59e0b' : '#2563eb'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {onglet === 'repartition' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Répartition par ordre d'enseignement
            </h2>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={repartitionOrdre}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  label={({ name, value }) => `${name} (${value})`}
                >
                  {repartitionOrdre.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Pied de page */}
        <footer className="mt-12 text-center text-xs text-gray-400 pb-8">
          Source : Données ouvertes du MEQ — donneesquebec.ca | Année scolaire 2024-2025
        </footer>
      </main>
    </div>
  )
}

export default App
