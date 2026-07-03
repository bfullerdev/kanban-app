import { CheckSquare, GripVertical } from 'lucide-react';
import { useSortable } from '@dnd-kit/react/sortable';
import type { Task } from '../types';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  index: number;
}

export default function TaskCard({ task, onEdit, index }: TaskCardProps) {
  const { sortable, isDragging, handleRef, ref } = useSortable({
    id: task.id,
    index,
  });
  const { draggable: _draggable, register: _register, unregister: _unregister, destroy: _destroy, ...sortableProps } = sortable;

  const completedCount = task.subtasks.filter((s) => s.completed).length;

  return (
    <div
      {...sortableProps}
      ref={ref}
      data-id={task.id}
      className={`transition-all duration-200 ${isDragging ? 'opacity-50' : 'opacity-100'}`}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onEdit(task);
        }}
        className="w-full text-left p-3 rounded-lg bg-surface border border-white/5 shadow-sm hover:border-white/10 hover:shadow-md transition-all cursor-pointer"
        ref={handleRef}
      >
        <div className="flex items-start gap-2">
          <div
            className="cursor-grab active:cursor-grabbing mt-0.5 select-none"
          >
            <GripVertical className="w-4 h-4 text-white/30 hover:text-white/60" />
          </div>
          <div className="flex-1 min-w-0">
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
          </div>
        </div>
      </button>
    </div>
  );
}
