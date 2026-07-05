import { vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskModal from './TaskModal';
import type { Board, Task } from '../types';

const mockBoard: Board = {
  id: 'board-1',
  title: 'Test Board',
  columns: [
    { id: 'todo', title: 'To Do', color: '#6366f1', tasks: [] },
    { id: 'doing', title: 'In Progress', color: '#f59e0b', tasks: [] },
    { id: 'done', title: 'Done', color: '#10b981', tasks: [] },
  ],
};

describe('TaskModal - Create', () => {
  const mockUpdateBoard = vi.fn();
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the create modal title', () => {
    render(
      <TaskModal board={mockBoard} updateBoard={mockUpdateBoard} onClose={mockOnClose} />
    );

    expect(screen.getByText('New Task')).toBeInTheDocument();
  });

  it('renders form fields', () => {
    render(
      <TaskModal board={mockBoard} updateBoard={mockUpdateBoard} onClose={mockOnClose} />
    );

    expect(screen.getByPlaceholderText('Task title')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Optional description')).toBeInTheDocument();
  });

  it('renders a subtask input', () => {
    render(
      <TaskModal board={mockBoard} updateBoard={mockUpdateBoard} onClose={mockOnClose} />
    );

    expect(screen.getByPlaceholderText('Subtask')).toBeInTheDocument();
  });

  it('renders the add subtask button', () => {
    render(
      <TaskModal board={mockBoard} updateBoard={mockUpdateBoard} onClose={mockOnClose} />
    );

    expect(screen.getByText('Add subtask')).toBeInTheDocument();
  });

  it('disables submit button when title is empty', async () => {
    const user = userEvent.setup();
    render(
      <TaskModal board={mockBoard} updateBoard={mockUpdateBoard} onClose={mockOnClose} />
    );

    await user.click(screen.getByText('Cancel'));
    expect(screen.getByRole('button', { name: /Create Task/ })).toBeDisabled();
  });

  it('enables submit button when title is filled', async () => {
    const user = userEvent.setup();
    render(
      <TaskModal board={mockBoard} updateBoard={mockUpdateBoard} onClose={mockOnClose} />
    );

    const titleInput = screen.getByPlaceholderText('Task title');
    await user.type(titleInput, 'New task');

    expect(screen.getByRole('button', { name: /Create Task/ })).toBeEnabled();
  });

  it('calls onClose when cancel is clicked', async () => {
    const user = userEvent.setup();
    render(
      <TaskModal board={mockBoard} updateBoard={mockUpdateBoard} onClose={mockOnClose} />
    );

    await user.click(screen.getByText('Cancel'));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('calls onClose when the X button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <TaskModal board={mockBoard} updateBoard={mockUpdateBoard} onClose={mockOnClose} />
    );

    await user.click(screen.getByRole('button', { name: /close/i }));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('creates a task with title and description', async () => {
    const user = userEvent.setup();
    render(
      <TaskModal board={mockBoard} updateBoard={mockUpdateBoard} onClose={mockOnClose} />
    );

    await user.type(screen.getByPlaceholderText('Task title'), 'New task');
    await user.type(screen.getByPlaceholderText('Optional description'), 'Some description');

    await user.click(screen.getByText('Create Task'));

    expect(mockUpdateBoard).toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('does not submit when title is empty', async () => {
    const user = userEvent.setup();
    render(
      <TaskModal board={mockBoard} updateBoard={mockUpdateBoard} onClose={mockOnClose} />
    );

    await user.type(screen.getByPlaceholderText('Optional description'), 'Some description');

    expect(mockUpdateBoard).not.toHaveBeenCalled();
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('adds a subtask input when add subtask is clicked', async () => {
    const user = userEvent.setup();
    render(
      <TaskModal board={mockBoard} updateBoard={mockUpdateBoard} onClose={mockOnClose} />
    );

    const subtaskInputs = screen.getAllByPlaceholderText('Subtask');
    expect(subtaskInputs).toHaveLength(1);

    await user.click(screen.getByText('Add subtask'));

    expect(screen.getAllByPlaceholderText('Subtask')).toHaveLength(2);
  });

  it('removes a subtask input when X is clicked', async () => {
    const user = userEvent.setup();
    render(
      <TaskModal board={mockBoard} updateBoard={mockUpdateBoard} onClose={mockOnClose} />
    );

    await user.click(screen.getByText('Add subtask'));
    expect(screen.getAllByPlaceholderText('Subtask')).toHaveLength(2);

    const removeButtons = screen.getAllByRole('button', { name: '' });
    await user.click(removeButtons[removeButtons.length - 2]);

    expect(screen.getAllByPlaceholderText('Subtask')).toHaveLength(1);
  });

  it('creates task with subtasks', async () => {
    const user = userEvent.setup();
    render(
      <TaskModal board={mockBoard} updateBoard={mockUpdateBoard} onClose={mockOnClose} />
    );

    await user.type(screen.getByPlaceholderText('Task title'), 'New task');

    const subtaskInputs = screen.getAllByPlaceholderText('Subtask');
    await user.type(subtaskInputs[0], 'First subtask');

    await user.click(screen.getByText('Add subtask'));
    const newSubtaskInputs = screen.getAllByPlaceholderText('Subtask');
    await user.type(newSubtaskInputs[1], 'Second subtask');

    await user.click(screen.getByText('Create Task'));

    expect(mockUpdateBoard).toHaveBeenCalled();
    const callArg = mockUpdateBoard.mock.calls[0][0];
    const result = callArg(mockBoard);
    expect(result.columns[0].tasks[0].subtasks).toHaveLength(2);
  });

  it('sets default status to first column', () => {
    render(
      <TaskModal board={mockBoard} updateBoard={mockUpdateBoard} onClose={mockOnClose} />
    );

    const select = screen.getByRole('combobox');
    expect(select).toHaveValue('todo');
  });

  it('includes chosen status in created task', async () => {
    const user = userEvent.setup();
    render(
      <TaskModal board={mockBoard} updateBoard={mockUpdateBoard} onClose={mockOnClose} />
    );

    await user.type(screen.getByPlaceholderText('Task title'), 'New task');

    const select = screen.getByRole('combobox');
    await user.selectOptions(select, 'doing');

    await user.click(screen.getByText('Create Task'));

    expect(mockUpdateBoard).toHaveBeenCalled();
    const callArg = mockUpdateBoard.mock.calls[0][0];
    const result = callArg(mockBoard);
    expect(result.columns[1].tasks).toHaveLength(1);
  });
});

describe('TaskModal - Edit', () => {
  const mockTask: Task = {
    id: 'task-1',
    title: 'Existing task',
    description: 'Existing description',
    status: 'todo',
    subtasks: [
      { id: 'sub-1', title: 'Subtask 1', completed: true },
      { id: 'sub-2', title: 'Subtask 2', completed: false },
    ],
  };

  const mockUpdateBoard = vi.fn();
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the edit modal title', () => {
    render(
      <TaskModal
        board={mockBoard}
        updateBoard={mockUpdateBoard}
        onClose={mockOnClose}
        task={mockTask}
      />
    );

    expect(screen.getByText('Edit Task')).toBeInTheDocument();
  });

  it('pre-fills the title field', () => {
    render(
      <TaskModal
        board={mockBoard}
        updateBoard={mockUpdateBoard}
        onClose={mockOnClose}
        task={mockTask}
      />
    );

    expect(screen.getByDisplayValue('Existing task')).toBeInTheDocument();
  });

  it('pre-fills the description field', () => {
    render(
      <TaskModal
        board={mockBoard}
        updateBoard={mockUpdateBoard}
        onClose={mockOnClose}
        task={mockTask}
      />
    );

    expect(screen.getByDisplayValue('Existing description')).toBeInTheDocument();
  });

  it('pre-fills the status', () => {
    render(
      <TaskModal
        board={mockBoard}
        updateBoard={mockUpdateBoard}
        onClose={mockOnClose}
        task={mockTask}
      />
    );

    const select = screen.getByRole('combobox');
    expect(select).toHaveValue('todo');
  });

  it('renders existing subtasks as checkboxes', () => {
    render(
      <TaskModal
        board={mockBoard}
        updateBoard={mockUpdateBoard}
        onClose={mockOnClose}
        task={mockTask}
      />
    );

    expect(screen.getByText('Subtask 1')).toBeInTheDocument();
    expect(screen.getByText('Subtask 2')).toBeInTheDocument();
  });

  it('marks completed subtasks as checked', () => {
    render(
      <TaskModal
        board={mockBoard}
        updateBoard={mockUpdateBoard}
        onClose={mockOnClose}
        task={mockTask}
      />
    );

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).not.toBeChecked();
  });

  it('renders the save button', () => {
    render(
      <TaskModal
        board={mockBoard}
        updateBoard={mockUpdateBoard}
        onClose={mockOnClose}
        task={mockTask}
      />
    );

    expect(screen.getByText('Save Changes')).toBeInTheDocument();
  });

  it('updates the task when saved', async () => {
    const user = userEvent.setup();
    render(
      <TaskModal
        board={mockBoard}
        updateBoard={mockUpdateBoard}
        onClose={mockOnClose}
        task={mockTask}
      />
    );

    const titleInput = screen.getByDisplayValue('Existing task');
    await user.clear(titleInput);
    await user.type(titleInput, 'Updated task');

    await user.click(screen.getByText('Save Changes'));

    expect(mockUpdateBoard).toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('toggles subtask completion', async () => {
    const user = userEvent.setup();
    render(
      <TaskModal
        board={mockBoard}
        updateBoard={mockUpdateBoard}
        onClose={mockOnClose}
        task={mockTask}
      />
    );

    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[1]);

    expect(mockUpdateBoard).toHaveBeenCalled();
  });

  it('moves task to new column on status change', async () => {
    const user = userEvent.setup();
    const boardWithTask: Board = {
      ...mockBoard,
      columns: [
        { ...mockBoard.columns[0], tasks: [mockTask] },
        { ...mockBoard.columns[1], tasks: [] },
        { ...mockBoard.columns[2], tasks: [] },
      ],
    };

    render(
      <TaskModal
        board={boardWithTask}
        updateBoard={mockUpdateBoard}
        onClose={mockOnClose}
        task={mockTask}
      />
    );

    const select = screen.getByRole('combobox');
    await user.selectOptions(select, 'doing');

    await user.click(screen.getByText('Save Changes'));

    expect(mockUpdateBoard).toHaveBeenCalled();
    const callArg = mockUpdateBoard.mock.calls[0][0];
    const result = callArg(boardWithTask);
    expect(result.columns[0].tasks).toHaveLength(0);
    expect(result.columns[1].tasks).toHaveLength(1);
  });
});
