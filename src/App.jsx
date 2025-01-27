// App.js
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useState } from 'react';

const initialTasks = {
  대기: [{ id: '1', content: '요리하기' }, { id: '2', content: '운동하기' }],
  진행중: [{ id: '3', content: '리액트 공부' }],
  완료: [{ id: '4', content: '설거지' }],
};

function App() {
  const [tasks, setTasks] = useState(initialTasks);

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;
  
    setTasks((prevTasks) => {
      // 1. 깊은 복사 생성
      const newTasks = JSON.parse(JSON.stringify(prevTasks));
  
      // 2. 원본 배열 변형 방지
      const sourceColumn = [...newTasks[source.droppableId]];
      const [movedItem] = sourceColumn.splice(source.index, 1);
      const destColumn = [...newTasks[destination.droppableId]];
  
      // 3. 새로운 배열 생성 후 업데이트
      destColumn.splice(destination.index, 0, movedItem);
  
      return {
        ...newTasks,
        [source.droppableId]: sourceColumn,
        [destination.droppableId]: destColumn,
      };
    });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div style={{ display: 'flex', gap: '20px' }}>
        {Object.keys(tasks).map((status) => (
          <Droppable key={status} droppableId={status}>
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={{
                  width: '300px',
                  background: '#f0f0f0',
                  padding: '10px',
                  borderRadius: '5px'
                }}
              >
                <h3>{status}</h3>
                {tasks[status].map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          padding: '10px',
                          margin: '5px 0',
                          background: 'white',
                          borderRadius: '3px',
                          ...provided.draggableProps.style
                        }}
                      >
                        {task.content}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}

export default App;