import { useRef, useState } from 'react';
import { DndContext, useSensor, PointerSensor } from '@dnd-kit/core';
import Sidebar from './components/Sidebar';
import BoardHeader from './components/BoardHeader';
import Column from './components/Column';
import TaskModal from './components/TaskModal';
import { useBoardData } from './hooks/useBoardData';
import { moveTask, reorderTask } from './utils/boardUpdater';
import type { Task, Board } from './types';

interface BoardContentProps {
  activeBoard: Board;
  updateBoard: (fn: Board | ((prev: Board) => Board)) => void;
}

function BoardContent({ activeBoard, updateBoard }: BoardContentProps) {
  const [editingTask, setEditingTask] = useState<Task | null | undefined>(undefined);
  const previousBoard = useRef(activeBoard);
  const pointerSensor = useSensor(PointerSensor);

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
  };

  return (
    <DndContext
      sensors={[pointerSensor]}
      onDragOver={({ active, over }) => {
        if (active?.id === undefined) return;
      }}
      onDragEnd={({ active, over }) => {
        if (!over || !activeBoard) {
          if (activeBoard) {
            updateBoard(previousBoard.current);
          }
          return;
        }

        const isTargetSortable = over.data?.current?.sortable;
        const targetGroup = isTargetSortable ? over.data.current.sortable.containerId : over.id;
        const targetIndex = isTargetSortable ? over.data.current.sortable.index : undefined;

        if (isTargetSortable && active.data?.current?.sortable && active.data.current.sortable.containerId === targetGroup && active.data.current.sortable.index !== targetIndex) {
          updateBoard((prev: Board) => reorderTask(prev, active.id as string, targetGroup as string, targetIndex as number));
        } else if (targetGroup && targetGroup !== (active.data?.current?.sortable?.containerId)) {
          updateBoard((prev: Board) => moveTask(prev, active.id as string, targetGroup, targetIndex));
        }
        
        previousBoard.current = activeBoard;
      }}
    >
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
    </DndContext>
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
        {activeBoard ? (
          <BoardContent activeBoard={activeBoard} updateBoard={updateBoard} />
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
