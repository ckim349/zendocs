import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom"
import { DarkModeProps } from "./DocumentPage";
import ToggleDarkMode from "./ToggleDarkMode";
import { v4 as uuidv4 } from 'uuid';
import * as Y from 'yjs'
import { TiptapCollabProvider } from '@hocuspocus/provider'
import { IndexeddbPersistence } from 'y-indexeddb'
import { fromUint8Array } from "js-base64";

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
    const documentId = uuidv4();

    // set up yjs doc with local storage and tiptapcollabprovider
    const doc = new Y.Doc();
    new IndexeddbPersistence('example-document', doc);
    const provider = new TiptapCollabProvider({
      name: "documentname", // Unique document identifier for syncing. This is your document name.
      appId: '0k3q8d95', // Your Cloud Dashboard AppID or `baseURL` for on-premises
      token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3MTQ4NzE3NzQsIm5iZiI6MTcxNDg3MTc3NCwiZXhwIjoxNzE0OTU4MTc0LCJpc3MiOiJodHRwczovL2Nsb3VkLnRpcHRhcC5kZXYiLCJhdWQiOiIwazNxOGQ5NSJ9.pmTtqOAPJMN5Er3OpmEe_zsnMfJ1-USOaaCGThzxME4', // for testing
      document: doc,
    })

    const content = fromUint8Array(Y.encodeStateAsUpdate(doc));
    // console.log('state vector: ', Y.encodeStateAsUpdate(doc));
    // console.log('content: ', fromUint8Array(Y.encodeStateAsUpdate(doc)));

    fetch('http://localhost:5000/document/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "documentId": documentId,
        "title": value,
        "content": content
      }),
    })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error('Error:', error));

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