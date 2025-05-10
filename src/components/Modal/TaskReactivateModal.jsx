import React, { useState, useRef } from 'react';
import styles from './styles/TaskInputModal.module.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

/**
 * TaskReactivateModal - 만료 Task 재활성화 모달
 * @param {object} task - 재활성화할 태스크 객체
 * @param {boolean} isOpen - 모달 표시 여부
 * @param {function} onClose - 모달 닫기 핸들러
 * @param {function} onReactivate - 재활성화 완료 핸들러({ dueDate })
 */
const TaskReactivateModal = ({ task, isOpen, onClose, onReactivate }) => {
  const [dueDate, setDueDate] = useState(null);
  const datePickerRef = useRef(null);

  React.useEffect(() => {
    if (!isOpen) setDueDate(null);
  }, [isOpen]);

  if (!isOpen || !task) return null;

  const handleConfirm = () => {
    if (dueDate) {
      const d = new Date(dueDate);
      d.setHours(23, 59, 59, 999);
      onReactivate({ dueDate: d.toISOString() });
      setDueDate(null);
    }
  };

  const handleCancel = () => {
    onClose();
    setDueDate(null);
  };

  return (
    <div className={styles.modalOverlay} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <div className={styles.modalTitle}>Task 재활성화</div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>새 마감일 지정</div>
          <div className={styles.dueDateArea}>
            <DatePicker
              selected={dueDate}
              onChange={setDueDate}
              minDate={new Date()}
              placeholderText="마감일 선택(필수)"
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
          <button className="secondaryButton" onClick={handleCancel}>취소</button>
          <button className="primaryButton" onClick={handleConfirm} disabled={!dueDate}>재활성화</button>
        </div>
      </div>
    </div>
  );
};

export default TaskReactivateModal;
