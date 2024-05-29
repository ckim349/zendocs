import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import { DarkModeProps } from "./DocumentPage";
import ToggleDarkMode from "./ToggleDarkMode";
import { v4 as uuidv4 } from 'uuid';
import * as Y from 'yjs'
import { fromUint8Array } from "js-base64";
import { idb } from "../utils/idb";

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
    const fetchDocuments = async () => {
      // Local docs
      const transaction = (await idb.documents).transaction('localDocuments', 'readonly');
      const localDocuments = await transaction.store.getAll();
      setDocuments(localDocuments);

      // Remote docs
      fetch('http://localhost:5000/document_list', {
        method: 'GET'
      })
        .then((response) => response.json())
        .then((data) => {
          const remoteDocuments = data.documents;
          const mergedDocuments = mergeDocuments(localDocuments, remoteDocuments);

          setDocuments(mergedDocuments);

          const localOnlyDocuments = localDocuments.filter(({ documentId: id1 }) => !remoteDocuments.some(({ documentId: id2 }: DatabaseDocument) => id2 == id1));

          localOnlyDocuments.forEach((doc) => {
            fetch('http://localhost:5000/document/create', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                "documentId": doc.documentId,
                "title": doc.title,
                "content": doc.content,
                "createdDate": doc.createdDate,
                "lastUpdatedDate": doc.lastUpdatedDate
              }),
            }).catch((error) => {
              console.error('Error creating document:', error);
            })
          });
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
          setDocuments(localDocuments)
        });
    };

    fetchDocuments();
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

  const createDocument = async (id: string, name: string) => {
    const doc = new Y.Doc();

    const content = fromUint8Array(Y.encodeStateAsUpdate(doc));
    const createdDate = new Date().toISOString();
    const lastUpdatedDate = createdDate;

    fetch('http://localhost:5000/document/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "documentId": id,
        "title": name,
        "content": content,
        "createdDate": createdDate,
        "lastUpdatedDate": lastUpdatedDate
      }),
    })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error('Error:', error));

    const transaction = (await idb.documents).transaction('localDocuments', 'readwrite');
    transaction.store.add({ "documentId": id, "title": name, "content": content, "createdDate": createdDate, "lastUpdatedDate": lastUpdatedDate });
    transaction.done
      .catch(() => {
        console.error('Something went wrong, transaction aborted');
      });

    return content;
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (inputRef.current?.value == "") {
      return;
    }

    const value = inputRef.current!.value;
    const documentId = uuidv4();

    const content = await createDocument(documentId, value);
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

    navigate(`/document/${documentId}`)
    inputRef.current!.value = "";
  }

  const handleClick = () => {
    const documentId = uuidv4();
    createDocument(documentId, "Untitled")
    navigate(`/document/${documentId}`)
  }

  const mergeDocuments = (localDocs: DatabaseDocument[], remoteDocs: DatabaseDocument[]): DatabaseDocument[] => {
    const mergedDocs = [...localDocs, ...remoteDocs];
    const uniqueDocs = mergedDocs.reduce((acc: { [key: string]: DatabaseDocument }, doc) => {
      acc[doc.documentId] = doc;
      return acc;
    }, {});
    return Object.values(uniqueDocs);
  };

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