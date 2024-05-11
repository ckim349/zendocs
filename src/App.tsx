import { Routes, Route } from 'react-router-dom'

import Document from './components/Document'
import HomePage from "./components/HomePage";
import ErrorPage from "./components/ErrorPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />}/>
        <Route path="/document" element={<Document />}/>
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </>
  );
}

export default App
