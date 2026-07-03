import { vi } from 'vitest';

const mockUseDraggable = vi.fn(() => ({
  draggable: {},
  isDragging: false,
  isDropping: false,
  isDragSource: false,
  handleRef: () => null,
  ref: () => null,
}));

const mockUseDroppable = vi.fn(() => ({
  ref: () => null,
  isDropTarget: false,
}));

const mockUseSortable = vi.fn(() => ({
  sortable: {
    draggable: {},
  },
  isDragging: false,
  handleRef: () => null,
  ref: () => null,
}));

const mockUseDragDropMonitor = {
  mock: vi.fn(),
  triggerDragEnd: vi.fn(),
  triggerDragOver: vi.fn(),
  clear: vi.fn(),
};

const mockCallbacks: any = {
  onDragEnd: null,
  onDragOver: null,
};

const mockDragDropProvider = vi.fn(({ children, onDragOver, onDragEnd }: any) => {
  if (onDragOver) mockCallbacks.onDragOver = onDragOver;
  if (onDragEnd) mockCallbacks.onDragEnd = onDragEnd;
  return (
    <div data-testid="drag-drop-provider" onDragOver={onDragOver} onDragEnd={onDragEnd}>
      {children}
    </div>
  );
});

vi.mock('@dnd-kit/react', () => ({
  useDraggable: mockUseDraggable,
  useDroppable: mockUseDroppable,
  DragDropProvider: mockDragDropProvider,
}));

vi.mock('@dnd-kit/react/sortable', () => ({
  useSortable: mockUseSortable,
}));

vi.mock('@dnd-kit/dom', () => ({
  PointerSensor: vi.fn(),
}));

export { mockUseDraggable, mockUseDroppable, mockUseSortable, mockUseDragDropMonitor, mockDragDropProvider, mockCallbacks };
