import { useState, useMemo } from 'react'

const COLONNES = [
  { key: 'nom', label: 'École', align: 'left' },
  { key: 'niveau', label: 'Niveau', align: 'left' },
  { key: 'nb_eleves', label: 'Élèves', align: 'right', format: v => v?.toLocaleString('fr-CA') || '—' },
  { key: 'imse', label: 'IMSE', align: 'right', format: v => v?.toFixed(1) || '—' },
  { key: 'rang_imse', label: 'Rang IMSE', align: 'right', badge: true },
  { key: 'sfr', label: 'SFR', align: 'right', format: v => v?.toFixed(1) || '—' },
  { key: 'rang_sfr', label: 'Rang SFR', align: 'right', format: v => v || '—' },
]

function badgeClass(rang) {
  if (!rang) return 'bg-gray-100 text-gray-500'
  if (rang >= 8) return 'bg-red-100 text-red-700'
  if (rang >= 5) return 'bg-yellow-100 text-yellow-700'
  return 'bg-green-100 text-green-700'
}

export default function TableauEcoles({ defavorisation }) {
  const [filtre, setFiltre] = useState('')
  const [filtreNiveau, setFiltreNiveau] = useState('Tous')
  const [tri, setTri] = useState({ key: 'nom', asc: true })

  const donnees = useMemo(() => {
    const terme = filtre.toLowerCase()
    return defavorisation
      .filter(d => d.diffusion === 'OUI')
      .filter(d => filtreNiveau === 'Tous' || d.niveau === filtreNiveau)
      .filter(d => d.nom.toLowerCase().includes(terme))
      .sort((a, b) => {
        const va = a[tri.key], vb = b[tri.key]
        if (va == null && vb == null) return 0
        if (va == null) return 1
        if (vb == null) return -1
        const cmp = typeof va === 'string' ? va.localeCompare(vb, 'fr') : va - vb
        return tri.asc ? cmp : -cmp
      })
  }, [defavorisation, filtre, filtreNiveau, tri])

  const toggleTri = (key) => {
    setTri(prev => ({ key, asc: prev.key === key ? !prev.asc : true }))
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b border-gray-100 flex flex-wrap gap-3 items-center">
        <input
          type="text"
          placeholder="Rechercher une école..."
          value={filtre}
          onChange={e => setFiltre(e.target.value)}
          className="flex-1 min-w-48 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex gap-1">
          {['Tous', 'Primaire', 'Secondaire'].map(n => (
            <button
              key={n}
              onClick={() => setFiltreNiveau(n)}
              className={`px-3 py-1.5 text-xs rounded-md font-medium transition-colors ${
                filtreNiveau === n ? 'bg-blue-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              {COLONNES.map(col => (
                <th
                  key={col.key}
                  className={`px-4 py-3 cursor-pointer hover:bg-gray-100 select-none ${col.align === 'right' ? 'text-right' : ''}`}
                  onClick={() => toggleTri(col.key)}
                >
                  {col.label}
                  {tri.key === col.key && (
                    <span className="ml-1">{tri.asc ? '↑' : '↓'}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {donnees.map((d, i) => (
              <tr key={i} className={`border-t border-gray-100 hover:bg-gray-50 ${d.rang_imse >= 8 ? 'bg-red-50' : ''}`}>
                {COLONNES.map(col => (
                  <td key={col.key} className={`px-4 py-2.5 ${col.align === 'right' ? 'text-right' : ''} ${col.key === 'nom' ? 'font-medium text-gray-800' : ''}`}>
                    {col.badge ? (
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${badgeClass(d[col.key])}`}>
                        {d[col.key] || '—'}
                      </span>
                    ) : col.format ? col.format(d[col.key]) : d[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-3 text-xs text-gray-400 border-t border-gray-100">
        {donnees.length} école(s) — Cliquer sur les en-têtes pour trier | IMSE : Indice de milieu socioéconomique | SFR : Seuil de faible revenu
      </div>
    </div>
  )
}
