import { useMemo } from 'react'
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts'

const COLORS_PIE = ['#1e40af', '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#f59e0b', '#10b981']
const COLORS_BAR = '#2563eb'

export default function Repartition({ ecoles, defavorisation }) {
  const parOrdre = useMemo(() => {
    const ordres = {}
    ecoles.forEach(e => {
      const o = e.ordre || 'Autre'
      ordres[o] = (ordres[o] || 0) + 1
    })
    return Object.entries(ordres)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
  }, [ecoles])

  const parMunicipalite = useMemo(() => {
    const mun = {}
    ecoles.forEach(e => {
      const m = e.municipalite || 'Inconnue'
      mun[m] = (mun[m] || 0) + 1
    })
    return Object.entries(mun)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 15)
  }, [ecoles])

  const elevesParMunicipalite = useMemo(() => {
    // Associer les élèves aux écoles via les codes
    const ecolesMun = {}
    ecoles.forEach(e => { ecolesMun[e.code] = e.municipalite })

    const mun = {}
    defavorisation.forEach(d => {
      if (!d.nb_eleves) return
      // Trouver la municipalité via le code
      const code = d.code
      const m = ecolesMun[code] || 'Inconnue'
      mun[m] = (mun[m] || 0) + d.nb_eleves
    })
    return Object.entries(mun)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
  }, [ecoles, defavorisation])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-1">Par ordre d'enseignement</h2>
        <p className="text-sm text-gray-500 mb-4">Nombre d'écoles par type</p>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={parOrdre}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ name, value }) => `${value}`}
            >
              {parOrdre.map((_, i) => (
                <Cell key={i} fill={COLORS_PIE[i % COLORS_PIE.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-1">Écoles par municipalité</h2>
        <p className="text-sm text-gray-500 mb-4">Top 15 municipalités</p>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={parMunicipalite} layout="vertical">
            <XAxis type="number" allowDecimals={false} />
            <YAxis type="category" dataKey="name" width={140} tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="value" name="Écoles" fill={COLORS_BAR} radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
        <h2 className="text-lg font-semibold text-gray-800 mb-1">Élèves par municipalité</h2>
        <p className="text-sm text-gray-500 mb-4">Répartition des effectifs (primaire + secondaire)</p>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={elevesParMunicipalite}>
            <XAxis dataKey="name" tick={{ fontSize: 10, angle: -30 }} height={60} />
            <YAxis allowDecimals={false} />
            <Tooltip formatter={(v) => [v.toLocaleString('fr-CA') + ' élèves', '']} />
            <Bar dataKey="value" name="Élèves" fill="#1e40af" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
