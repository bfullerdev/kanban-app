import { useEffect, useRef, useState } from 'react';
import {
  closestCorners,
  DndContext,
  DragOverlay,
  pointerWithin,
  useSensor,
  PointerSensor,
  type CollisionDetection,
  type Over,
} from '@dnd-kit/core';
import { GripVertical, CheckSquare } from 'lucide-react';
import Sidebar from './components/Sidebar';
import BoardHeader from './components/BoardHeader';
import Column from './components/Column';
import TaskModal from './components/TaskModal';
import BoardModal from './components/BoardModal';
import { useBoardData } from './hooks/useBoardData';
import { moveTask, reorderTask } from './utils/boardUpdater';
import type { Task, Board } from './types';

interface BoardContentProps {
  activeBoard: Board;
  updateBoard: (fn: Board | ((prev: Board) => Board)) => void;
}

const pointerFirstCollisionDetection: CollisionDetection = (args) => {
  const pointerCollisions = pointerWithin(args);
  const sortablePointerCollisions = pointerCollisions.filter(({ id }) => {
    const container = args.droppableContainers.find((droppable) => droppable.id === id);

    return container?.data.current?.sortable;
  });

  if (sortablePointerCollisions.length > 0) {
    return sortablePointerCollisions;
  }

  return pointerCollisions.length > 0 ? pointerCollisions : closestCorners(args);
};

function getTaskLocation(board: Board, taskId: string) {
  for (const column of board.columns) {
    const taskIndex = column.tasks.findIndex((task) => task.id === taskId);
    if (taskIndex !== -1) {
      return { columnId: column.id, taskIndex };
    }
  }

  return null;
}

function getDragTarget(board: Board, over: Over) {
  const targetSortable = over.data?.current?.sortable;
  const targetColumnId = targetSortable ? targetSortable.containerId : over.id;
  const targetColumn = board.columns.find((column) => column.id === targetColumnId);

  if (!targetColumn) return null;

  if (!targetSortable) {
    return { columnId: targetColumnId, taskIndex: targetColumn.tasks.length };
  }

  return {
    columnId: targetColumnId,
    taskIndex: typeof targetSortable.index === 'number' ? targetSortable.index : targetColumn.tasks.length,
  };
}

function BoardContent({ activeBoard, updateBoard }: BoardContentProps) {
  const [editingTask, setEditingTask] = useState<Task | null | undefined>(undefined);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const previousBoard = useRef(activeBoard);
  const clearDraggedTaskTimeout = useRef<number | null>(null);
  const pointerSensor = useSensor(PointerSensor);

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
  };

  useEffect(() => () => {
    if (clearDraggedTaskTimeout.current !== null) {
      window.clearTimeout(clearDraggedTaskTimeout.current);
    }
  }, []);

  return (
    <DndContext
      collisionDetection={pointerFirstCollisionDetection}
      sensors={[pointerSensor]}
      onDragStart={({ active }) => {
        if (clearDraggedTaskTimeout.current !== null) {
          window.clearTimeout(clearDraggedTaskTimeout.current);
          clearDraggedTaskTimeout.current = null;
        }
        previousBoard.current = activeBoard;
        const task = activeBoard?.columns.flatMap(c => c.tasks).find(t => t.id === active.id);
        if (task) setDraggedTask(task);
      }}
      onDragCancel={() => {
        if (clearDraggedTaskTimeout.current !== null) {
          window.clearTimeout(clearDraggedTaskTimeout.current);
          clearDraggedTaskTimeout.current = null;
        }
        updateBoard(previousBoard.current);
        setDraggedTask(null);
      }}
      onDragOver={({ active, over }) => {
        if (active?.id === undefined || !over) return;

        const sourceLocation = getTaskLocation(activeBoard, active.id as string);
        const target = getDragTarget(activeBoard, over);

        if (!sourceLocation || !target) return;

        if (sourceLocation.columnId !== target.columnId) {
          updateBoard((prev: Board) => moveTask(prev, active.id as string, target.columnId, target.taskIndex));
        }
      }}
      onDragEnd={({ active, over }) => {
        clearDraggedTaskTimeout.current = window.setTimeout(() => {
          setDraggedTask(null);
          clearDraggedTaskTimeout.current = null;
        }, 250);

        if (!over || !activeBoard) {
          updateBoard(previousBoard.current);
          return;
        }

        const sourceLocation = getTaskLocation(activeBoard, active.id as string);
        const target = getDragTarget(activeBoard, over);

        if (!sourceLocation || !target) return;

        if (sourceLocation.columnId === target.columnId && sourceLocation.taskIndex !== target.taskIndex) {
          updateBoard((prev: Board) => reorderTask(prev, active.id as string, target.columnId, target.taskIndex));
        } else if (sourceLocation.columnId !== target.columnId) {
          updateBoard((prev: Board) => moveTask(prev, active.id as string, target.columnId, target.taskIndex));
        }
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
      {draggedTask && (
        <DragOverlay>
          <div className="p-3 rounded-lg bg-[#2a2a3a] border border-white/10 shadow-lg w-80 opacity-90">
            <div className="flex items-start gap-2">
              <GripVertical className="w-4 h-4 text-white/30 mt-0.5" />
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-white">{draggedTask.title}</h3>
                {draggedTask.description && (
                  <p className="mt-1 text-xs text-white/50 line-clamp-2">{draggedTask.description}</p>
                )}
                {draggedTask.subtasks.length > 0 && (
                  <div className="mt-2 flex items-center gap-1.5">
                    <CheckSquare className="w-3.5 h-3.5 text-white/40" />
                    <span className="text-xs text-white/40">
                      {draggedTask.subtasks.filter(s => s.completed).length} of {draggedTask.subtasks.length} subtasks
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </DragOverlay>
      )}
    </DndContext>
  );
}

function App() {
  const { boards, activeBoardId, activeBoard, selectBoard, updateBoard, createBoard } = useBoardData();
  const [showBoardModal, setShowBoardModal] = useState(false);

  return (
    <div className="flex bg-background min-h-screen">
      <Sidebar
        boards={boards}
        activeBoardId={activeBoardId}
        onSelectBoard={selectBoard}
        onCreateBoard={() => setShowBoardModal(true)}
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
      {showBoardModal && (
        <BoardModal
          onClose={() => setShowBoardModal(false)}
          onCreate={(title) => {
            createBoard(title);
            setShowBoardModal(false);
          }}
        />
      )}
    </div>
  );
}

export default App;
