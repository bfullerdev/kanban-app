import { LayoutDashboard, Plus, Moon, Sun, PanelLeftClose } from 'lucide-react';
import type { Board } from '../types';

interface SidebarProps {
  boards: Board[];
  activeBoardId: string | null;
  onSelectBoard: (boardId: string) => void;
}

export default function Sidebar({ boards, activeBoardId, onSelectBoard }: SidebarProps) {
  return (
    <aside className="flex flex-col w-64 h-screen bg-surface border-r border-white/5">
      <div className="flex items-center gap-2 px-4 py-6 border-b border-white/5">
        <LayoutDashboard className="w-6 h-6 text-primary" />
        <span className="text-xl font-bold tracking-tight">kanban</span>
      </div>

      <nav className="flex-1 px-3 py-4">
        <h2 className="px-2 mb-2 text-xs font-semibold uppercase tracking-wider text-white/40">
          All Boards
        </h2>
        <ul className="space-y-1">
          {boards.map((board) => (
            <li key={board.id}>
              <button
                onClick={() => onSelectBoard(board.id)}
                className={`w-full flex items-center gap-2 px-2 py-2 rounded-lg text-sm transition-colors ${
                  board.id === activeBoardId
                    ? 'bg-primary/20 text-primary font-medium'
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                {board.title}
              </button>
            </li>
          ))}
        </ul>

        <button className="flex items-center gap-2 px-2 py-2 mt-2 rounded-lg text-sm text-primary hover:bg-white/5 transition-colors">
          <Plus className="w-4 h-4" />
          Create New Board
        </button>
      </nav>

      <footer className="flex items-center gap-1 px-3 py-4 border-t border-white/5">
        <button className="flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-white/60 hover:bg-white/5 hover:text-white transition-colors">
          <Moon className="w-4 h-4" />
          Dark
        </button>
        <button className="flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-white/60 hover:bg-white/5 hover:text-white transition-colors">
          <Sun className="w-4 h-4" />
          Light
        </button>
        <div className="flex-1" />
        <button className="flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-white/60 hover:bg-white/5 hover:text-white transition-colors">
          <PanelLeftClose className="w-4 h-4" />
          Hide
        </button>
      </footer>
    </aside>
  );
}
