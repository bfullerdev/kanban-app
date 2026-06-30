import { useState, useCallback, useEffect } from 'react';
import type { Board } from '../types';

const STORAGE_KEY = 'kanban-boards';
const ACTIVE_KEY = 'kanban-active-board';

// TODO: Replace localStorage logic here with API calls (e.g., fetch/axios) later.
function loadBoards(): Board[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

function saveBoards(boards: Board[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(boards));
}

function loadActiveId(): string | null {
  return localStorage.getItem(ACTIVE_KEY);
}

function saveActiveId(id: string): void {
  localStorage.setItem(ACTIVE_KEY, id);
}

function createDefaultBoards(): Board[] {
  return [
    {
      id: 'platform-launch',
      title: 'Platform Launch',
      columns: [
        { id: 'todo', title: 'To Do', color: '#6366f1', tasks: [] },
        { id: 'doing', title: 'In Progress', color: '#f59e0b', tasks: [] },
        { id: 'done', title: 'Done', color: '#10b981', tasks: [] },
      ],
    },
    {
      id: 'marketing-plan',
      title: 'Marketing Plan',
      columns: [
        { id: 'todo', title: 'To Do', color: '#6366f1', tasks: [] },
        { id: 'doing', title: 'In Progress', color: '#f59e0b', tasks: [] },
        { id: 'done', title: 'Done', color: '#10b981', tasks: [] },
      ],
    },
    {
      id: 'roadmap',
      title: 'Roadmap',
      columns: [
        { id: 'todo', title: 'To Do', color: '#6366f1', tasks: [] },
        { id: 'doing', title: 'In Progress', color: '#f59e0b', tasks: [] },
        { id: 'done', title: 'Done', color: '#10b981', tasks: [] },
      ],
    },
  ];
}

export function useBoardData() {
  const [boards, setBoards] = useState<Board[]>(() => {
    const stored = loadBoards();
    return stored.length > 0 ? stored : createDefaultBoards();
  });

  const [activeBoardId, setActiveBoardId] = useState<string | null>(() => {
    const stored = loadActiveId();
    return stored || boards[0]?.id || null;
  });

  useEffect(() => {
    saveBoards(boards);
  }, [boards]);

  useEffect(() => {
    if (activeBoardId) saveActiveId(activeBoardId);
  }, [activeBoardId]);

  const activeBoard = boards.find((b) => b.id === activeBoardId) || null;

  const selectBoard = useCallback((boardId: string) => {
    setActiveBoardId(boardId);
  }, []);

  const updateBoard = useCallback(
    (updateFn: Board | ((prev: Board) => Board)) => {
      setBoards((prev) => {
        const updated = prev.map((b) => {
          if (b.id !== activeBoardId) return b;
          if (typeof updateFn === 'function') {
            const result = updateFn(b);
            return result ?? b;
          }
          return updateFn;
        });
        saveBoards(updated);
        return updated;
      });
    },
    [activeBoardId],
  );

  return { boards, activeBoardId, activeBoard, selectBoard, updateBoard };
}
