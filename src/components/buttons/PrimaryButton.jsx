import './styles/Button.css'; // 버튼 스타일 파일

export const PrimaryButton = ({ children, onClick, type = 'button', ariaLabel }) => (
    <button
      type={type}
      onClick={onClick}
      className="btn btn-primary"
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );