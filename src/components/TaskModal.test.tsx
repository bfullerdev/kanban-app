import { render } from '@testing-library/react';
import TaskModal from './TaskModal';
import type { Board, Task } from '../types';
import { describe, it, expect } from 'vitest';

const mockBoard: Board = {
  id: 'board-1',
  title: 'Board 1',
  columns: [{ id: 'todo', title: 'To Do', color: '#000' }],
  tasks: [],
};

const mockTask: Task = {
  id: 'task-1',
  title: 'Task 1',
  description: 'Desc 1',
  columnId: 'todo',
  subtasks: [],
};

describe('TaskModal', () => {
  it('renders correctly', () => {
    const { getByText } = render(
      <TaskModal
        board={mockBoard}
        updateBoard={vi.fn()}
        onClose={vi.fn()}
        task={mockTask}
      />
    );
    expect(getByText('Edit Task')).toBeInTheDocument();
  });
});
