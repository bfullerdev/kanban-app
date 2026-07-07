import { useDroppable } from '@dnd-kit/core';
import type { Task, Column as ColumnType } from '../types';
import TaskCard from './TaskCard';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

interface ColumnProps {
  column: ColumnType;
  onEditTask: (task: Task) => void;
}

export default function Column({ column, onEditTask }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  return (
    <div
      ref={setNodeRef}
      data-id={column.id}
      className={`flex flex-col w-80 flex-1 min-h-0 rounded-xl transition-colors ${
        isOver ? 'bg-[#2a2a3a]' : 'bg-[#1a1a2a]'
      }`}
    >
      <div className="flex items-center gap-2 mb-3 px-1 flex-shrink-0">
        <span
          className="w-3 h-3 rounded-full flex-shrink-0"
          style={{ backgroundColor: column.color }}
        />
        <h2 className="text-sm font-semibold text-white/80">
          {column.title} ({column.tasks.length})
        </h2>
      </div>

      <div className={`flex flex-col gap-2 overflow-y-auto flex-1 min-h-0 no-scrollbar transition-colors ${
        isOver ? 'bg-white/5' : 'bg-[#1a1a2a]'
      }`} style={{ scrollbarWidth: 'none' }}>
        <SortableContext id={column.id} items={column.tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {column.tasks.map((task, index) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEditTask}
              index={index}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}
