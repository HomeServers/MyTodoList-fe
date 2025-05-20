import React from 'react';
import styles from './styles/ConfirmDeleteModal.module.css';

/**
 * 삭제 확인 모달 컴포넌트
 * @param {boolean} isOpen - 모달 표시 여부
 * @param {function} onConfirm - 확인 버튼 클릭 시 실행할 함수
 * @param {function} onCancel - 취소 버튼 클릭 시 실행할 함수
 */
const ConfirmDeleteModal = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  // 모달 외부 클릭 시 닫기 (이벤트 버블링 방지)
  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onCancel();
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>삭제 확인</h3>
        </div>
        <div className={styles.modalBody}>
          <p>정말로 이 태스크를 삭제하시겠습니까?</p>
          <p className={styles.warningText}>이 작업은 되돌릴 수 없습니다.</p>
        </div>
        <div className={styles.buttonArea}>
          <button 
            className="secondaryButton" 
            onClick={onCancel}
          >
            취소
          </button>
          <button 
            className="dangerButton" 
            onClick={onConfirm}
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
