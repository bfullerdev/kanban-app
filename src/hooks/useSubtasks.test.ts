import { renderHook } from '@testing-library/react';
import { useSubtasks } from './useSubtasks';
import type { Subtask } from '../types';

const mockUpdateBoard = vi.fn();

const createSubtask = (id: string, title: string, completed = false): Subtask => ({
  id,
  title,
  completed,
});

describe('useSubtasks - Create mode initial state', () => {
  const { result } = renderHook(() =>
    useSubtasks([], { isEdit: false }),
  );

  it('initializes with one empty subtask input', () => {
    expect(result.current.inputs).toHaveLength(1);
    expect(result.current.inputs[0].title).toBe('');
  });

  it('initializes with empty subtasks array', () => {
    expect(result.current.subtasks).toHaveLength(0);
  });

  it('returns all inputs as new since no subtasks exist in create mode', () => {
    expect(result.current.newSubtaskInputs).toHaveLength(1);
  });
});

describe('useSubtasks - Edit mode initial state', () => {
  const initialSubtasks = [
    createSubtask('sub-1', 'Subtask 1', true),
    createSubtask('sub-2', 'Subtask 2', false),
  ];

  const { result } = renderHook(() =>
    useSubtasks(initialSubtasks, {
      isEdit: true,
      updateBoard: mockUpdateBoard,
      task: { id: 'task-1' },
    }),
  );

  it('initializes inputs from existing subtasks', () => {
    expect(result.current.inputs).toHaveLength(2);
    expect(result.current.inputs[0].title).toBe('Subtask 1');
    expect(result.current.inputs[1].title).toBe('Subtask 2');
  });

  it('initializes subtasks from existing subtasks', () => {
    expect(result.current.subtasks).toHaveLength(2);
    expect(result.current.subtasks[0].completed).toBe(true);
    expect(result.current.subtasks[1].completed).toBe(false);
  });

  it('returns empty newSubtaskInputs when all inputs match subtasks', () => {
    expect(result.current.newSubtaskInputs).toHaveLength(0);
  });
});

describe('useSubtasks - Edit mode with empty existing subtasks', () => {
  const { result } = renderHook(() =>
    useSubtasks([], {
      isEdit: true,
      updateBoard: mockUpdateBoard,
      task: { id: 'task-1' },
    }),
  );

  it('initializes with one empty input when no existing subtasks', () => {
    expect(result.current.inputs).toHaveLength(1);
    expect(result.current.subtasks).toHaveLength(0);
  });
});

describe('useSubtasks - toggleSubtask create mode', () => {
  const { result } = renderHook(() =>
    useSubtasks([], { isEdit: false }),
  );

  it('does not call updateBoard in create mode', () => {
    expect(() => result.current.toggleSubtask('any-id')).not.toThrow();
    expect(mockUpdateBoard).not.toHaveBeenCalled();
  });
});

describe('useSubtasks - toggleSubtask without updateBoard', () => {
  const initialSubtasks = [
    createSubtask('sub-1', 'Subtask 1', false),
  ];

  const { result } = renderHook(() =>
    useSubtasks(initialSubtasks, {
      isEdit: true,
      updateBoard: undefined,
      task: { id: 'task-1' },
    }),
  );

  it('initializes with correct completion state', () => {
    expect(result.current.subtasks[0].completed).toBe(false);
  });
});

describe('useSubtasks - toggleSubtask without task', () => {
  const initialSubtasks = [
    createSubtask('sub-1', 'Subtask 1', false),
  ];

  const { result } = renderHook(() =>
    useSubtasks(initialSubtasks, {
      isEdit: true,
      updateBoard: mockUpdateBoard,
      task: undefined,
    }),
  );

  it('initializes with correct completion state', () => {
    expect(result.current.subtasks[0].completed).toBe(false);
  });
});
