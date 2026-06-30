import Sidebar from './components/Sidebar';
import BoardHeader from './components/BoardHeader';
import Column from './components/Column';
import { useBoardData } from './hooks/useBoardData';
import type { Task } from './types';

function App() {
  const { boards, activeBoardId, activeBoard, selectBoard } = useBoardData();

  const handleAddTask = () => {
    console.log('Add new task');
  };

  const handleEditTask = (task: Task) => {
    console.log('Edit task:', task.id);
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
          <>
            <BoardHeader title={activeBoard.title} onAddTask={handleAddTask} />
            <div className="flex gap-4 px-6 py-4 overflow-x-auto">
              {activeBoard.columns.map((column) => (
                <Column key={column.id} column={column} onEditTask={handleEditTask} />
              ))}
            </div>
          </>
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
