import { useState } from 'react';
import { DragDropProvider, useDragDropMonitor } from '@dnd-kit/react';
import { PointerSensor } from '@dnd-kit/dom';
import Sidebar from './components/Sidebar';
import BoardHeader from './components/BoardHeader';
import Column from './components/Column';
import TaskModal from './components/TaskModal';
import { useBoardData } from './hooks/useBoardData';
import type { Task, Board } from './types';

interface BoardContentProps {
  activeBoard: Board;
  updateBoard: (fn: Board | ((prev: Board) => Board)) => void;
}

function BoardContent({ activeBoard, updateBoard }: BoardContentProps) {
  const [showModal, setShowModal] = useState(false);

  const handleEditTask = (task: Task) => {
    console.log('Edit task:', task.id);
  };

  useDragDropMonitor({
    onDragEnd: ({ operation }) => {
      if (!operation.source || !operation.target || !activeBoard) return;

      const taskId = operation.source.id as string;
      const targetColumnId = operation.target.id as string;

      const sourceColumn = activeBoard.columns.find((c) =>
        c.tasks.some((t) => t.id === taskId)
      );
      if (!sourceColumn) return;

      if (targetColumnId === sourceColumn.id) return;

      const task = sourceColumn.tasks.find((t) => t.id === taskId);
      if (!task) return;

      updateBoard((prev: Board) => ({
        ...prev,
        columns: prev.columns.map((col) => {
          if (col.id === targetColumnId) {
            const existingIndex = col.tasks.findIndex((t) => t.id === taskId);
            if (existingIndex !== -1) {
              return { ...col, tasks: col.tasks.filter((t) => t.id !== taskId) };
            }
            return { ...col, tasks: [...col.tasks, task] };
          }
          if (col.id === sourceColumn.id) {
            return { ...col, tasks: col.tasks.filter((t) => t.id !== taskId) };
          }
          return col;
        }),
      }));
    },
  });

  return (
    <>
      <BoardHeader title={activeBoard.title} onOpenModal={() => setShowModal(true)} />
      <div className="flex gap-4 px-6 py-4 overflow-x-auto flex-1 min-h-0">
        {activeBoard.columns.map((column) => (
          <Column key={column.id} column={column} onEditTask={handleEditTask} />
        ))}
      </div>
      {showModal && (
        <TaskModal board={activeBoard} updateBoard={updateBoard} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}

function App() {
  const { boards, activeBoardId, activeBoard, selectBoard, updateBoard } = useBoardData();

  return (
    <div className="flex bg-background min-h-screen">
      <Sidebar
        boards={boards}
        activeBoardId={activeBoardId}
        onSelectBoard={selectBoard}
      />
      <main className="flex-1 flex flex-col">
        <DragDropProvider sensors={[PointerSensor]}>
          {activeBoard ? (
            <BoardContent activeBoard={activeBoard} updateBoard={updateBoard} />
          ) : (
            <div className="flex items-center justify-center flex-1">
              <p className="text-white/40">Select a board to get started</p>
            </div>
          )}
        </DragDropProvider>
      </main>
    </div>
  );
}

export default App;
