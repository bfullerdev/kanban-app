import Sidebar from './components/Sidebar';
import BoardHeader from './components/BoardHeader';
import { useBoardData } from './hooks/useBoardData';

function App() {
  const { boards, activeBoardId, activeBoard, selectBoard } = useBoardData();

  const handleAddTask = () => {
    console.log('Add new task');
  };

  return (
    <div className="flex bg-background min-h-screen">
      <Sidebar
        boards={boards}
        activeBoardId={activeBoardId}
        onSelectBoard={selectBoard}
      />
      <main className="flex-1 flex flex-col">
        {activeBoard ? (
          <BoardHeader title={activeBoard.title} onAddTask={handleAddTask} />
        ) : (
          <div className="flex items-center justify-center flex-1">
            <p className="text-white/40">Select a board to get started</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
