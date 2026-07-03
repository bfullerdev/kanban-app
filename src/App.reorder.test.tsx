import { act, render, within } from '@testing-library/react';
import './components/__mocks__/dnd';
import { mockCallbacks } from './components/__mocks__/dnd';
import App from './App';

beforeEach(() => {
  localStorage.clear();
  mockCallbacks.onDragEnd = null;
  mockCallbacks.onDragOver = null;
});

describe('App - task reordering', () => {
  it('reorders tasks within the same column via drag and drop', async () => {
    render(<App />);

    const todoColumn = document.querySelector('[data-id="todo"]') as HTMLElement;
    const tasks = within(todoColumn).getAllByRole('button');
    expect(tasks.length).toBeGreaterThan(0);

    await act(async () => {
      mockCallbacks.onDragEnd?.({
        operation: {
          source: { id: 'task-1', group: 'todo', index: 0 },
          target: { id: 'todo', group: 'todo', index: 2 },
        },
      });
    });

    const stored = JSON.parse(localStorage.getItem('kanban-boards')!);
    const board = stored.find((b: { id: string }) => b.id === 'platform-launch');
    const todoCol = board.columns.find((c: { id: string }) => c.id === 'todo');

    expect(todoCol.tasks.length).toBe(tasks.length);
  });

  it('reorders task to the beginning of the column', async () => {
    render(<App />);

    await act(async () => {
      mockCallbacks.onDragEnd?.({
        operation: {
          source: { id: 'task-1', group: 'todo', index: 0 },
          target: { id: 'todo', group: 'todo', index: 0 },
        },
      });
    });

    const stored = JSON.parse(localStorage.getItem('kanban-boards')!);
    const board = stored.find((b: { id: string }) => b.id === 'platform-launch');
    const todoCol = board.columns.find((c: { id: string }) => c.id === 'todo');

    expect(todoCol.tasks.length).toBe(1);
  });

  it('reorders task to the end of the column', async () => {
    render(<App />);

    const todoColumn = document.querySelector('[data-id="todo"]') as HTMLElement;
    const tasks = within(todoColumn).getAllByRole('button');
    const taskCount = tasks.length;

    await act(async () => {
      mockCallbacks.onDragEnd?.({
        operation: {
          source: { id: 'task-1', group: 'todo', index: 0 },
          target: { id: 'todo', group: 'todo', index: taskCount },
        },
      });
    });

    const stored = JSON.parse(localStorage.getItem('kanban-boards')!);
    const board = stored.find((b: { id: string }) => b.id === 'platform-launch');
    const todoCol = board.columns.find((c: { id: string }) => c.id === 'todo');

    expect(todoCol.tasks.length).toBe(taskCount);
  });

  it('moves task to a different column when dragged across columns', async () => {
    render(<App />);

    const todoColumn = document.querySelector('[data-id="todo"]') as HTMLElement;
    expect(within(todoColumn).getByText('Design landing page')).toBeInTheDocument();

    const doingColumn = document.querySelector('[data-id="doing"]') as HTMLElement;
    expect(within(doingColumn).queryByText('Design landing page')).not.toBeInTheDocument();

    await act(async () => {
      mockCallbacks.onDragOver?.({
        operation: {
          source: { id: 'task-1', group: 'todo', index: 0 },
          target: { id: 'doing', group: 'doing', index: undefined },
        },
      });
    });

    const updatedDoingColumn = document.querySelector('[data-id="doing"]') as HTMLElement;
    const updatedTodoColumn = document.querySelector('[data-id="todo"]') as HTMLElement;

    expect(within(updatedDoingColumn).getByText('Design landing page')).toBeInTheDocument();
    expect(within(updatedTodoColumn).queryByText('Design landing page')).not.toBeInTheDocument();
  });

  it('does not reorder when dropping at the same position', async () => {
    render(<App />);

    const storedBefore = JSON.parse(localStorage.getItem('kanban-boards')!);
    const boardBefore = storedBefore.find((b: { id: string }) => b.id === 'platform-launch');
    const todoColBefore = boardBefore.columns.find((c: { id: string }) => c.id === 'todo');
    const firstTaskBefore = todoColBefore.tasks[0]?.id;

    await act(async () => {
      mockCallbacks.onDragEnd?.({
        operation: {
          source: { id: 'task-1', group: 'todo', index: 0 },
          target: { id: 'todo', group: 'todo', index: 0 },
        },
      });
    });

    const storedAfter = JSON.parse(localStorage.getItem('kanban-boards')!);
    const boardAfter = storedAfter.find((b: { id: string }) => b.id === 'platform-launch');
    const todoColAfter = boardAfter.columns.find((c: { id: string }) => c.id === 'todo');

    expect(todoColAfter.tasks[0]?.id).toBe(firstTaskBefore);
  });
});
