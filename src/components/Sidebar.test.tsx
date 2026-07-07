import { render } from '@testing-library/react';
import Sidebar from './Sidebar';
import type { Board } from '../types';
import { describe, it, expect } from 'vitest';

describe('Sidebar', () => {
  const mockBoards: Board[] = [
    {
      id: 'board-1',
      title: 'Board 1',
      columns: [{ id: 'todo', title: 'To Do', color: '#000' }],
      tasks: [],
    },
  ];

  it('renders correctly', () => {
    const { container } = render(
      <Sidebar
        boards={mockBoards}
        activeBoardId="board-1"
        onSelectBoard={vi.fn()}
      />
    );
    expect(container).toBeTruthy();
  });
});
