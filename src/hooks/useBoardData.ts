import { useState, useCallback } from 'react';
import type { Board } from '../types';

const STORAGE_KEY = 'kanban-board';

// TODO: Replace localStorage logic here with API calls (e.g., fetch/axios) later.
function loadBoard(): Board | null {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

function saveBoard(board: Board): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(board));
}

export function useBoardData() {
  const [board, setBoard] = useState<Board | null>(loadBoard);

  const updateBoard = useCallback((updateFn: Board | ((prev: Board | null) => Board | null)) => {
    setBoard((prev) => {
      const next = typeof updateFn === 'function' ? updateFn(prev) : updateFn;
      if (next) saveBoard(next);
      return next;
    });
  }, []);

  return { board, updateBoard };
}
