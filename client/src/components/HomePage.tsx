import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import { DarkModeProps } from "./DocumentPage";
import ToggleDarkMode from "./ToggleDarkMode";
import { v4 as uuidv4 } from 'uuid';
import * as Y from 'yjs'
import { fromUint8Array } from "js-base64";
import { openDB } from "idb";

interface DatabaseDocument {
  documentId: string,
  title: string,
  content: string,
  createdDate: string,
  lastUpdatedDate: string
}

const HomePage = ({ handleChange, isDark }: DarkModeProps) => {
  // once document object is created change string to thingy
  const [documents, setDocuments] = useState<DatabaseDocument[]>([]);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Get list of documents on render
  useEffect(() => {
    fetch('http://localhost:5000/document_list', {
      method: 'GET'
    })
      .then((response) => response.json())
      .then((data) => {
        setDocuments(data.documents);
        console.log(data.documents);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [])

  const filteredDocuments = useMemo(() => {
    if (Array.isArray(documents)) {
      return documents.filter(document => {
        // TODO occasional error where document titles are becoming null on update
        if (document.title !== null) {
          return document.title.toLowerCase().includes(query.toLowerCase());
        }
      });
    } else {
      return [];
    }
  }, [documents, query]);

  const createDocument = (id: string, name: string) => {
    const doc = new Y.Doc();

    const content = fromUint8Array(Y.encodeStateAsUpdate(doc));

    fetch('http://localhost:5000/document/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "documentId": id,
        "title": name,
        "content": content
      }),
    })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error('Error:', error));

    return content;
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (inputRef.current?.value == "") {
      return;
    }

    const value = inputRef.current!.value;
    const documentId = uuidv4();

    const content = createDocument(documentId, value);
    const currentDate = new Date().toISOString();

    setDocuments(prev => {
      const prevArray = Array.isArray(prev) ? prev : [];
      return [...prevArray, {
        documentId: documentId,
        title: value,
        content: content,
        createdDate: currentDate,
        lastUpdatedDate: currentDate
      }]
    });

    inputRef.current!.value = "";
  }

  const handleClick = () => {
    const documentId = uuidv4();
    createDocument(documentId, "Untitled")
    navigate(`/document/${documentId}`)
  }

  return (
    <div className='container' data-theme={isDark ? "dark" : "light"}>
      <div className="home-nav-bar">
        <input type="search" onChange={e => setQuery(e.target.value)} className="home-search-bar" placeholder="Search for documents..." />
        <ToggleDarkMode handleChange={handleChange} isDark={isDark} />
      </div>

      <div className="home-document-card" onClick={handleClick}>
        New Document
      </div>

      <form onSubmit={onSubmit}>
        New document: <input ref={inputRef} type="text" />
        <button type="submit">Add document</button>
      </form>
      <div className="home-document-grid">
        {filteredDocuments.map((document, index) => (
          <div className="home-document-card" key={index}>
            <Link to={`/document/${document.documentId}`}>
              <div className="home-document-card-content">document content</div>
              <div className="home-document-card-title">{document.title}</div>
            </Link>
          </div>
        ))}
      </div>
    </div >
  )
}

export default HomePage