import { Routes, Route } from 'react-router-dom'
import useLocalStorage from 'use-local-storage';

import HomePage from "./components/HomePage";
import ErrorPage from "./components/ErrorPage";
import DocumentPage from './components/DocumentPage';

function App() {
  const preference = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [isDark, setIsDark] = useLocalStorage("isDark", preference);
  const handleChange = () => {
    setIsDark(!isDark);
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage handleChange={handleChange} isDark={isDark} />} />
        <Route path="/document/:id" element={<DocumentPage handleChange={handleChange} isDark={isDark} />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </>
  );
}

export default App
