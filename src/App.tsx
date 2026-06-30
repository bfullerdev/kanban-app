import Sidebar from './components/Sidebar';

function App() {
  return (
    <div className="flex bg-background min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6">
        <h1 className="text-4xl font-bold text-primary">Kanban Board</h1>
      </main>
    </div>
  );
}

export default App;
