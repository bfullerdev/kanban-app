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
    if (!todoColumn) throw new Error('Todo column not found');
    const tasks = within(todoColumn).getAllByRole('button');
    expect(tasks.length).toBeGreaterThan(0);

    await act(async () => {
      mockCallbacks.triggerDragEnd?.({
        active: { id: 'task-1', data: { current: { sortable: { containerId: 'todo', index: 0 } } } },
        over: { id: 'todo', data: { current: { sortable: { containerId: 'todo', index: 2 } } } },
      });
    });

    const stored = JSON.parse(localStorage.getItem('kanban-boards')!);
    const board = stored.find((b: any) => b.id === 'platform-launch');
    if (!board) throw new Error('Board not found');
    const todoCol = board.columns.find((c: any) => c.id === 'todo');
    if (!todoCol) throw new Error('Todo column not found');

    expect(board.tasks.filter((t: any) => t.columnId === todoCol.id).length).toBe(tasks.length);
  });

  it('reorders task to the beginning of the column', async () => {
    render(<App />);

    await act(async () => {
      mockCallbacks.triggerDragEnd?.({
        active: { id: 'task-1', data: { current: { sortable: { containerId: 'todo', index: 0 } } } },
        over: { id: 'todo', data: { current: { sortable: { containerId: 'todo', index: 0 } } } },
      });
    });

    const stored = JSON.parse(localStorage.getItem('kanban-boards')!);
    const board = stored.find((b: any) => b.id === 'platform-launch');
    if (!board) throw new Error('Board not found');
    const todoCol = board.columns.find((c: any) => c.id === 'todo');
    if (!todoCol) throw new Error('Todo column not found');

    expect(board.tasks.filter((t: any) => t.columnId === todoCol.id).length).toBe(1);
  });

  it('reorders task to the end of the column', async () => {
    render(<App />);

    const todoColumn = document.querySelector('[data-id="todo"]') as HTMLElement;
    if (!todoColumn) throw new Error('Todo column not found');
    const tasks = within(todoColumn).getAllByRole('button');
    const taskCount = tasks.length;

    await act(async () => {
      mockCallbacks.triggerDragEnd?.({
        active: { id: 'task-1', data: { current: { sortable: { containerId: 'todo', index: 0 } } } },
        over: { id: 'todo', data: { current: { sortable: { containerId: 'todo', index: taskCount } } } },
      });
    });

    const stored = JSON.parse(localStorage.getItem('kanban-boards')!);
    const board = stored.find((b: any) => b.id === 'platform-launch');
    if (!board) throw new Error('Board not found');
    const todoCol = board.columns.find((c: any) => c.id === 'todo');
    if (!todoCol) throw new Error('Todo column not found');

    expect(board.tasks.filter((t: any) => t.columnId === todoCol.id).length).toBe(taskCount);
  });

  it('uses dnd-kit sortable indexes when reordering in the same column', async () => {
    localStorage.setItem('kanban-active-board', 'same-column-reorder');
    localStorage.setItem('kanban-boards', JSON.stringify([
      {
        id: 'same-column-reorder',
        title: 'Same Column Reorder',
        columns: [
          {
            id: 'todo',
            title: 'To Do',
            color: '#6366f1',
          },
          { id: 'doing', title: 'In Progress', color: '#f59e0b' },
          { id: 'done', title: 'Done', color: '#10b981' },
        ],
        tasks: [
          { id: 'task-1', title: 'First task', description: '', status: 'todo', subtasks: [], columnId: 'todo' },
          { id: 'task-2', title: 'Second task', description: '', status: 'todo', subtasks: [], columnId: 'todo' },
          { id: 'task-3', title: 'Third task', description: '', status: 'todo', subtasks: [], columnId: 'todo' },
        ],
      },
    ]));

    render(<App />);

    await act(async () => {
      mockCallbacks.triggerDragEnd?.({
        active: {
          id: 'task-1',
          data: { current: { sortable: { containerId: 'todo', index: 0 } } },
          rect: { current: { translated: { top: 125 } } },
        },
        over: {
          id: 'task-3',
          data: { current: { sortable: { containerId: 'todo', index: 2 } } },
          rect: { top: 100, height: 40 },
        },
      });
    });

    const stored = JSON.parse(localStorage.getItem('kanban-boards')!);
    const board = stored.find((b: any) => b.id === 'same-column-reorder');
    if (!board) throw new Error('Board not found');
    const todoCol = board.columns.find((c: any) => c.id === 'todo');
    if (!todoCol) throw new Error('Todo column not found');

    expect(board.tasks.filter((t: any) => t.columnId === todoCol.id).map((task: any) => task.id)).toEqual(['task-2', 'task-3', 'task-1']);
  });

  it('moves task to a different column when dragged across columns', async () => {
    render(<App />);

    const todoColumn = document.querySelector('[data-id="todo"]') as HTMLElement;
    if (!todoColumn) throw new Error('Todo column not found');
    expect(within(todoColumn).getByText('Design landing page')).toBeInTheDocument();

    const doingColumn = document.querySelector('[data-id="doing"]') as HTMLElement;
    if (!doingColumn) throw new Error('Doing column not found');
    expect(within(doingColumn).queryByText('Design landing page')).not.toBeInTheDocument();

    await act(async () => {
      mockCallbacks.triggerDragEnd?.({
        active: { id: 'task-1', data: { current: { sortable: { containerId: 'todo', index: 0 } } } },
        over: { id: 'doing', data: { current: { sortable: { containerId: 'doing', index: undefined } } } },
      });
    });

    const updatedDoingColumn = document.querySelector('[data-id="doing"]') as HTMLElement;
    const updatedTodoColumn = document.querySelector('[data-id="todo"]') as HTMLElement;
    if (!updatedDoingColumn || !updatedTodoColumn) throw new Error('Columns not found');

    expect(within(updatedDoingColumn).getByText('Design landing page')).toBeInTheDocument();
    expect(within(updatedTodoColumn).queryByText('Design landing page')).not.toBeInTheDocument();
  });

  it('previews a cross-column move while dragging over a destination task', async () => {
    localStorage.setItem('kanban-active-board', 'board-with-destination-tasks');
    localStorage.setItem('kanban-boards', JSON.stringify([
      {
        id: 'board-with-destination-tasks',
        title: 'Board with Destination Tasks',
        columns: [
          {
            id: 'todo',
            title: 'To Do',
            color: '#6366f1',
            tasks: [
              {
                id: 'task-1',
                title: 'Dragged task',
                description: '',
                status: 'todo',
                subtasks: [],
                columnId: 'todo',
              },
            ],
          },
          {
            id: 'doing',
            title: 'In Progress',
            color: '#f59e0b',
            tasks: [
              {
                id: 'task-2',
                title: 'Existing destination task',
                description: '',
                status: 'doing',
                subtasks: [],
                columnId: 'doing',
              },
            ],
          },
          { id: 'done', title: 'Done', color: '#10b981', tasks: [] },
        ],
        tasks: [
          { id: 'task-1', title: 'Dragged task', description: '', status: 'todo', subtasks: [], columnId: 'todo' },
          { id: 'task-2', title: 'Existing destination task', description: '', status: 'doing', subtasks: [], columnId: 'doing' },
        ]
      },
    ]));

    render(<App />);

    await act(async () => {
      mockCallbacks.triggerDragOver?.({
        active: { id: 'task-1', data: { current: { sortable: { containerId: 'todo', index: 0 } } } },
        over: {
          id: 'task-2',
          data: { current: { sortable: { containerId: 'doing', index: 0 } } },
        },
      });
    });

    const doingColumn = document.querySelector('[data-id="doing"]') as HTMLElement;
    if (!doingColumn) throw new Error('Doing column not found');
    const draggedTask = within(doingColumn).getByText('Dragged task');
    const existingTask = within(doingColumn).getByText('Existing destination task');

    expect(draggedTask.compareDocumentPosition(existingTask) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();

    const stored = JSON.parse(localStorage.getItem('kanban-boards')!);
    const board = stored.find((b: any) => b.id === 'board-with-destination-tasks');
    if (!board) throw new Error('Board not found');
    const doingCol = board.columns.find((c: any) => c.id === 'doing');
    const todoCol = board.columns.find((c: any) => c.id === 'todo');
    if (!doingCol || !todoCol) throw new Error('Columns not found');

    expect(board.tasks.filter((t: any) => t.columnId === todoCol.id)).toHaveLength(0);
    expect(board.tasks.filter((t: any) => t.columnId === doingCol.id).map((task: any) => task.id)).toEqual(['task-1', 'task-2']);
  });

  it('keeps the previewed cross-column order when the card is dropped', async () => {
    localStorage.setItem('kanban-active-board', 'drop-preview-order');
    localStorage.setItem('kanban-boards', JSON.stringify([
      {
        id: 'drop-preview-order',
        title: 'Drop Preview Order',
        columns: [
          {
            id: 'todo',
            title: 'To Do',
            color: '#6366f1',
            tasks: [
              { id: 'task-1', title: 'Dragged task', description: '', status: 'todo', subtasks: [], columnId: 'todo' },
            ],
          },
          {
            id: 'doing',
            title: 'In Progress',
            color: '#f59e0b',
            tasks: [
              { id: 'task-2', title: 'Existing destination task', description: '', status: 'doing', subtasks: [], columnId: 'doing' },
            ],
          },
          { id: 'done', title: 'Done', color: '#10b981', tasks: [] },
        ],
        tasks: [
          { id: 'task-1', title: 'Dragged task', description: '', status: 'todo', subtasks: [], columnId: 'todo' },
          { id: 'task-2', title: 'Existing destination task', description: '', status: 'doing', subtasks: [], columnId: 'doing' },
        ]
      },
    ]));

    render(<App />);

    const dragEvent = {
      active: { id: 'task-1', data: { current: { sortable: { containerId: 'todo', index: 0 } } } },
      over: {
        id: 'task-2',
        data: { current: { sortable: { containerId: 'doing', index: 0 } } },
      },
    };

    await act(async () => {
      mockCallbacks.triggerDragOver?.(dragEvent);
    });

    await act(async () => {
      mockCallbacks.triggerDragEnd?.(dragEvent);
    });

    const stored = JSON.parse(localStorage.getItem('kanban-boards')!);
    const board = stored.find((b: any) => b.id === 'drop-preview-order');
    if (!board) throw new Error('Board not found');
    const doingCol = board.columns.find((c: any) => c.id === 'doing');
    const todoCol = board.columns.find((c: any) => c.id === 'todo');
    if (!doingCol || !todoCol) throw new Error('Columns not found');

    expect(board.tasks.filter((t: any) => t.columnId === todoCol.id)).toHaveLength(0);
    expect(board.tasks.filter((t: any) => t.columnId === doingCol.id).map((task: any) => task.id)).toEqual(['task-1', 'task-2']);
  });

  it('ignores repeated drag-over events that do not change the preview order', async () => {
    localStorage.setItem('kanban-active-board', 'stable-preview-order');
    localStorage.setItem('kanban-boards', JSON.stringify([
      {
        id: 'stable-preview-order',
        title: 'Stable Preview Order',
        columns: [
          {
            id: 'todo',
            title: 'To Do',
            color: '#6366f1',
            tasks: [
              { id: 'task-1', title: 'Dragged task', description: '', status: 'todo', subtasks: [], columnId: 'todo' },
            ],
          },
          {
            id: 'doing',
            title: 'In Progress',
            color: '#f59e0b',
            tasks: [
              { id: 'task-2', title: 'Existing destination task', description: '', status: 'doing', subtasks: [], columnId: 'doing' },
            ],
          },
          { id: 'done', title: 'Done', color: '#10b981', tasks: [] },
        ],
        tasks: [
          { id: 'task-1', title: 'Dragged task', description: '', status: 'todo', subtasks: [], columnId: 'todo' },
          { id: 'task-2', title: 'Existing destination task', description: '', status: 'doing', subtasks: [], columnId: 'doing' },
        ]
      },
    ]));

    render(<App />);

    const dragEvent = {
      active: { id: 'task-1', data: { current: { sortable: { containerId: 'todo', index: 0 } } } },
      over: {
        id: 'task-2',
        data: { current: { sortable: { containerId: 'doing', index: 0 } } },
      },
    };

    await act(async () => {
      mockCallbacks.triggerDragOver?.(dragEvent);
      mockCallbacks.triggerDragOver?.(dragEvent);
      mockCallbacks.triggerDragOver?.(dragEvent);
    });

    const doingColumn = document.querySelector('[data-id="doing"]') as HTMLElement;
    if (!doingColumn) throw new Error('Doing column not found');

    expect(within(doingColumn).getAllByRole('button')).toHaveLength(2);
    expect(within(doingColumn).getByText('Dragged task')).toBeInTheDocument();
    expect(within(doingColumn).getByText('Existing destination task')).toBeInTheDocument();
  });

  it('restores the original board when a cross-column drag is canceled', async () => {
    localStorage.setItem('kanban-active-board', 'cancel-preview-order');
    localStorage.setItem('kanban-boards', JSON.stringify([
      {
        id: 'cancel-preview-order',
        title: 'Cancel Preview Order',
        columns: [
          {
            id: 'todo',
            title: 'To Do',
            color: '#6366f1',
            tasks: [
              { id: 'task-1', title: 'Dragged task', description: '', status: 'todo', subtasks: [], columnId: 'todo' },
            ],
          },
          {
            id: 'doing',
            title: 'In Progress',
            color: '#f59e0b',
            tasks: [
              { id: 'task-2', title: 'Existing destination task', description: '', status: 'doing', subtasks: [], columnId: 'doing' },
            ],
          },
          { id: 'done', title: 'Done', color: '#10b981', tasks: [] },
        ],
        tasks: [
          { id: 'task-1', title: 'Dragged task', description: '', status: 'todo', subtasks: [], columnId: 'todo' },
          { id: 'task-2', title: 'Existing destination task', description: '', status: 'doing', subtasks: [], columnId: 'doing' },
        ]
      },
    ]));

    render(<App />);

    await act(async () => {
      mockCallbacks.triggerDragOver?.({
        active: { id: 'task-1', data: { current: { sortable: { containerId: 'todo', index: 0 } } } },
        over: {
          id: 'task-2',
          data: { current: { sortable: { containerId: 'doing', index: 0 } } },
        },
      });
    });

    await act(async () => {
      mockCallbacks.triggerDragCancel?.();
    });

    const stored = JSON.parse(localStorage.getItem('kanban-boards')!);
    const board = stored.find((b: any) => b.id === 'cancel-preview-order');
    if (!board) throw new Error('Board not found');
    const todoCol = board.columns.find((c: any) => c.id === 'todo');
    const doingCol = board.columns.find((c: any) => c.id === 'doing');
    if (!todoCol || !doingCol) throw new Error('Columns not found');

    expect(board.tasks.filter((t: any) => t.columnId === todoCol.id).map((task: any) => task.id)).toEqual(['task-1']);
    expect(board.tasks.filter((t: any) => t.columnId === doingCol.id).map((task: any) => task.id)).toEqual(['task-2']);
  });

  it('does not reorder when dropping at the same position', async () => {
    render(<App />);

    const storedBefore = JSON.parse(localStorage.getItem('kanban-boards')!);
    const boardBefore = storedBefore.find((b: any) => b.id === 'platform-launch');
    if (!boardBefore) throw new Error('Board not found');
    const todoColBefore = boardBefore.columns.find((c: any) => c.id === 'todo');
    if (!todoColBefore) throw new Error('Todo column not found');
    const firstTaskBefore = boardBefore.tasks.find((t: any) => t.columnId === todoColBefore.id)?.id;

    await act(async () => {
      mockCallbacks.triggerDragEnd?.({
        active: { id: 'task-1', data: { current: { sortable: { containerId: 'todo', index: 0 } } } },
        over: { id: 'todo', data: { current: { sortable: { containerId: 'todo', index: 0 } } } },
      });
    });

    const storedAfter = JSON.parse(localStorage.getItem('kanban-boards')!);
    const boardAfter = storedAfter.find((b: any) => b.id === 'platform-launch');
    if (!boardAfter) throw new Error('Board not found');
    const todoColAfter = boardAfter.columns.find((c: any) => c.id === 'todo');
    if (!todoColAfter) throw new Error('Todo column not found');

    expect(boardAfter.tasks.find((t: any) => t.columnId === todoColAfter.id)?.id).toBe(firstTaskBefore);
  });
});