import React, { useState } from 'react';
import styles from './styles/TaskInputModal.module.css';
import TaskEditModal from './TaskEditModal';

/**
 * TaskDetailModal - 태스크 상세/수정 모달
 * @param {object} task - 상세 정보 표시할 태스크 객체
 * @param {boolean} isOpen - 모달 표시 여부
 * @param {function} onClose - 모달 닫기 핸들러
 * @param {function} onEdit - 수정 완료 핸들러(옵션)
 */
const TaskDetailModal = ({ task, isOpen, onClose, onEdit }) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);

  if (!isOpen || !task) return null;

  const handleEditClick = () => {
    setEditTask(task);
    setIsEditOpen(true);
  };
  const handleEditClose = () => {
    setIsEditOpen(false);
    setEditTask(null);
  };
  const handleEditSave = (edited) => {
    if (onEdit) onEdit({ ...task, ...edited });
    setIsEditOpen(false);
    setEditTask(null);
  };

  return (
    <>
      <div className={styles.modalOverlay} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
        <div className={styles.modalContent}>
          <div className={styles.modalHeader}>
            <div className={styles.modalTitle}>Task 상세 정보</div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>내용</div>
            <div style={{ whiteSpace: 'pre-wrap', marginBottom: 12 }}>{task.content}</div>
            {task.dueDate && (
              <div style={{ marginBottom: 8 }}>
                <span style={{ fontWeight: 500, color: '#4dabf7' }}>마감일: </span>
                {typeof task.dueDate === 'string' ? task.dueDate.slice(0, 10) : ''}
              </div>
            )}
            <div style={{ marginBottom: 8 }}>
              <span style={{ fontWeight: 500, color: '#888' }}>상태: </span>
              {task.status}
            </div>
          </div>
          <div className={styles.buttonArea}>
            <button className="secondaryButton" onClick={onClose}>닫기</button>
            <button className="primaryButton" onClick={handleEditClick}>수정</button>
          </div>
        </div>
      </div>
      <TaskEditModal
        task={editTask}
        isOpen={isEditOpen}
        onClose={handleEditClose}
        onSave={handleEditSave}
      />
    </>
  );
};

export default TaskDetailModal;
