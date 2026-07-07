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
    register: () => () => {},
    unregister: () => {},
    destroy: () => {},
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
  onDragCancel: null,
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

vi.mock('@dnd-kit/core', () => ({
  closestCorners: vi.fn(),
  pointerWithin: vi.fn(() => []),
  useDroppable: mockUseDroppable,
  DndContext: ({ children, onDragOver, onDragEnd, onDragCancel }: any) => {
    const triggerDragEnd = (event: any) => {
      if (onDragEnd) {
        onDragEnd(event);
      }
    };
    const triggerDragOver = (event: any) => {
      if (onDragOver) {
        onDragOver(event);
      }
    };
    const triggerDragCancel = () => {
      if (onDragCancel) {
        onDragCancel();
      }
    };
    mockCallbacks.triggerDragEnd = triggerDragEnd;
    mockCallbacks.triggerDragOver = triggerDragOver;
    mockCallbacks.triggerDragCancel = triggerDragCancel;
    return (
      <div data-testid="dnd-context" onDragOver={onDragOver} onDragEnd={onDragEnd}>
        {children}
      </div>
    );
  },
  useSensor: (sensor: any) => sensor,
  PointerSensor: { createSensor: () => vi.fn() },
}));

vi.mock('@dnd-kit/sortable', () => ({
  defaultAnimateLayoutChanges: vi.fn(({ isSorting }: any) => isSorting),
  useSortable: mockUseSortable,
  SortableContext: ({ children, items }: any) => (
    <div data-testid="sortable-context" data-items={JSON.stringify(items)}>
      {children}
    </div>
  ),
  verticalListSortingStrategy: {},
}));

vi.mock('@dnd-kit/utilities', () => ({
  CSS: {
    Translate: {
      toString: (transform: any) => {
        if (!transform) return '';
        return `translate(${transform.x}px, ${transform.y}px)`;
      },
    },
  },
}));

export { mockUseDraggable, mockUseDroppable, mockUseSortable, mockUseDragDropMonitor, mockDragDropProvider, mockCallbacks };
