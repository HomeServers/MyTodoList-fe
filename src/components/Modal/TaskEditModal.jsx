import React, { useState, useRef } from 'react';
import styles from './styles/TaskInputModal.module.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

/**
 * TaskEditModal - 태스크 내용/마감일 수정 모달
 * @param {object} task - 수정할 태스크 객체
 * @param {boolean} isOpen - 모달 표시 여부
 * @param {function} onClose - 모달 닫기 핸들러
 * @param {function} onSave - 수정 완료 핸들러({ content, dueDate })
 */
const TaskEditModal = ({ task, isOpen, onClose, onSave }) => {
  const [content, setContent] = useState(task?.content || '');
  const [dueDate, setDueDate] = useState(task?.dueDate ? new Date(task.dueDate) : null);
  const datePickerRef = useRef(null);

  React.useEffect(() => {
    setContent(task?.content || '');
    setDueDate(task?.dueDate ? new Date(task.dueDate) : null);
  }, [task, isOpen]);

  if (!isOpen || !task) return null;
  return (
    <div className={styles.modalOverlay} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <div className={styles.modalTitle}>Task 수정</div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>내용</div>
          <textarea
            className={styles.textArea}
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="수정할 내용을 입력하세요"
            style={{ marginBottom: 12 }}
          />
          <div className={styles.dueDateArea}>
            <DatePicker
              selected={dueDate}
              onChange={setDueDate}
              minDate={new Date()}
              placeholderText="마감일 선택(선택 안 해도 됨)"
              dateFormat="yyyy-MM-dd"
              isClearable
              customInput={
                <button
                  type="button"
                  className={styles.dueDateTrigger}
                  tabIndex={0}
                >
                  <span
                    role="img"
                    aria-label="calendar"
                    style={{ fontSize: '24px', marginRight: '8px', verticalAlign: 'middle' }}
                  >
                    📅
                  </span>
                  <span className={styles.dueDateTriggerLabel}>
                    {dueDate ?
                      (typeof dueDate === 'string' ? dueDate : dueDate.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }))
                      : '마감일'}
                  </span>
                </button>
              }
            />
          </div>
        </div>
        <div className={styles.buttonArea}>
          <button className="secondaryButton" onClick={onClose}>취소</button>
          <button
            className="primaryButton"
            onClick={() => {
              if (content.trim()) {
                onSave({ content: content.trim(), dueDate: dueDate ? dueDate.toISOString() : null });
              }
            }}
            disabled={!content.trim()}
          >저장</button>
        </div>
      </div>
    </div>
  );
};

export default TaskEditModal;
