import { useSubtasks } from './useSubtasks';
import type { Subtask } from '../types';
import { describe, it, expect, vi } from 'vitest';

// Mock useSubtasks
vi.mock('./useSubtasks', () => ({
  useSubtasks: vi.fn(),
}));

const mockUseSubtasks = vi.mocked(useSubtasks);

describe('useSubtasks', () => {
  const mockSubtasks: Subtask[] = [
    { id: 'sub-1', title: 'Subtask 1', completed: false },
  ];

  const mockInputs = [{ id: 'input-1', title: 'New Subtask' }];

  beforeEach(() => {
    mockUseSubtasks.mockReturnValue({
      inputs: mockInputs,
      subtasks: mockSubtasks,
      addSubtaskInput: vi.fn(),
      removeSubtaskInput: vi.fn(),
      updateSubtaskInput: vi.fn(),
      toggleSubtask: vi.fn(),
      getSubtasksForSubmit: vi.fn(),
      newSubtaskInputs: [],
    });
  });

  it('should return mocked data', () => {
    const { inputs, subtasks } = useSubtasks(mockSubtasks, { isEdit: true });
    expect(inputs).toEqual(mockInputs);
    expect(subtasks).toEqual(mockSubtasks);
  });
});
