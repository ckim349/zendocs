import * as Y from 'yjs'
import { fromUint8Array, toUint8Array } from "js-base64";
import { idb } from "./idb";

export const createDocument = async (id: string, name: string) => {
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
  transaction.store.add({ "documentId": id, "title": name, "content": content, "createdDate": createdDate, "lastUpdatedDate": lastUpdatedDate, "deleted": false });
  transaction.done
    .catch(() => {
      console.error('Something went wrong, transaction aborted');
    });

  return content;
}

export const duplicateDocument = async (docId: string, title: string, ydoc: Y.Doc) => {
  const content = fromUint8Array(Y.encodeStateAsUpdate(ydoc));
  const createdDate = new Date().toISOString();
  const lastUpdatedDate = createdDate;

  fetch('http://localhost:5000/document/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "documentId": docId,
      "title": title,
      "content": content,
      "createdDate": createdDate,
      "lastUpdatedDate": lastUpdatedDate
    }),
  })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));

  const transaction = (await idb.documents).transaction('localDocuments', 'readwrite');
  transaction.store.add({ "documentId": docId, "title": title, "content": content, "createdDate": createdDate, "lastUpdatedDate": lastUpdatedDate, "deleted": false });
  transaction.done
    .catch(() => {
      console.error('Something went wrong, transaction aborted');
    });
}

export const deleteDocument = async (docId: string) => {
  const deleteFromDatabase = async () => {
    const transaction = (await idb.documents).transaction('localDocuments', 'readwrite');
    const localDoc = await transaction.store.get(docId);

    fetch(`http://localhost:5000/document/delete/${docId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "documentId": docId,
      }),
    })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => {
        console.error('Error:', error)
      }
      );

    localDoc.deleted = true;
    transaction.store.put(localDoc);
    return;
  }
  deleteFromDatabase();
}

export const loadDocument = async (docId: string) => {
  const getDoc = async () => {

    const transaction = (await idb.documents).transaction('localDocuments', 'readwrite');
    const localDoc = await transaction.store.get(docId);

    // Load document from remote database
    fetch(`http://localhost:5000/document/load/${docId}`, {
      method: "GET"
    })
      .then((response) => response.json())
      .then((data) => {
        // Return the doc that was updated last
        if (data.docToFind.lastUpdatedDate >= localDoc.lastUpdatedDate) {
          return data.docToFind;
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });

    return localDoc;
  }

  const doc = await getDoc();

  return doc;
}

export const updateDocument = async (base64Encoded: string, docId: string, docTitle: string) => {
  // local database update
  const transaction = (await idb.documents).transaction('localDocuments', 'readwrite');
  const localDoc = await transaction.store.get(docId);

  const doc = new Y.Doc();
  // Only applies update of content from database doc if content not null
  if (base64Encoded !== null) {
    const update = toUint8Array(base64Encoded)
    if (localDoc.content !== "AA==") {
      Y.applyUpdate(doc, toUint8Array(localDoc.content));
    }
    Y.applyUpdate(doc, update);
    localDoc.content = fromUint8Array(Y.encodeStateAsUpdate(doc))
  }
  if (docTitle !== "" && docTitle !== null) {
    localDoc.title = docTitle;
  }
  localDoc.lastUpdatedDate = new Date().toISOString();

  transaction.store.put(localDoc);

  // Remote database update
  fetch(`http://localhost:5000/document/update`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      documentId: docId,
      title: null,
      content: base64Encoded
    }),
  })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => {
      console.error('Error:', error)
    }
    );
}