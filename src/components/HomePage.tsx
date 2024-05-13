import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom"
import { DarkModeProps } from "./DocumentPage";
import ToggleDarkMode from "./ToggleDarkMode";

const HomePage = ({ handleChange, isDark }: DarkModeProps) => {
  // once document object is created change string to thingy
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

    const value = inputRef.current!.value;

    setDocuments(prev => {
      return [...prev, value]
    });

    inputRef.current!.value = "";
  }

  return (
    <div className='container' data-theme={isDark ? "dark" : "light"}>
      <div className="home-nav-bar">
        <input type="search" onChange={e => setQuery(e.target.value)} className="home-search-bar" placeholder="Search for documents..." />
        <ToggleDarkMode handleChange={handleChange} isDark={isDark} />
      </div>

      <Link to="/document"><div className="home-document-card">New Document</div></Link>
      <form onSubmit={onSubmit}>
        New document: <input ref={inputRef} type="text" />
        <button type="submit">Add document</button>
      </form>
      <div className="home-document-grid">
        {filteredDocuments.map((document, index) => (
          <div className="home-document-card" key={index}>
            <div className="home-document-card-content">document content</div>
            <div className="home-document-card-title">{document}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HomePage