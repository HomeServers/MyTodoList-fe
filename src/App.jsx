import { useKanban } from './hooks/useKanban';
import { KanbanBoard } from './components/Kanban/KanbanBoard';

export default function App() {
  const { tasks, handleDragEnd } = useKanban();
  return <KanbanBoard tasks={tasks} onDragEnd={handleDragEnd} />;
}
// // App.js
// import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
// import { useState } from 'react';

// const initialTasks = {
//   대기: [{ id: '1', content: '요리하기' }, { id: '2', content: '운동하기' }],
//   진행중: [{ id: '3', content: '리액트 공부' }],
//   완료: [{ id: '4', content: '설거지' }],
// };

// function App() {
//   const [tasks, setTasks] = useState(initialTasks);

//   const onDragEnd = (result) => {
//     const { source, destination } = result;
//     if (!destination) return;
  
//     setTasks((prevTasks) => {
//       // 1. 불변성 유지를 위한 얕은 복사
//       const newTasks = { ...prevTasks };
  
//       // 2. 같은 컬럼 이동 처리
//       if (source.droppableId === destination.droppableId) {
//         const copiedItems = [...newTasks[source.droppableId]];
//         const [removed] = copiedItems.splice(source.index, 1);
//         copiedItems.splice(destination.index, 0, removed);
//         newTasks[source.droppableId] = copiedItems;
//         return newTasks;
//       }
  
//       // 3. 다른 컬럼 이동 처리
//       const sourceItems = [...newTasks[source.droppableId]];
//       const destItems = [...newTasks[destination.droppableId]];
//       const [removed] = sourceItems.splice(source.index, 1);
//       destItems.splice(destination.index, 0, removed);
  
//       return {
//         ...newTasks,
//         [source.droppableId]: sourceItems,
//         [destination.droppableId]: destItems,
//       };
//     });
//   };

//   return (
//     <DragDropContext onDragEnd={onDragEnd}>
//       <div style={{ display: 'flex', gap: '20px' }}>
//         {Object.keys(tasks).map((status) => (
//           <Droppable key={status} droppableId={status}>
//             {(provided) => (
//               <div
//                 {...provided.droppableProps}
//                 ref={provided.innerRef}
//                 style={{
//                   width: '300px',
//                   background: '#f0f0f0',
//                   padding: '10px',
//                   borderRadius: '5px'
//                 }}
//               >
//                 <h3>{status}</h3>
//                 {tasks[status].map((task, index) => (
//                   <Draggable key={task.id} draggableId={task.id} index={index}>
//                     {(provided) => (
//                       <div
//                         ref={provided.innerRef}
//                         {...provided.draggableProps}
//                         {...provided.dragHandleProps}
//                         style={{
//                           padding: '10px',
//                           margin: '5px 0',
//                           background: 'white',
//                           borderRadius: '3px',
//                           ...provided.draggableProps.style
//                         }}
//                       >
//                         {task.content}
//                       </div>
//                     )}
//                   </Draggable>
//                 ))}
//                 {provided.placeholder}
//               </div>
//             )}
//           </Droppable>
//         ))}
//       </div>
//     </DragDropContext>
//   );
// }

// export default App;