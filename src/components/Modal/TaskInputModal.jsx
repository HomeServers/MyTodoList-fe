import React, { useEffect, useRef, useState } from 'react';
import styles from './styles/TaskInputModal.module.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

/**
 * 새 태스크 추가를 위한 모달 컴포넌트
 * @param {boolean} isOpen - 모달 표시 여부
 * @param {function} onClose - 모달 닫기 핸들러
 * @param {function} onConfirm - 확인 버튼 클릭 시 실행할 함수
 */
const TaskInputModal = ({ isOpen, onClose, onConfirm }) => {
  const [content, setContent] = useState('');
  const [dueDate, setDueDate] = useState(null);
  const modalRef = useRef(null);
  const textareaRef = useRef(null);

  // 모달이 열리거나 닫힐 때 입력 내용 초기화
  useEffect(() => {
    if (!isOpen) {
      setContent('');
      setDueDate(null);
    }
  }, [isOpen]);

  // ESC 키 누를 때 모달 닫기
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      // 모달이 열릴 때 텍스트 영역에 포커스
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
      // 모달이 열릴 때 body에 스크롤 방지 클래스 추가
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      // 모달이 닫힐 때 body 스크롤 복원
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // 모달 외부 클릭 시 닫기 (이벤트 버블링 방지)
  const handleOverlayClick = (event) => {
    // 클릭된 요소가 오버레이 자체인 경우에만 닫기
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  // 확인 버튼 클릭 핸들러
  const handleConfirm = () => {
    if (content.trim()) {
      let finalDueDate = null;
      if (dueDate) {
        const d = new Date(dueDate);
        d.setHours(23, 59, 59, 999);
        finalDueDate = d.toISOString();
      }
      onConfirm({ content, dueDate: finalDueDate });
      setContent('');
      setDueDate(null);
    }
  };

  // 취소 버튼 클릭 핸들러
  const handleCancel = () => {
    onClose();
    // 취소 시에도 입력 내용 초기화 (이미 useEffect에서 처리되지만 명시적으로 추가)
    setContent('');
    setDueDate(null);
  };

  // 모달이 닫혀있으면 렌더링하지 않음
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContent} ref={modalRef}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>새 할 일 추가</h3>
        </div>
        <div className={styles.inputArea}>
          <textarea
            ref={textareaRef}
            className={styles.textArea}
            placeholder="할 일을 입력하세요"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div style={{ margin: '12px 0' }}>
            <DatePicker
              selected={dueDate}
              onChange={setDueDate}
              minDate={new Date()}
              placeholderText="만료일을 선택하세요"
              dateFormat="yyyy-MM-dd"
              isClearable
            />
          </div>
        </div>
        <div className={styles.buttonArea}>
          <button 
            className="secondaryButton" 
            onClick={handleCancel}
            type="button"
          >
            취소
          </button>
          <button 
            className="primaryButton" 
            onClick={handleConfirm}
            disabled={!content.trim()}
            type="button"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskInputModal;
