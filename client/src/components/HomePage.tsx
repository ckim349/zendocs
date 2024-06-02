import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import { DarkModeProps } from "./DocumentPage";
import ToggleDarkMode from "./ToggleDarkMode";
import { v4 as uuidv4 } from 'uuid';
import { idb } from "../utils/idb";
import { createDocument } from "../utils/documentRequests";

interface DatabaseDocument {
  documentId: string,
  title: string,
  content: string,
  createdDate: string,
  lastUpdatedDate: string,
  deleted?: boolean
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
      const getDocTransaction = (await idb.documents).transaction('localDocuments', 'readonly');
      const localDocuments = await getDocTransaction.store.getAll();
      setDocuments(localDocuments);

      // Remote docs
      await fetch('http://localhost:5000/document_list', {
        method: 'GET'
      })
        .then((response) => response.json())
        .then(async (data) => {
          const remoteDocuments = data.documents;
          const mergedDocuments = mergeDocuments(localDocuments, remoteDocuments);

          setDocuments(mergedDocuments);

          // Delete any documents up for deletion
          console.log(localDocuments)
          const documentsToDelete = localDocuments.filter((doc) => doc.deleted === true);
          console.log('documents up for deleteion', documentsToDelete);
          const transaction = (await idb.documents).transaction('localDocuments', 'readwrite');
          documentsToDelete.forEach(async (doc) => {
            await transaction.store.delete(doc.documentId);

            fetch(`http://localhost:5000/document/delete/${doc.documentId}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                "documentId": doc.documentId,
              }),
            })
              .then(response => response.json())
              .then(data => console.log(data))
              .catch(error => {
                console.error('Error:', error);
              }
              );
          })

          const localOnlyDocuments = localDocuments.filter(({ documentId: id1 }: DatabaseDocument) => !remoteDocuments.some(({ documentId: id2 }: DatabaseDocument) => id2 == id1));
          const remoteOnlyDocuments = mergedDocuments.filter(md => !localDocuments.find(ld => (ld.documentId === md.documentId)));

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

          const addDocTransaction = (await idb.documents).transaction('localDocuments', 'readwrite');
          remoteOnlyDocuments.forEach((doc: DatabaseDocument) => {
            addDocTransaction.store.add({ "documentId": doc.documentId, "title": doc.title, "content": doc.content, "createdDate": doc.createdDate, "lastUpdatedDate": doc.lastUpdatedDate, "deleted": false });
          })
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    };

    fetchDocuments();
  }, [])

  const filteredDocuments = useMemo(() => {
    if (Array.isArray(documents)) {
      return documents.
        filter(document => {
          // TODO occasional error where document titles are becoming null on update
          if ((!document.hasOwnProperty('deleted') || (document.hasOwnProperty('deleted') && !document.deleted)) && document.title !== null) {
            return document.title.toLowerCase().includes(query.toLowerCase());
          }
        }).sort((a, b) => {
          if (a.lastUpdatedDate > b.lastUpdatedDate) {
            return -1;
          } else {
            return 0;
          }
        });
    } else {
      return [];
    }
  }, [documents, query]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (inputRef.current?.value == "") {
      return;
    }

    const value = inputRef.current!.value;
    const documentId = uuidv4();

    createDocument(documentId, value);

    navigate(`/document/${documentId}`)
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

      <form className="home-create-doc-form" onSubmit={onSubmit}>
        New document: <input ref={inputRef} type="text" />
        <button className="home-create-doc-button" type="submit">Add document</button>
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