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
  const [editingTask, setEditingTask] = useState<Task | null | undefined>(undefined);

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
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

      const updatedTask = { ...task, status: targetColumnId as 'todo' | 'doing' | 'done' };

      updateBoard((prev: Board) => ({
        ...prev,
        columns: prev.columns.map((col) => {
          if (col.id === targetColumnId) {
            const existingIndex = col.tasks.findIndex((t) => t.id === taskId);
            if (existingIndex !== -1) {
              return { ...col, tasks: col.tasks.filter((t) => t.id !== taskId) };
            }
            return { ...col, tasks: [...col.tasks, updatedTask] };
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
      <BoardHeader title={activeBoard.title} onOpenModal={() => setEditingTask(null)} />
      <div className="flex gap-4 px-6 py-4 overflow-x-auto flex-1 min-h-0">
        {activeBoard.columns.map((column) => (
          <Column key={column.id} column={column} onEditTask={handleEditTask} />
        ))}
      </div>
      {editingTask !== undefined && (
        <TaskModal
          board={activeBoard}
          updateBoard={updateBoard}
          onClose={() => setEditingTask(undefined)}
          task={editingTask ?? undefined}
        />
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
