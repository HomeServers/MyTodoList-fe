import './styles/Button.css'; // 버튼 스타일 파일

export const SecondaryButton = ({ children, onClick, type = 'button' }) => (
    <button
      type={type}
      onClick={onClick}
      className="btn btn-secondary"
    >
      {children}
    </button>
  );
  