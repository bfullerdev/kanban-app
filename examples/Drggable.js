// Example file provided by dndkit - https://dndkit.com/react/quickstart/
// This file is not part of the application, it is just an example to be used as a reference.
import {useDraggable} from '@dnd-kit/react';

export function Draggable() {
  const {ref} = useDraggable({
    id: 'draggable',
  });

  return (
    <button ref={ref}>
      Draggable
    </button>
  );
}