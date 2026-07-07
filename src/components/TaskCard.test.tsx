import { vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import './__mocks__/dnd';
import TaskCard from './TaskCard';
import type { Task } from '../types';

beforeEach(() => {
  vi.resetModules();
});

const mockTask: Task = {
  id: 'task-1',
  title: 'Design landing page',
  description: 'Create high-fidelity mockups',
  status: 'todo',
  subtasks: [
    { id: 'sub-1', title: 'Wireframe', completed: true },
    { id: 'sub-2', title: 'Hero', completed: false },
  ],
};

describe('TaskCard', () => {
  it('renders the task title', () => {
    render(<TaskCard task={mockTask} onEdit={() => {}} index={0} />);

    expect(screen.getByText('Design landing page')).toBeInTheDocument();
  });

  it('renders the description', () => {
    render(<TaskCard task={mockTask} onEdit={() => {}} index={0} />);

    expect(screen.getByText('Create high-fidelity mockups')).toBeInTheDocument();
  });

  it('shows subtask progress', () => {
    render(<TaskCard task={mockTask} onEdit={() => {}} index={0} />);

    expect(screen.getByText('1 of 2 subtasks')).toBeInTheDocument();
  });

  it('hides subtask progress when no subtasks', () => {
    const taskNoSubtasks: Task = {
      ...mockTask,
      subtasks: [],
    };

    render(<TaskCard task={taskNoSubtasks} onEdit={() => {}} index={0} />);

    expect(screen.queryByText(/subtasks/)).not.toBeInTheDocument();
  });

  it('calls onEdit when the card is clicked', async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    render(<TaskCard task={mockTask} onEdit={onEdit} index={0} />);

    await user.click(screen.getByRole('button'));
    expect(onEdit).toHaveBeenCalledWith(mockTask);
  });

  it('hides description when empty', () => {
    const taskNoDesc: Task = {
      ...mockTask,
      description: '',
    };

    render(<TaskCard task={taskNoDesc} onEdit={() => {}} index={0} />);

    expect(screen.queryByText('Create high-fidelity mockups')).not.toBeInTheDocument();
  });
});

