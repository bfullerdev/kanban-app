import Sidebar from './components/Sidebar';
import BoardHeader from './components/BoardHeader';

function App() {
  const handleAddTask = () => {
    console.log('Add new task');
  };

  return (
    <div className="flex bg-background min-h-screen">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <BoardHeader title="Platform Launch" onAddTask={handleAddTask} />
      </main>
    </div>
  );
}

export default App;
