import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom"
import { DarkModeProps } from "./DocumentPage";
import ToggleDarkMode from "./ToggleDarkMode";

const HomePage = ({ handleChange, isDark }: DarkModeProps) => {
  const [documents, setDocuments] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredDocuments = useMemo(() => {
    return documents.filter(document => {
      // once document object is created change this to document.title.tolowercase
      return document.toLowerCase().includes(query.toLowerCase());
    })
  }, [documents, query])

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (inputRef.current?.value == "") {
      return;
    }

    setDocuments(prev => {
      return [...prev, inputRef.current!.value]
    });
    inputRef.current!.value = "";
  }


  return (
    <div className='container' data-theme={isDark ? "dark" : "light"}>
      <ToggleDarkMode handleChange={handleChange} isDark={isDark} />
      <div className="home-nav-bar">
        <input type="search" onChange={e => setQuery(e.target.value)} className="home-search-bar" placeholder="Search for documents..." />
      </div>
      <Link to="/document">New Document</Link>
      <form onSubmit={onSubmit}>
        New document: <input ref={inputRef} type="text" />
        <button type="submit">Add document</button>
      </form>
      <div className="recent-documents">
        <h3>Documents</h3>
        {filteredDocuments.map(document => (
          <div>{document}</div>
        ))}
      </div>
    </div>
  )
}

export default HomePage