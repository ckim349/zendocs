import { DarkModeProps } from "./pages/DocumentPage";

const ToggleDarkMode = ({ handleChange, isDark }: DarkModeProps) => {
  return (
    <div className="toggle-container">
      <input
        type="checkbox"
        id="check"
        className="toggle"
        onChange={handleChange}
        checked={isDark}
      />
      <label htmlFor="check">Dark Mode</label>
    </div>
  );
};
export default ToggleDarkMode