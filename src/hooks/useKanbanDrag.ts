import { useState, useRef } from 'react';
import {
  closestCorners,
  pointerWithin,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
} from '@dnd-kit/core';
import { moveTask, reorderTask } from '../utils/boardUpdater';
import type { Board, Task } from '../types';

export function useKanbanDrag({ activeBoard, updateBoard }: { activeBoard: Board; updateBoard: (fn: Board | ((prev: Board) => Board)) => void }) {
  const [editingTask, setEditingTask] = useState<Task | null | undefined>(undefined);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [overlayWidth, setOverlayWidth] = useState<string | undefined>(undefined);
  const previousBoard = useRef(activeBoard);
  const clearDraggedTaskTimeout = useRef<number | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor)
  );

  const pointerFirstCollisionDetection = (args: any) => {
    const pointerCollisions = pointerWithin(args);
    const sortablePointerCollisions = pointerCollisions.filter(({ id }) => {
      const container = args.droppableContainers.find((droppable: any) => droppable.id === id);
      return container?.data.current?.sortable;
    });

    if (sortablePointerCollisions.length > 0) {
      return sortablePointerCollisions;
    }

    return pointerCollisions.length > 0 ? pointerCollisions : closestCorners(args);
  };

  function getDragTarget(board: Board, over: any) {
    const targetSortable = over.data?.current?.sortable;
    const targetColumnId = targetSortable ? targetSortable.containerId : over.id;
    const targetColumn = board.columns.find((column) => column.id === targetColumnId);

    if (!targetColumn) return null;

    if (!targetSortable) {
      const tasksInColumn = board.tasks.filter((t) => t.columnId === targetColumnId);
      return { columnId: targetColumnId, taskIndex: tasksInColumn.length };
    }

    return {
      columnId: targetColumnId,
      taskIndex: typeof targetSortable.index === 'number' ? targetSortable.index : board.tasks.filter((t) => t.columnId === targetColumnId).length,
    };
  }

  const handleDragStart = (event: any) => {
    if (clearDraggedTaskTimeout.current !== null) {
      window.clearTimeout(clearDraggedTaskTimeout.current);
      clearDraggedTaskTimeout.current = null;
    }
    previousBoard.current = activeBoard;
    const task = activeBoard?.tasks.find((t) => t.id === event.active.id as string);
    if (task) setDraggedTask(task);
    const cardEl = document.querySelector(`[data-id="${task?.id}"]`);
    if (cardEl) {
      setOverlayWidth(`${cardEl.clientWidth}px`);
    }
  };

  const handleDragCancel = () => {
    if (clearDraggedTaskTimeout.current !== null) {
      window.clearTimeout(clearDraggedTaskTimeout.current);
      clearDraggedTaskTimeout.current = null;
    }
    updateBoard(previousBoard.current);
    setDraggedTask(null);
    setOverlayWidth(undefined);
  };

  const handleDragOver = (event: any) => {
    const { active, over } = event;
    if (active?.id === undefined || !over || !activeBoard) return;


    const sourceTask = activeBoard?.tasks?.find((t) => t.id === active.id as string);


    const target = getDragTarget(activeBoard, over);

    if (!sourceTask || !target) return;

    if (sourceTask.columnId !== target.columnId) {
      updateBoard((prev: Board) => moveTask(prev, active.id as string, target.columnId, target.taskIndex));
    }
  };

  const handleDragEnd = (event: any) => {
    clearDraggedTaskTimeout.current = window.setTimeout(() => {
      setDraggedTask(null);
      setOverlayWidth(undefined);
      clearDraggedTaskTimeout.current = null;
    }, 250);

    if (!event.over || !activeBoard) {
      updateBoard(previousBoard.current);
      return;
    }


    const sourceTask = activeBoard?.tasks?.find((t) => t.id === event.active.id as string);

    const target = getDragTarget(activeBoard, event.over);

    if (!sourceTask || !target) return;

    const sourceIndex = activeBoard.tasks.findIndex((t) => t.id === sourceTask.id);

    if (sourceTask.columnId === target.columnId && sourceIndex !== target.taskIndex) {
      updateBoard((prev: Board) => reorderTask(prev, event.active.id as string, target.columnId, target.taskIndex));
    } else if (sourceTask.columnId !== target.columnId) {
      updateBoard((prev: Board) => moveTask(prev, event.active.id as string, target.columnId, target.taskIndex));
    }
  };

  return {
    sensors,
    collisionDetection: pointerFirstCollisionDetection,
    handleDragStart,
    handleDragCancel,
    handleDragOver,
    handleDragEnd,
    draggedTask,
    setDraggedTask,
    overlayWidth,
    setOverlayWidth,
    editingTask,
    setEditingTask,
  };
}
