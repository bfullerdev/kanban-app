import type { Task, Column as ColumnType } from '../types';
import TaskCard from './TaskCard';

interface ColumnProps {
  column: ColumnType;
  onEditTask: (task: Task) => void;
}

export default function Column({ column, onEditTask }: ColumnProps) {
  return (
    <div className="flex flex-col w-80 rounded-xl bg-[#1a1a2a] p-3">
      <div className="flex items-center gap-2 mb-3 px-1">
        <span
          className="w-3 h-3 rounded-full flex-shrink-0"
          style={{ backgroundColor: column.color }}
        />
        <h2 className="text-sm font-semibold text-white/80">
          {column.title} ({column.tasks.length})
        </h2>
      </div>

      <div className="flex flex-col gap-2 overflow-y-auto">
        {column.tasks.map((task) => (
          <TaskCard key={task.id} task={task} onEdit={onEditTask} />
        ))}
      </div>
    </div>
  );
}
