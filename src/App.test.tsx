import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import './components/__mocks__/dnd';
import { mockCallbacks } from './components/__mocks__/dnd';
import App from './App';

beforeEach(() => {
  localStorage.clear();
  mockCallbacks.onDragEnd = null;
  mockCallbacks.onDragOver = null;
});

describe('App', () => {
  it('renders the sidebar with board list', () => {
    render(<App />);

    const sidebar = screen.getByRole('complementary');
    expect(within(sidebar).getByText('Platform Launch')).toBeInTheDocument();
    expect(within(sidebar).getByText('Marketing Plan')).toBeInTheDocument();
    expect(within(sidebar).getByText('Roadmap')).toBeInTheDocument();
  });

  it('shows the active board title', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: 'Platform Launch' })).toBeInTheDocument();
  });

  it('switches boards when clicked', async () => {
    const user = userEvent.setup();
    render(<App />);

    const sidebar = screen.getByRole('complementary');
    await user.click(within(sidebar).getByText('Marketing Plan'));

    expect(screen.getByRole('heading', { name: 'Marketing Plan' })).toBeInTheDocument();
  });

  it('renders the Add New Task button', () => {
    render(<App />);

    expect(screen.getByText('Add New Task')).toBeInTheDocument();
  });

  it('opens the task modal when Add New Task is clicked', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByText('Add New Task'));

    expect(screen.getByText('New Task')).toBeInTheDocument();
  });

  it('closes the modal when Cancel is clicked', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByText('Add New Task'));
    expect(screen.getByText('New Task')).toBeInTheDocument();

    await user.click(screen.getByText('Cancel'));
    expect(screen.queryByText('New Task')).not.toBeInTheDocument();
  });

  it('renders tasks in the board columns', () => {
    render(<App />);

    expect(screen.getByText('Design landing page')).toBeInTheDocument();
  });

  it('persists the active board selection', async () => {
    const user = userEvent.setup();
    render(<App />);

    const sidebar = screen.getByRole('complementary');
    await user.click(within(sidebar).getByText('Roadmap'));

    expect(localStorage.getItem('kanban-active-board')).toBe('roadmap');
  });

  it('creates a new task and adds it to the board', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByText('Add New Task'));
    expect(screen.getByText('New Task')).toBeInTheDocument();

    await user.type(screen.getByPlaceholderText('Task title'), 'New created task');
    await user.click(screen.getByText('Create Task'));

    expect(screen.queryByText('New Task')).not.toBeInTheDocument();
    expect(screen.getByText('New created task')).toBeInTheDocument();
  });

  it('edits an existing task', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByText('Design landing page'));
    expect(screen.getByText('Edit Task')).toBeInTheDocument();

    const titleInput = screen.getByDisplayValue('Design landing page');
    await user.clear(titleInput);
    await user.type(titleInput, 'Updated task name');

    await user.click(screen.getByText('Save Changes'));

    expect(screen.queryByText('Edit Task')).not.toBeInTheDocument();
    expect(screen.getByText('Updated task name')).toBeInTheDocument();
  });

  it('drags a task to another column, edits name/description, and persists changes', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Verify task starts in "To Do" column
    const todoColumn = document.querySelector('[data-id="todo"]') as HTMLElement;
    expect(within(todoColumn).getByText('Design landing page')).toBeInTheDocument();

    const doingColumn = document.querySelector('[data-id="doing"]') as HTMLElement;
    expect(within(doingColumn).queryByText('Design landing page')).not.toBeInTheDocument();

    // Simulate dragging "Design landing page" from "todo" to "doing"
    await act(async () => {
      mockCallbacks.onDragOver?.({
        operation: {
          source: { id: 'task-1', group: 'todo', index: 0 },
          target: { id: 'doing', group: 'doing', index: undefined },
        },
      });
    });

    // Re-query after state update
    const updatedDoingColumn = document.querySelector('[data-id="doing"]') as HTMLElement;
    const updatedTodoColumn = document.querySelector('[data-id="todo"]') as HTMLElement;

    // Verify task moved to "In Progress" column
    expect(within(updatedDoingColumn).getByText('Design landing page')).toBeInTheDocument();
    expect(within(updatedTodoColumn).queryByText('Design landing page')).not.toBeInTheDocument();

    // Now edit the task: change name and description
    await user.click(screen.getByText('Design landing page'));
    expect(screen.getByText('Edit Task')).toBeInTheDocument();

    const titleInput = screen.getByDisplayValue('Design landing page');
    await user.clear(titleInput);
    await user.type(titleInput, 'Redesigned landing page');

    const descInput = screen.getByDisplayValue('Create high-fidelity mockups for the main landing page.');
    await user.clear(descInput);
    await user.type(descInput, 'Final polished version with new branding.');

    await user.click(screen.getByText('Save Changes'));

    // Verify modal is closed
    expect(screen.queryByText('Edit Task')).not.toBeInTheDocument();

    // Verify task is still in "In Progress" with updated name
    expect(within(updatedDoingColumn).getByText('Redesigned landing page')).toBeInTheDocument();

    // Verify changes are persisted to localStorage with correct column and status
    const stored = JSON.parse(localStorage.getItem('kanban-boards')!);
    const board = stored.find((b: { id: string }) => b.id === 'platform-launch');
    const doingCol = board.columns.find((c: { id: string }) => c.id === 'doing');
    const todoCol = board.columns.find((c: { id: string }) => c.id === 'todo');

    expect(doingCol.tasks[0].title).toBe('Redesigned landing page');
    expect(doingCol.tasks[0].description).toBe('Final polished version with new branding.');
    expect(doingCol.tasks[0].status).toBe('doing');
    expect(todoCol.tasks.length).toBe(0);
  });
});
