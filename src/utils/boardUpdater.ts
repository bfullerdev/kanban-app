import type { Board, Task } from '../types';

export function moveTask(board: Board, taskId: string, targetColumnId: string, targetIndex?: number, updatedTask?: Task): Board {
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
        if (targetIndex !== undefined && targetIndex >= 0 && targetIndex <= col.tasks.length) {
          const newTasks = [...col.tasks];
          newTasks.splice(targetIndex, 0, finalTask);
          return { ...col, tasks: newTasks };
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

export function reorderTask(board: Board, taskId: string, targetColumnId: string, targetIndex: number): Board {
  const sourceColumn = board.columns.find((c) =>
    c.tasks.some((t) => t.id === taskId)
  );

  if (!sourceColumn) return board;
  if (targetIndex < 0 || targetIndex > sourceColumn.tasks.length) return board;

  const task = sourceColumn.tasks.find((t) => t.id === taskId);
  if (!task) return board;

  const newTasks = sourceColumn.tasks.filter((t) => t.id !== taskId);
  newTasks.splice(targetIndex, 0, task);

  return {
    ...board,
    columns: board.columns.map((col) => {
      if (col.id === targetColumnId) {
        return { ...col, tasks: newTasks };
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
