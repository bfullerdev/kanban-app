import { useState } from 'react';
import { X, Plus, Check } from 'lucide-react';
import type { Board } from '../types';

interface TaskModalProps {
  board: Board;
  updateBoard: (fn: Board | ((prev: Board) => Board)) => void;
  onClose: () => void;
}

interface SubtaskInput {
  id: string;
  title: string;
}

export default function TaskModal({ board, updateBoard, onClose }: TaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subtaskInputs, setSubtaskInputs] = useState<SubtaskInput[]>([{ id: crypto.randomUUID(), title: '' }]);
  const [status, setStatus] = useState<'todo' | 'doing' | 'done'>(
    (board.columns[0]?.id as 'todo' | 'doing' | 'done') || 'todo'
  );

  const addSubtaskInput = () => {
    setSubtaskInputs([...subtaskInputs, { id: crypto.randomUUID(), title: '' }]);
  };

  const removeSubtaskInput = (id: string) => {
    setSubtaskInputs(subtaskInputs.filter((s) => s.id !== id));
  };

  const updateSubtaskInput = (id: string, value: string) => {
    setSubtaskInputs(subtaskInputs.map((s) => (s.id === id ? { ...s, title: value } : s)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const subtasks = subtaskInputs
      .filter((s) => s.title.trim())
      .map((s) => ({
        id: crypto.randomUUID(),
        title: s.title.trim(),
        completed: false,
      }));

    const newTask = {
      id: crypto.randomUUID(),
      title: title.trim(),
      description: description.trim(),
      status,
      subtasks,
    };

    updateBoard((prev: Board) => ({
      ...prev,
      columns: prev.columns.map((col) =>
        col.id === status ? { ...col, tasks: [...col.tasks, newTask] } : col
      ),
    }));

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-lg mx-4 bg-surface border border-white/10 rounded-xl shadow-2xl">
        <form onSubmit={handleSubmit}>
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
            <h2 className="text-lg font-semibold">New Task</h2>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="px-6 py-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Task title"
                className="w-full px-3 py-2 bg-background border border-white/10 rounded-lg text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary/50 transition-colors"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional description"
                rows={3}
                className="w-full px-3 py-2 bg-background border border-white/10 rounded-lg text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary/50 transition-colors resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'todo' | 'doing' | 'done')}
                className="w-full px-3 py-2 bg-background border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-primary/50 transition-colors"
              >
                {board.columns.map((col) => (
                  <option key={col.id} value={col.id}>
                    {col.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">Subtasks</label>
              <div className="space-y-2">
                {subtaskInputs.map((input) => (
                  <div key={input.id} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={input.title}
                      onChange={(e) => updateSubtaskInput(input.id, e.target.value)}
                      placeholder="Subtask"
                      className="flex-1 px-3 py-2 bg-background border border-white/10 rounded-lg text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary/50 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => removeSubtaskInput(input.id)}
                      className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-white/5 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addSubtaskInput}
                className="flex items-center gap-1.5 mt-2 text-sm text-primary hover:text-primary/80 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add subtask
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-white/60 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <Check className="w-4 h-4" />
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
