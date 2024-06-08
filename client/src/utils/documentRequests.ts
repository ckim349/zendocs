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
  }
  deleteFromDatabase();
}

export const loadDocument = async (docId: string) => {
  const getDoc = async () => {
    let localDoc;
    let remoteDoc;

    try {
      const transaction = (await idb.documents).transaction('localDocuments', 'readwrite');
      localDoc = await transaction.store.get(docId);
    } catch {
      console.error('Error fetching local document:');
    }

    try {
      // Load document from remote database
      const response = await fetch(`http://localhost:5000/document/load/${docId}`, { method: "GET" })
      const data = await response.json();
      remoteDoc = data.docToFind;
    } catch {
      console.error('Error fetching local document:');
    }

    if (!localDoc && !remoteDoc) {
      return { doc: null, remoteLoaded: false };
    } else if (!localDoc && remoteDoc) {
      return { doc: remoteDoc, remoteLoaded: true };
    } else if (localDoc && !remoteDoc) {
      return { doc: localDoc, remoteLoaded: false };
    }

    // Return the doc that was updated last
    if (remoteDoc.lastUpdatedDate >= localDoc.lastUpdatedDate) {
      return { doc: remoteDoc, remoteLoaded: true };
    } else {
      return { doc: localDoc, remoteLoaded: true };
    }
  }

  const { doc, remoteLoaded } = await getDoc();
  return { doc, remoteLoaded };
}

export const updateDocument = async (base64Encoded: string, docId: string, docTitle: string | undefined) => {
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
  if (docTitle !== "" && docTitle !== null && docTitle !== undefined) {
    localDoc.title = docTitle;
  }
  localDoc.lastUpdatedDate = new Date().toISOString();

  transaction.store.put(localDoc);

  // Remote database update
  try {
    await fetch(`http://localhost:5000/document/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        documentId: docId,
        title: docTitle,
        content: base64Encoded
      }),
    })
  } catch {
    return false;
  }

  return true;
}