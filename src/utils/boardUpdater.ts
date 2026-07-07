import type { Board, Task } from '../types';
import { arrayMove } from '@dnd-kit/sortable';

export function moveTask(board: Board, taskId: string, targetColumnId: string, targetIndex: number, updatedTask?: Task): Board {
  const taskIndex = board.tasks.findIndex((t) => t.id === taskId);
  if (taskIndex === -1) return board;

  const task = board.tasks[taskIndex];
  const baseTask = updatedTask ?? { ...task };
  const finalTask = { ...baseTask, columnId: targetColumnId };

  const newTasks = [...board.tasks];
  newTasks.splice(taskIndex, 1);
  newTasks.splice(targetIndex, 0, finalTask);

  return {
    ...board,
    tasks: newTasks,
  };
}

export function reorderTask(board: Board, taskId: string, targetColumnId: string, targetIndex: number): Board {
  const taskIndex = board.tasks.findIndex((t) => t.id === taskId);
  if (taskIndex === -1) return board;

  const task = board.tasks[taskIndex];
  
  // This is slightly different from moveTask because we don't change columnId
  // But in dnd-kit sortable, it might be called when just reordering within the same column
  // Or moving to another column if not handled by moveTask.
  
  // If it's a move between columns, it should technically be a moveTask call.
  // If it's a reorder in the same column, we use arrayMove.
  
  if (task.columnId === targetColumnId) {
    return {
      ...board,
      tasks: arrayMove(board.tasks, taskIndex, targetIndex),
    };
  }

  return moveTask(board, taskId, targetColumnId, targetIndex, task);
}

export function updateTaskInBoard(board: Board, updatedTask: Task): Board {
  return {
    ...board,
    tasks: board.tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)),
  };
}
