import { DndContext, closestCorners, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import Sidebar from './components/Sidebar';
import BoardHeader from './components/BoardHeader';
import Column from './components/Column';
import { useBoardData } from './hooks/useBoardData';
import type { Task } from './types';

function App() {
  const { boards, activeBoardId, activeBoard, selectBoard, updateBoard } = useBoardData();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragEnd = ({ active, over }: { active: { id: string }; over: { id: string } | null }) => {
    if (!activeBoard || !over) return;

    const taskId = active.id;
    const overId = over.id;

    if (taskId === overId) return;

    updateBoard((prev) => {
      const columns = prev.columns.map((col) => ({
        ...col,
        tasks: [...col.tasks],
      }));

      let sourceCol: typeof columns[0] | null = null;
      let sourceIdx = -1;
      for (const col of columns) {
        const idx = col.tasks.findIndex((t) => t.id === taskId);
        if (idx !== -1) {
          sourceCol = col;
          sourceIdx = idx;
          break;
        }
      }

      if (!sourceCol) return prev;

      const destCol = columns.find(
        (col) => col.id === overId || col.tasks.some((t) => t.id === overId)
      );
      if (!destCol) return prev;

      if (sourceCol.id === destCol.id) {
        const [moved] = sourceCol.tasks.splice(sourceIdx, 1);
        const newIdx = sourceCol.tasks.findIndex((t) => t.id === overId);
        const insertAt = newIdx === -1 ? sourceCol.tasks.length : newIdx;
        sourceCol.tasks.splice(insertAt, 0, moved);
      } else {
        const [moved] = sourceCol.tasks.splice(sourceIdx, 1);
        moved.status = destCol.id as Task['status'];
        const newIdx = destCol.tasks.findIndex((t) => t.id === overId);
        const insertAt = newIdx === -1 ? destCol.tasks.length : newIdx;
        destCol.tasks.splice(insertAt, 0, moved);
      }

      return { ...prev, columns };
    });
  };

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
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragEnd={handleDragEnd}
          >
            <BoardHeader title={activeBoard.title} onAddTask={handleAddTask} />
            <div className="flex gap-4 px-6 py-4 overflow-x-auto">
              {activeBoard.columns.map((column) => (
                <Column key={column.id} column={column} onEditTask={handleEditTask} />
              ))}
            </div>
          </DndContext>
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
