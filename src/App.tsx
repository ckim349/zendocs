import { Routes, Route } from 'react-router-dom'

import HomePage from "./components/HomePage";
import ErrorPage from "./components/ErrorPage";
import DocumentPage from './components/DocumentPage';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />}/>
        <Route path="/document" element={<DocumentPage />}/>
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </>
  );
}

export default App
