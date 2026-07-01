import { DragDropProvider, useDragDropMonitor } from '@dnd-kit/react';
import { PointerSensor } from '@dnd-kit/dom';
import Sidebar from './components/Sidebar';
import BoardHeader from './components/BoardHeader';
import Column from './components/Column';
import { useBoardData } from './hooks/useBoardData';
import type { Task, Board } from './types';

function BoardContent() {
  const { activeBoard, updateBoard } = useBoardData();

  const handleAddTask = () => {
    console.log('Add new task');
  };

  const handleEditTask = (task: Task) => {
    console.log('Edit task:', task.id);
  };

  useDragDropMonitor({
    onDragEnd: ({ operation }) => {
      if (!operation.source || !operation.target || !activeBoard) return;

      const sourceId = operation.source.id as string;
      const targetId = operation.target.id as string;

      const sourceColumn = activeBoard.columns.find((c) => c.id === sourceId);
      if (!sourceColumn) return;

      const task = sourceColumn.tasks.find((t) => t.id === sourceId);
      if (!task) return;

      updateBoard((prev: Board) => ({
        ...prev,
        columns: prev.columns.map((col) => {
          if (col.id === targetId) {
            const existingIndex = col.tasks.findIndex((t) => t.id === sourceId);
            if (existingIndex !== -1) {
              return { ...col, tasks: col.tasks.filter((t) => t.id !== sourceId) };
            }
            return { ...col, tasks: [...col.tasks, task] };
          }
          if (col.id === sourceId) {
            return { ...col, tasks: col.tasks.filter((t) => t.id !== sourceId) };
          }
          return col;
        }),
      }));
    },
  });

  return (
    <>
      <BoardHeader title={activeBoard!.title} onAddTask={handleAddTask} />
      <div className="flex gap-4 px-6 py-4 overflow-x-auto">
        {activeBoard!.columns.map((column) => (
          <Column key={column.id} column={column} onEditTask={handleEditTask} />
        ))}
      </div>
    </>
  );
}

function App() {
  const { boards, activeBoardId, activeBoard, selectBoard } = useBoardData();

  return (
    <div className="flex bg-background min-h-screen">
      <Sidebar
        boards={boards}
        activeBoardId={activeBoardId}
        onSelectBoard={selectBoard}
      />
      <main className="flex-1 flex flex-col">
        {activeBoard ? (
          <DragDropProvider sensors={[PointerSensor]}>
            <BoardContent />
          </DragDropProvider>
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
