import { GripVertical, CheckSquare } from 'lucide-react';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import Sidebar from './components/Sidebar';
import BoardHeader from './components/BoardHeader';
import Column from './components/Column';
import TaskModal from './components/TaskModal';
import { useBoardData } from './hooks/useBoardData';
import { useKanbanDrag } from './hooks/useKanbanDrag';
import type { Board } from './types';

function BoardContent({ activeBoard, updateBoard }: { activeBoard: Board; updateBoard: (fn: Board | ((prev: Board) => Board)) => void }) {
  const {
    sensors,
    collisionDetection,
    handleDragStart,
    handleDragCancel,
    handleDragOver,
    handleDragEnd,
    draggedTask,
    overlayWidth,
    editingTask,
    setEditingTask,
  } = useKanbanDrag({ activeBoard, updateBoard });

  return (
    <DndContext
      collisionDetection={collisionDetection}
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragCancel={handleDragCancel}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <>
        <BoardHeader title={activeBoard.title} onOpenModal={() => setEditingTask(null)} />
        <div className="flex gap-4 px-6 py-4 overflow-x-auto flex-1 min-h-0">
          {activeBoard.columns.map((column) => (
            <Column
              key={column.id}
              column={column}
              tasks={activeBoard.tasks.filter((t) => t.columnId === column.id)}
              onEditTask={(t) => setEditingTask(t)}
            />
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
          <div className="p-3 rounded-lg bg-[#2a2a3a] border border-white/10 shadow-lg opacity-90" style={{ minWidth: overlayWidth, width: overlayWidth }}>
            <div className="flex items-start gap-2">
              <span className="inline-flex items-center justify-center mt-0.5 select-none p-1 hover:bg-white/5 rounded">
                <GripVertical className="w-4 h-4 text-white/30 hover:text-white/60 cursor-grab active:cursor-grabbing" />
              </span>
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
