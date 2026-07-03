import { useState, useCallback } from 'react';
import type { Board, Subtask } from '../types';

interface SubtaskInput {
  id: string;
  title: string;
}

interface UseSubtasksOptions {
  isEdit: boolean;
  updateBoard?: (fn: Board | ((prev: Board) => Board)) => void;
  task?: { id: string };
}

export function useSubtasks(initialSubtasks: Subtask[], options: UseSubtasksOptions) {
  const { isEdit, updateBoard, task } = options;

  const [inputs, setInputs] = useState<SubtaskInput[]>(() => {
    if (isEdit && initialSubtasks.length > 0) {
      return initialSubtasks.map((s) => ({ id: s.id, title: s.title }));
    }
    return [{ id: crypto.randomUUID(), title: '' }];
  });

  const [subtasks, setSubtasks] = useState<Subtask[]>(isEdit ? initialSubtasks : []);

  const addSubtaskInput = useCallback(() => {
    setInputs((prev) => [...prev, { id: crypto.randomUUID(), title: '' }]);
  }, []);

  const removeSubtaskInput = useCallback((id: string) => {
    setInputs((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const updateSubtaskInput = useCallback((id: string, value: string) => {
    setInputs((prev) => prev.map((s) => (s.id === id ? { ...s, title: value } : s)));
  }, []);

  const toggleSubtask = useCallback(
    (subtaskId: string) => {
      setSubtasks((prev) =>
        prev.map((s) => (s.id === subtaskId ? { ...s, completed: !s.completed } : s))
      );

      if (isEdit && task && updateBoard) {
        updateBoard((prev: Board) => ({
          ...prev,
          columns: prev.columns.map((col) => {
            const colTask = col.tasks.find((t) => t.id === task.id);
            if (!colTask) return col;
            return {
              ...col,
              tasks: col.tasks.map((t) =>
                t.id === task.id
                  ? {
                      ...t,
                      subtasks: t.subtasks.map((s) =>
                        s.id === subtaskId ? { ...s, completed: !s.completed } : s
                      ),
                    }
                  : t
              ),
            };
          }),
        }));
      }
    },
    [isEdit, task, updateBoard],
  );

  const getSubtasksForSubmit = useCallback((): Subtask[] => {
    if (isEdit) {
      return inputs
        .filter((s) => s.title.trim())
        .map((input) => {
          const existing = subtasks.find((s) => s.id === input.id);
          return existing ?? { id: crypto.randomUUID(), title: input.title.trim(), completed: false };
        });
    }
    return inputs
      .filter((s) => s.title.trim())
      .map((s) => ({ id: crypto.randomUUID(), title: s.title.trim(), completed: false }));
  }, [inputs, subtasks, isEdit]);

  const newSubtaskInputs = inputs.filter((input) => !subtasks.find((s) => s.id === input.id));

  return {
    inputs,
    subtasks,
    addSubtaskInput,
    removeSubtaskInput,
    updateSubtaskInput,
    toggleSubtask,
    getSubtasksForSubmit,
    newSubtaskInputs,
  };
}

export type { SubtaskInput };
