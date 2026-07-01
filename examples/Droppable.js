// Example file provided by dndkit - https://dndkit.com/react/quickstart/
// This file is not part of the application, it is just an example to be used as a reference.
import {useDroppable} from '@dnd-kit/react';

function Droppable({id, children}) {
  const {ref} = useDroppable({
    id,
  });

  return (
    <div ref={ref} style={{width: 300, height: 300}}>
      {children}
    </div>
  );
}