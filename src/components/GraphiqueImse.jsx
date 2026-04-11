import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

export default function GraphiqueImse({ defavorisation }) {
  const distImse = useMemo(() => {
    const counts = Array(10).fill(0)
    defavorisation.forEach(d => {
      if (d.rang_imse) counts[d.rang_imse - 1]++
    })
    return counts.map((c, i) => ({ rang: `${i + 1}`, ecoles: c }))
  }, [defavorisation])

  const topDefav = useMemo(() => {
    return defavorisation
      .filter(d => d.rang_imse && d.rang_imse >= 7)
      .sort((a, b) => b.imse - a.imse)
      .slice(0, 10)
  }, [defavorisation])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-1">Distribution des rangs IMSE</h2>
        <p className="text-sm text-gray-500 mb-6">
          Les déciles 8 à 10 (en rouge) indiquent les milieux défavorisés.
        </p>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={distImse}>
            <XAxis dataKey="rang" label={{ value: 'Décile IMSE', position: 'insideBottom', offset: -5 }} />
            <YAxis allowDecimals={false} label={{ value: 'Écoles', angle: -90, position: 'insideLeft' }} />
            <Tooltip formatter={(v) => [`${v} école(s)`, '']} />
            <Bar dataKey="ecoles" radius={[4, 4, 0, 0]}>
              {distImse.map((_, i) => (
                <Cell key={i} fill={i >= 7 ? '#ef4444' : i >= 4 ? '#f59e0b' : '#2563eb'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-1">Écoles les plus défavorisées</h2>
        <p className="text-sm text-gray-500 mb-4">Top 10 — IMSE le plus élevé (rang ≥ 7)</p>
        {topDefav.length === 0 ? (
          <p className="text-gray-400 text-sm">Aucune école avec rang IMSE ≥ 7</p>
        ) : (
          <div className="space-y-2">
            {topDefav.map((d, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs text-gray-400 w-4">{i + 1}.</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-800 truncate">{d.nom}</span>
                    <span className="text-xs text-gray-400">{d.niveau}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 mt-1">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${(d.imse / 20) * 100}%`,
                        backgroundColor: d.rang_imse >= 8 ? '#ef4444' : '#f59e0b'
                      }}
                    />
                  </div>
                </div>
                <span className="text-xs font-mono text-gray-500 w-10 text-right">{d.imse.toFixed(1)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
