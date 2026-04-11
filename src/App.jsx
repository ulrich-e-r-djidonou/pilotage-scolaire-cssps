import { useState } from 'react'
import ecoles from './data_ecoles.json'
import defavorisation from './data_defavorisation.json'
import KpiCards from './components/KpiCards'
import TableauEcoles from './components/TableauEcoles'
import GraphiqueImse from './components/GraphiqueImse'
import Repartition from './components/Repartition'
import CarteEcoles from './components/CarteEcoles'

const ONGLETS = [
  { id: 'tableau', label: 'Tableau des écoles' },
  { id: 'carte', label: 'Carte' },
  { id: 'imse', label: 'Défavorisation' },
  { id: 'repartition', label: 'Répartition' },
]

function App() {
  const [onglet, setOnglet] = useState('tableau')

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-800 text-white py-6 px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold">Pilotage scolaire — CSSPS</h1>
          <p className="text-blue-200 mt-1">
            Centre de services scolaire des Premières-Seigneuries | Données ouvertes MEQ 2024-2025
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        <KpiCards ecoles={ecoles} defavorisation={defavorisation} />

        <div className="flex gap-1 mb-6 border-b border-gray-200 overflow-x-auto">
          {ONGLETS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setOnglet(tab.id)}
              className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap ${
                onglet === tab.id
                  ? 'border-blue-800 text-blue-800'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {onglet === 'tableau' && <TableauEcoles defavorisation={defavorisation} />}
        {onglet === 'carte' && <CarteEcoles ecoles={ecoles} defavorisation={defavorisation} />}
        {onglet === 'imse' && <GraphiqueImse defavorisation={defavorisation} />}
        {onglet === 'repartition' && <Repartition ecoles={ecoles} defavorisation={defavorisation} />}

        <footer className="mt-12 text-center text-xs text-gray-400 pb-8">
          <p>Source : Données ouvertes du MEQ — donneesquebec.ca | Année scolaire 2024-2025</p>
          <p className="mt-1">IMSE : Indice de milieu socioéconomique | SFR : Seuil de faible revenu</p>
        </footer>
      </main>
    </div>
  )
}

export default App
