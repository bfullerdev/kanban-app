import { vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Sidebar from './Sidebar';
import type { Board } from '../types';

beforeEach(() => {
  localStorage.clear();
});

const mockBoards: Board[] = [
  { id: 'board-1', title: 'Project Alpha', columns: [] },
  { id: 'board-2', title: 'Project Beta', columns: [] },
  { id: 'board-3', title: 'Project Gamma', columns: [] },
];

describe('Sidebar', () => {
  it('renders all boards', () => {
    render(
      <Sidebar
        boards={mockBoards}
        activeBoardId={null}
        onSelectBoard={() => {}}
        onCreateBoard={() => {}}
      />
    );

    expect(screen.getByText('Project Alpha')).toBeInTheDocument();
    expect(screen.getByText('Project Beta')).toBeInTheDocument();
    expect(screen.getByText('Project Gamma')).toBeInTheDocument();
  });

  it('highlights the active board', () => {
    render(
      <Sidebar
        boards={mockBoards}
        activeBoardId="board-2"
        onSelectBoard={() => {}}
        onCreateBoard={() => {}}
      />
    );

    expect(screen.getByText('Project Beta').closest('button')).toHaveClass('bg-primary/20');
    expect(screen.getByText('Project Alpha').closest('button')).toHaveClass('text-white/60');
  });

  it('calls onSelectBoard when a board is clicked', async () => {
    const user = userEvent.setup();
    const onSelectBoard = vi.fn();
    render(
      <Sidebar
        boards={mockBoards}
        activeBoardId="board-1"
        onSelectBoard={onSelectBoard}
        onCreateBoard={() => {}}
      />
    );

    const nav = screen.getByRole('navigation');
    await user.click(within(nav).getByText('Project Beta'));
    expect(onSelectBoard).toHaveBeenCalledWith('board-2');
  });

  it('renders the create new board button', () => {
    render(
      <Sidebar
        boards={mockBoards}
        activeBoardId={null}
        onSelectBoard={() => {}}
        onCreateBoard={() => {}}
      />
    );

    expect(screen.getByText('Create New Board')).toBeInTheDocument();
  });

  it('renders theme toggle buttons', () => {
    render(
      <Sidebar
        boards={mockBoards}
        activeBoardId={null}
        onSelectBoard={() => {}}
        onCreateBoard={() => {}}
      />
    );

    expect(screen.getByText('Dark')).toBeInTheDocument();
    expect(screen.getByText('Light')).toBeInTheDocument();
  });

  it('renders the hide sidebar button', () => {
    render(
      <Sidebar
        boards={mockBoards}
        activeBoardId={null}
        onSelectBoard={() => {}}
        onCreateBoard={() => {}}
      />
    );

    expect(screen.getByText('Hide')).toBeInTheDocument();
  });

  it('renders the app logo', () => {
    render(
      <Sidebar
        boards={mockBoards}
        activeBoardId={null}
        onSelectBoard={() => {}}
        onCreateBoard={() => {}}
      />
    );

    expect(screen.getByText('kanban')).toBeInTheDocument();
  });
});
