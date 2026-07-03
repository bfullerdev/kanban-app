import { vi } from 'vitest';

let onDragEndCallback: ((...args: any[]) => void) | null = null;

const mockUseDragDropMonitor = vi.fn((callbacks: any) => {
  onDragEndCallback = callbacks?.onDragEnd ?? null;
}) as unknown as {
  triggerDragEnd: (operation: any) => void;
  mockClear: () => void;
  mock: { calls: any[][] };
  reset: () => void;
};

mockUseDragDropMonitor.triggerDragEnd = (operation: any) => {
  if (onDragEndCallback) {
    onDragEndCallback({ operation });
  }
};

mockUseDragDropMonitor.reset = () => {
  onDragEndCallback = null;
};

vi.mock('@dnd-kit/react', () => ({
  DragDropProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="dnd-provider">{children}</div>,
  useDragDropMonitor: mockUseDragDropMonitor,
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

export { mockUseDragDropMonitor };
