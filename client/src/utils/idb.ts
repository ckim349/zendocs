import { openDB } from "idb";

const dbPromise = openDB("localDocuments", 2, {
  upgrade(db) {
    if (!db.objectStoreNames.contains("localDocuments")) {
      db.createObjectStore("localDocuments", { keyPath: "documentId" });
    }
  },
});

export const idb = {
  documents: dbPromise,
};