import { vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import './__mocks__/dnd';
import Column from './Column';
import type { Column as ColumnType } from '../../types';

beforeEach(() => {
  vi.resetModules();
});

const mockColumn: ColumnType = {
  id: 'todo',
  title: 'To Do',
  color: '#6366f1',
  tasks: [
    {
      id: 'task-1',
      title: 'Design landing page',
      description: 'Create mockups',
      status: 'todo',
      subtasks: [
        { id: 'sub-1', title: 'Wireframe', completed: true },
        { id: 'sub-2', title: 'Hero', completed: false },
      ],
    },
    {
      id: 'task-2',
      title: 'Build API',
      description: '',
      status: 'todo',
      subtasks: [],
    },
  ],
};

describe('Column', () => {
  it('renders the column title and task count', () => {
    render(<Column column={mockColumn} onEditTask={() => {}} />);

    expect(screen.getByText('To Do (2)')).toBeInTheDocument();
  });

  it('renders all tasks in the column', () => {
    render(<Column column={mockColumn} onEditTask={() => {}} />);

    expect(screen.getByText('Design landing page')).toBeInTheDocument();
    expect(screen.getByText('Build API')).toBeInTheDocument();
  });

  it('shows subtask progress for tasks with subtasks', () => {
    render(<Column column={mockColumn} onEditTask={() => {}} />);

    expect(screen.getByText('1 of 2 subtasks')).toBeInTheDocument();
  });

  it('does not show subtask progress for tasks without subtasks', () => {
    render(<Column column={mockColumn} onEditTask={() => {}} />);

    expect(screen.queryByText('0 of 0 subtasks')).not.toBeInTheDocument();
  });

  it('calls onEditTask when a task card is clicked', async () => {
    const user = userEvent.setup();
    const onEditTask = vi.fn();
    render(<Column column={mockColumn} onEditTask={onEditTask} />);

    await user.click(screen.getByText('Design landing page'));
    expect(onEditTask).toHaveBeenCalledWith(mockColumn.tasks[0]);
  });

  it('renders the color indicator', () => {
    render(<Column column={mockColumn} onEditTask={() => {}} />);

    const indicator = document.querySelector('[style*="background-color: rgb(99, 102, 241)"]');
    expect(indicator).toBeInTheDocument();
  });

  it('renders an empty column', () => {
    const emptyColumn: ColumnType = {
      id: 'doing',
      title: 'In Progress',
      color: '#f59e0b',
      tasks: [],
    };

    render(<Column column={emptyColumn} onEditTask={() => {}} />);

    expect(screen.getByText('In Progress (0)')).toBeInTheDocument();
  });
});
