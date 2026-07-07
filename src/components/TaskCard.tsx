import { CheckSquare, GripVertical } from 'lucide-react';
import { defaultAnimateLayoutChanges, useSortable, type AnimateLayoutChanges } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Task } from '../types';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  index: number;
}

const animateWhileSorting: AnimateLayoutChanges = (args) => (
  args.isSorting ? defaultAnimateLayoutChanges(args) : false
);

export default function TaskCard({ task, onEdit }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    animateLayoutChanges: animateWhileSorting,
  });

  const completedCount = task.subtasks.filter((s) => s.completed).length;

  const style = {
    transition: transform ? 'transform 0.3s ease' : transition,
    transform: CSS.Translate.toString(transform),
    transformOrigin: '0 0',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      data-id={task.id}
      className={`transition-opacity duration-200 ${isDragging ? 'opacity-50' : 'opacity-100'}`}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onEdit(task);
        }}
        className="w-full text-left p-3 rounded-lg bg-surface border border-white/5 shadow-sm hover:border-white/10 hover:shadow-md transition-all cursor-pointer"
      >
        <div className="flex items-start gap-2">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing mt-0.5 select-none p-1 hover:bg-white/5 rounded"
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
