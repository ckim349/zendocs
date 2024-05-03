import useLocalStorage from "use-local-storage";

import ToggleDarkMode from './components/ToggleDarkMode'
import Document from './components/Document'

function App() {
  const preference = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [isDark, setIsDark] = useLocalStorage("isDark", preference);

  return (
    <div className='container' data-theme={isDark ? "dark" : "light"}>
      <ToggleDarkMode handleChange={() => setIsDark(!isDark)} isChecked={isDark}/>
      <Document />
    </div>
  );
}

export default App
