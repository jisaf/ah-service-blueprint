import { Blueprint } from './components/Blueprint'

function App() {
  return (
    <div className="min-h-screen bg-background">
      <header className="p-4 border-b">
        <h1 className="text-2xl font-bold">Service Blueprint</h1>
      </header>
      <main>
        <Blueprint />
      </main>
    </div>
  )
}

export default App
