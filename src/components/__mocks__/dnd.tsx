import { vi } from 'vitest';

vi.mock('@dnd-kit/react', () => ({
  DragDropProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="dnd-provider">{children}</div>,
  useDragDropMonitor: vi.fn(),
  useDroppable: vi.fn(() => ({ ref: vi.fn(), isDropTarget: false })),
}));

vi.mock('@dnd-kit/react/sortable', () => ({
  useSortable: vi.fn(() => ({
    handleRef: vi.fn(),
    ref: vi.fn(),
    isDragSource: false,
  })),
}));

vi.mock('@dnd-kit/dom', () => ({
  PointerSensor: {},
}));
