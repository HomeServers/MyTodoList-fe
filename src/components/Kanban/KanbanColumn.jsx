import { Droppable } from '@hello-pangea/dnd';
import { KanbanCard } from './KanbanCard';
import { useState } from 'react';
import { PrimaryButton} from '../buttons/PrimaryButton';
import { SecondaryButton} from '../buttons/SecondaryButton'; 
import { InputField } from '../Inputs/InputField';
import './styles/KanbanColumn.css'; // 스타일 분리

export const KanbanColumn = ({ status, tasks, onAddTask }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddTask(status, inputValue);
    setInputValue('');
    setIsAdding(false);
  };

  return (
    <Droppable droppableId={status}>
      {(provided) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          className="kanban-column"
        >
          {/* 컬럼 헤더 */}
          <div className="kanban-header">
            <h3 className="kanban-title">{status}</h3>
            {status === '대기' && (
              <PrimaryButton onClick={() => setIsAdding(true)} ariaLabel="Add Task">
                ➕
              </PrimaryButton>
            )}
          </div>

          {/* 태스크 카드 */}
          <div className="kanban-tasks">
            {tasks.map((task, index) => (
              <KanbanCard key={task.id} task={task} index={index} />
            ))}
            {provided.placeholder}
          </div>

          {/* 새 태스크 추가 폼 */}
          {isAdding && (
            <form onSubmit={handleSubmit} className="kanban-form">
              <InputField
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="새 할 일 입력"
              />
              <div className="kanban-form-actions">
              {/* <PrimaryButton onClick={handleAddTask}>추가</PrimaryButton> */}
                <PrimaryButton type="submit">추가</PrimaryButton>
                <SecondaryButton onClick={() => setIsAdding(false)}>취소</SecondaryButton>
              </div>
            </form>
          )}
        </div>
      )}
    </Droppable>
  );
};
