import { render } from '@testing-library/react';
import Column from './Column';
import type { Task } from '../types';
import { describe, it, expect } from 'vitest';

describe('Column', () => {
  const mockColumn = {
    id: 'test-col',
    title: 'Test Column',
    color: '#ffffff',
  };

  const mockTasks: Task[] = [
    {
      id: 'task-1',
      title: 'Task 1',
      description: 'Desc 1',
      columnId: 'test-col',
      subtasks: [],
    },
  ];

  const mockOnEditTask = vi.fn();

  it('renders correctly', () => {
    const { getByText } = render(
      <Column column={mockColumn} tasks={mockTasks} onEditTask={mockOnEditTask} />
    );
    expect(getByText('Test Column (1)')).toBeInTheDocument();
  });

  it('renders tasks correctly', () => {
    const { getByText } = render(
      <Column column={mockColumn} tasks={mockTasks} onEditTask={mockOnEditTask} />
    );
    expect(getByText('Task 1')).toBeInTheDocument();
  });
});
