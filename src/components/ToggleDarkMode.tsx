interface ToggleProps {
  handleChange: () => void;
  isChecked: boolean;
}


const ToggleDarkMode = ({ handleChange, isChecked }: ToggleProps) => {
  return (
    <div className="toggle-container">
      <input
        type="checkbox"
        id="check"
        className="toggle"
        onChange={handleChange}
        checked={isChecked}
      />
      <label htmlFor="check">Dark Mode</label>
    </div>
  );
};
export default ToggleDarkMode