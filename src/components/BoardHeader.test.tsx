import { vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BoardHeader from './BoardHeader';

describe('BoardHeader', () => {
  it('renders the board title', () => {
    render(<BoardHeader title="My Board" onOpenModal={() => {}} />);

    expect(screen.getByText('My Board')).toBeInTheDocument();
  });

  it('renders the add task button', () => {
    render(<BoardHeader title="My Board" onOpenModal={() => {}} />);

    expect(screen.getByText('Add New Task')).toBeInTheDocument();
  });

  it('calls onOpenModal when add button is clicked', async () => {
    const user = userEvent.setup();
    const onOpenModal = vi.fn();
    render(<BoardHeader title="My Board" onOpenModal={onOpenModal} />);

    await user.click(screen.getByText('Add New Task'));
    expect(onOpenModal).toHaveBeenCalled();
  });
});
