import type { Task } from '../types';

interface TaskCardProps {
  task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
  return (
    <div className="p-3 rounded-lg bg-surface border border-white/5 shadow-sm">
      <h3 className="text-sm font-medium text-white">{task.title}</h3>
      {task.description && (
        <p className="mt-1 text-xs text-white/50 line-clamp-2">{task.description}</p>
      )}
      {task.subtasks.length > 0 && (
        <div className="mt-2 flex items-center gap-1.5">
          <span className="text-xs text-white/40">
            {task.subtasks.filter((s) => s.completed).length}/{task.subtasks.length} subtasks
          </span>
        </div>
      )}
    </div>
  );
}
