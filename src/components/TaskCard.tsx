import { CheckSquare } from 'lucide-react';
import type { Task } from '../types';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

export default function TaskCard({ task, onEdit }: TaskCardProps) {
  const completedCount = task.subtasks.filter((s) => s.completed).length;

  return (
    <button
      onClick={() => onEdit(task)}
      className="w-full text-left p-3 rounded-lg bg-surface border border-white/5 shadow-sm hover:border-white/10 hover:shadow-md transition-all cursor-pointer"
    >
      <h3 className="text-sm font-medium text-white">{task.title}</h3>
      {task.description && (
        <p className="mt-1 text-xs text-white/50 line-clamp-2">{task.description}</p>
      )}
      {task.subtasks.length > 0 && (
        <div className="mt-2 flex items-center gap-1.5">
          <CheckSquare className="w-3.5 h-3.5 text-white/40" />
          <span className="text-xs text-white/40">
            {completedCount} of {task.subtasks.length} subtasks
          </span>
        </div>
      )}
    </button>
  );
}
