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
  transaction.store.add({ "documentId": id, "title": name, "content": content, "createdDate": createdDate, "lastUpdatedDate": lastUpdatedDate });
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
  transaction.store.add({ "documentId": docId, "title": title, "content": content, "createdDate": createdDate, "lastUpdatedDate": lastUpdatedDate });
  transaction.done
    .catch(() => {
      console.error('Something went wrong, transaction aborted');
    });

}