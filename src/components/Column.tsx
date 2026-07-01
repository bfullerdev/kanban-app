import { useDroppable } from '@dnd-kit/react';
import type { Task, Column as ColumnType } from '../types';
import TaskCard from './TaskCard';

interface ColumnProps {
  column: ColumnType;
  onEditTask: (task: Task) => void;
}

export default function Column({ column, onEditTask }: ColumnProps) {
  const { ref: setDroppableRef, isDropTarget } = useDroppable({
    id: column.id,
  });

  return (
    <div data-id={column.id} className="flex flex-col w-80 rounded-xl bg-[#1a1a2a] p-3 overflow-hidden">
      <div className="flex items-center gap-2 mb-3 px-1">
        <span
          className="w-3 h-3 rounded-full flex-shrink-0"
          style={{ backgroundColor: column.color }}
        />
        <h2 className="text-sm font-semibold text-white/80">
          {column.title} ({column.tasks.length})
        </h2>
      </div>

      <div
        ref={setDroppableRef}
        className={`flex flex-col gap-2 overflow-y-auto min-h-[100px] no-scrollbar transition-colors ${
          isDropTarget ? 'bg-white/5' : ''
        }`}
        style={{ scrollbarWidth: 'none' }}
      >
        {column.tasks.map((task, index) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onEditTask}
            columnIndex={index}
            columnId={column.id}
          />
        ))}
      </div>
    </div>
  );
}
