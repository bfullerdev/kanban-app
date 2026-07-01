import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import './components/__mocks__/dnd.tsx';
import App from './App';

beforeEach(() => {
  localStorage.clear();
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
});
