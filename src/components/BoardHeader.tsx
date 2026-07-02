import { Plus, MoreHorizontal } from 'lucide-react';

interface BoardHeaderProps {
  title: string;
  onOpenModal: () => void;
}

export default function BoardHeader({ title, onOpenModal }: BoardHeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 py-4">
      <h1 className="text-2xl font-bold">{title}</h1>
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenModal}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-sm font-medium text-white hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add New Task
        </button>
        <button className="p-2 rounded-lg text-white/60 hover:bg-white/5 hover:text-white transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
