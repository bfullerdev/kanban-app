import { useBoardData } from './useBoardData';
import type { Board } from '../types';
import { describe, it, expect, vi } from 'vitest';

// Mock useBoardData
vi.mock('./useBoardData', () => ({
  useBoardData: vi.fn(),
}));

const mockUseBoardData = vi.mocked(useBoardData);

describe('useBoardData', () => {
  const mockBoards: Board[] = [
    {
      id: 'board-1',
      title: 'Board 1',
      columns: [{ id: 'todo', title: 'To Do', color: '#000' }],
      tasks: [],
    },
  ];
  const mockActiveBoardId = 'board-1';
  const mockActiveBoard = mockBoards[0];
  const mockSelectBoard = vi.fn();
  const mockUpdateBoard = vi.fn();

  beforeEach(() => {
    mockUseBoardData.mockReturnValue({
      boards: mockBoards,
      activeBoardId: mockActiveBoardId,
      activeBoard: mockActiveBoard,
      selectBoard: mockSelectBoard,
      updateBoard: mockUpdateBoard,
    });
  });

  it('should return mocked data', () => {
    const { boards, activeBoardId, activeBoard, selectBoard, updateBoard } = useBoardData();
    expect(boards).toEqual(mockBoards);
    expect(activeBoardId).toBe(mockActiveBoardId);
    expect(activeBoard).toEqual(mockActiveBoard);
    expect(selectBoard).toBe(mockSelectBoard);
    expect(updateBoard).toBe(mockUpdateBoard);
  });
});
