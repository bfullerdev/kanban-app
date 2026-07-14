# Kanban App Issues (vs react-dnd-kit-tailwind-shadcn-ui reference)

## 1. ~~Missing drag handle button separation (TaskCard.tsx)~~ ✅ Fixed
Your grip icon is inside the card's `<button>` element. If the user clicks anywhere on the card to edit, it also triggers drag events. The reference separates the grip into its own `<Button variant="ghost">` with `{...listeners}` and `{...attributes}`, so only the grip initiates dragging. Clicking the rest of the card only opens the modal.

## 2. ~~No TouchSensor configured (App.tsx:74)~~ ✅ Fixed
You only use `PointerSensor`. The reference uses `useSensors(MouseSensor, TouchSensor, KeyboardSensor)` — enabling touch support and keyboard navigation. This is likely why dragging feels janky on some inputs.

## 3. No accessibility announcements
Your `DndContext` has no `accessibility` prop. The reference provides full `Announcements` for `onDragStart`, `onDragOver`, `onDragEnd`, `onDragCancel` — critical for screen readers and a11y compliance.

## 4. DragOverlay not portalized (App.tsx:158-180)
Your `DragOverlay` renders inside the component tree. The reference uses `createPortal(..., document.body)` so the overlay floats above all other elements without being clipped by overflow/position constraints.

## 5. No discriminated drag data / type guards
Your `getTaskLocation` and `getDragTarget` functions manually search through the board to find tasks. The reference attaches `{ type: "Task", task }` data to `useSortable` and uses `hasDraggableData()` type guard to safely narrow types in event handlers — eliminating manual lookups and preventing bugs when IDs collide.

## 6. `onDragOver` updates state without handling same-column reorders (App.tsx:107-118)
Your `onDragOver` only handles cross-column moves. It never updates the visual preview for same-column reordering during drag. The reference calls `arrayMove` in `onDragOver` for both cases, giving smooth live preview in all scenarios.

## 7. `onDragEnd` logic duplicates `onDragOver` logic (App.tsx:119-140)
You apply the mutation again in `onDragEnd`, but since `onDragOver` already called `updateBoard`, this double-update can cause visual glitches or lost updates. The reference's `onDragEnd` only handles column reordering (not task moves), since tasks are already moved in `onDragOver`.

## 8. `previousBoard` ref doesn't clone deeply (App.tsx:72, App.tsx:95)
`previousBoard.current = activeBoard` just copies the reference. When `activeBoard` state updates, the ref points to the same mutated object. Restoring on cancel (`updateBoard(previousBoard.current)`) restores the *current* state, not the *previous* one. The reference avoids this by using `pickedUpTaskColumn` ref (transient single value) instead of cloning the entire board.

## 9. Column has `isOver` background conflict (Column.tsx:34-36)
The inner scroll area background toggles between `bg-white/5` and `bg-[#1a1a2a]`, but the outer div also toggles between `bg-[#2a2a3a]` and `bg-[#1a1a2a]`. When `isOver` is true, both backgrounds shift to `bg-[#1a1a2a]`, making the column blend into the board background. The reference uses `cva` with distinct visual states (`ring-2 opacity-30`) that don't conflict.

## 10. `SortableContext` id prop wrong (Column.tsx:37)
You pass `id={column.id}` to `SortableContext`, but `SortableContext` expects `id` to be a string identifier for the droppable container, not the column ID itself. This should be consistent with how `useDroppable` registers the container ID. Minor but can cause collision detection issues.

## 11. No `animateLayoutChanges` consistency
Your `animateWhileSorting` returns `false` when not sorting, which can cause layout jumps. The reference uses `defaultAnimateLayoutChanges` during sorting for smoother transitions.

## 12. No horizontal scroll snapping management
The reference's `BoardContainer` uses `useDndContext` to toggle `snap-x snap-mandatory` vs `snap-none` based on drag state. Your board has no scroll snapping control, which can cause the board to snap-scroll unexpectedly during drag.
