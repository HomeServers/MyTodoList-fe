import './InputField.css'

export const InputField = ({ value, onChange, placeholder }) => (
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="input-field"
    />
  );