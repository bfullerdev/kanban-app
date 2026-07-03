import type { Board, Task } from '../types';

export function moveTask(board: Board, taskId: string, targetColumnId: string, updatedTask?: Task): Board {
  const sourceColumn = board.columns.find((c) =>
    c.tasks.some((t) => t.id === taskId)
  );

  if (!sourceColumn) return board;
  if (targetColumnId === sourceColumn.id) return board;

  const task = sourceColumn.tasks.find((t) => t.id === taskId);
  if (!task) return board;

  const baseTask = updatedTask ?? { ...task };
  const finalTask = { ...baseTask, status: targetColumnId as Task['status'] };

  return {
    ...board,
    columns: board.columns.map((col) => {
      if (col.id === targetColumnId) {
        const existingIndex = col.tasks.findIndex((t) => t.id === taskId);
        if (existingIndex !== -1) {
          return { ...col, tasks: col.tasks.filter((t) => t.id !== taskId) };
        }
        return { ...col, tasks: [...col.tasks, finalTask] };
      }
      if (col.id === sourceColumn.id) {
        return { ...col, tasks: col.tasks.filter((t) => t.id !== taskId) };
      }
      return col;
    }),
  };
}

export function updateTaskInBoard(board: Board, updatedTask: Task): Board {
  return {
    ...board,
    columns: board.columns.map((col) => {
      if (col.tasks.some((t) => t.id === updatedTask.id)) {
        return { ...col, tasks: col.tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)) };
      }
      return col;
    }),
  };
}
