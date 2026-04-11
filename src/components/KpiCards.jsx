export default function KpiCards({ ecoles, defavorisation }) {
  const nbEcoles = ecoles.length
  const nbEleves = defavorisation.filter(d => d.nb_eleves).reduce((s, d) => s + d.nb_eleves, 0)
  const ecolesAvecImse = defavorisation.filter(d => d.imse)
  const imseMoyen = ecolesAvecImse.reduce((s, d) => s + d.imse, 0) / ecolesAvecImse.length
  const nbDefav = defavorisation.filter(d => d.rang_imse && d.rang_imse >= 8).length
  const nbMunicipalites = new Set(ecoles.map(e => e.municipalite)).size

  const cards = [
    { label: 'Écoles', value: nbEcoles, sub: 'Tous ordres confondus' },
    { label: 'Élèves', value: nbEleves.toLocaleString('fr-CA'), sub: 'Primaire + secondaire' },
    { label: 'IMSE moyen', value: imseMoyen.toFixed(1), sub: 'Indice socioéconomique' },
    { label: 'Écoles défav.', value: nbDefav, sub: 'Rang IMSE ≥ 8', alert: nbDefav > 0 },
    { label: 'Municipalités', value: nbMunicipalites, sub: 'Territoire couvert' },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
      {cards.map((c, i) => (
        <div key={i} className="bg-white rounded-lg shadow p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wide">{c.label}</p>
          <p className={`text-2xl font-bold mt-1 ${c.alert ? 'text-red-600' : 'text-blue-800'}`}>{c.value}</p>
          {c.sub && <p className="text-xs text-gray-400 mt-1">{c.sub}</p>}
        </div>
      ))}
    </div>
  )
}
