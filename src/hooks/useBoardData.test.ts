import { renderHook, act } from '@testing-library/react';
import { useBoardData } from './useBoardData';
import type { Board } from '../types';

beforeEach(() => {
  localStorage.clear();
});

describe('useBoardData', () => {
  it('creates default boards when nothing is stored', () => {
    const { result } = renderHook(() => useBoardData());

    expect(result.current.boards).toHaveLength(3);
    expect(result.current.boards[0].title).toBe('Platform Launch');
    expect(result.current.boards[1].title).toBe('Marketing Plan');
    expect(result.current.boards[2].title).toBe('Roadmap');
  });

  it('loads boards from localStorage', () => {
    const storedBoards: Board[] = [
      {
        id: 'custom',
        title: 'Custom Board',
        columns: [
          { id: 'todo', title: 'To Do', color: '#6366f1', tasks: [] },
          { id: 'doing', title: 'In Progress', color: '#f59e0b', tasks: [] },
          { id: 'done', title: 'Done', color: '#10b981', tasks: [] },
        ],
      },
    ];
    localStorage.setItem('kanban-boards', JSON.stringify(storedBoards));

    const { result } = renderHook(() => useBoardData());

    expect(result.current.boards).toHaveLength(1);
    expect(result.current.boards[0].title).toBe('Custom Board');
  });

  it('selects the first board by default', () => {
    const { result } = renderHook(() => useBoardData());

    expect(result.current.activeBoardId).toBe('platform-launch');
    expect(result.current.activeBoard).toBe(result.current.boards[0]);
  });

  it('selects a board and updates activeBoard', () => {
    const { result } = renderHook(() => useBoardData());

    act(() => {
      result.current.selectBoard('marketing-plan');
    });

    expect(result.current.activeBoardId).toBe('marketing-plan');
    expect(result.current.activeBoard?.title).toBe('Marketing Plan');
  });

  it('persists active board ID to localStorage', () => {
    const { result } = renderHook(() => useBoardData());

    act(() => {
      result.current.selectBoard('roadmap');
    });

    expect(localStorage.getItem('kanban-active-board')).toBe('roadmap');
  });

  it('updates the active board via function', () => {
    const { result } = renderHook(() => useBoardData());

    act(() => {
      result.current.updateBoard((prev: Board) => ({
        ...prev,
        title: 'Updated Board',
        columns: prev.columns.map((col) => ({
          ...col,
          tasks: [
            ...col.tasks,
            {
              id: 'new-task',
              title: 'New Task',
              description: 'Description',
              status: 'todo',
              subtasks: [],
            },
          ],
        })),
      }));
    });

    expect(result.current.activeBoard?.title).toBe('Updated Board');
    expect(result.current.activeBoard?.columns[0].tasks).toHaveLength(2);
  });

  it('updates the active board via object', () => {
    const { result } = renderHook(() => useBoardData());

    const updatedBoard: Board = {
      ...result.current.activeBoard!,
      title: 'Replaced Board',
    };

    act(() => {
      result.current.updateBoard(updatedBoard);
    });

    expect(result.current.activeBoard?.title).toBe('Replaced Board');
  });

  it('persists boards to localStorage on update', () => {
    const { result } = renderHook(() => useBoardData());

    act(() => {
      result.current.updateBoard((prev: Board) => ({
        ...prev,
        title: 'Updated',
      }));
    });

    const stored = JSON.parse(localStorage.getItem('kanban-boards')!);
    expect(stored[0].title).toBe('Updated');
  });

  it('does not update inactive boards', () => {
    const { result } = renderHook(() => useBoardData());

    act(() => {
      result.current.selectBoard('marketing-plan');
    });

    act(() => {
      result.current.updateBoard((prev: Board) => ({
        ...prev,
        title: 'Updated Marketing',
      }));
    });

    expect(result.current.boards.find((b) => b.id === 'platform-launch')?.title).toBe('Platform Launch');
    expect(result.current.boards.find((b) => b.id === 'marketing-plan')?.title).toBe('Updated Marketing');
  });
});
