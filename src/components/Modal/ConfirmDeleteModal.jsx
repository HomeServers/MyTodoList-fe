import React from 'react';
import styles from './styles/ConfirmDeleteModal.module.css';

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, taskTitle }) => {
  // 모달 외부 클릭 시 닫기
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // ESC 키 누를 때 모달 닫기
  React.useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      // 모달 열릴 때 body 스크롤 방지
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      // 모달 닫힐 때 body 스크롤 복원
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  // 모달이 열려있지 않으면 null 반환
  if (!isOpen) return null;
  
  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContent}>
        <h3 className={styles.modalTitle}>태스크 삭제</h3>
        <p className={styles.modalMessage}>
          "{taskTitle}" 태스크를 삭제하시겠습니까?
        </p>
        <div className={styles.modalButtons}>
          <button 
            className={`${styles.modalButton} ${styles.cancelButton}`} 
            onClick={onClose}
          >
            취소
          </button>
          <button 
            className={`${styles.modalButton} ${styles.confirmButton}`} 
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
