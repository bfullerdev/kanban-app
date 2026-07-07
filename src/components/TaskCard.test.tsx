import { render } from '@testing-library/react';
import TaskCard from './TaskCard';
import type { Task } from '../types';

describe('TaskCard', () => {
  const mockTask: Task = {
    id: 'task-1',
    title: 'Task 1',
    description: 'Desc 1',
    columnId: 'todo',
    subtasks: [],
  };

  it('renders correctly', () => {
    const { getByText } = render(
      <TaskCard task={mockTask} onEdit={() => {}} index={0} />
    );
    expect(getByText('Task 1')).toBeInTheDocument();
  });
});
