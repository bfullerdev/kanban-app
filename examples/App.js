// Example file provided by dndkit - https://dndkit.com/react/quickstart/
// This file is not part of the application, it is just an example to be used as a reference.
import {DragDropProvider} from '@dnd-kit/react';
import Draggable from './Draggable';
import Droppable from './Droppable';

function App() {
  const [isDropped, setIsDropped] = useState(false);

  return (
    <DragDropProvider
      onDragEnd={(event) => {
        if (event.canceled) return;

        const {target} = event.operation;
        setIsDropped(target?.id === 'droppable');
      }}
    >
      {!isDropped && <Draggable />}

      <Droppable id="droppable">
        {isDropped && <Draggable />}
      </Droppable>
    </DragDropProvider>
  );
}