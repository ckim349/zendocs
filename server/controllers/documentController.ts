import { Request, Response, NextFunction } from "express"
import { fromUint8Array, toUint8Array } from "js-base64";
const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");
import * as Y from 'yjs'
const Document = require("../models/document");

// Handle document create on POST.
exports.document_create_post = [
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('errors :c')
      return;
    } else {
      const documentId = req.body.documentId;
      const title = req.body.title;
      const content = req.body.content;
      const currentDate = new Date().toISOString();

      const document = new Document({
        documentId: documentId,
        title: title,
        content: content,
        createdDate: currentDate,
        lastUpdatedDate: currentDate
      })

      await document.save();
      res.json({ success: true });
    }
  }),
];

// Handle document update on POST.
exports.document_update_post = [
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('errors :c')
      return;
    } else {
      // Finds the document we want to update and then applies and saves the update
      const docToUpdate = await Document.findOne({ documentId: req.body.documentId }).exec();
      if (!docToUpdate) {
        return res.status(404).json({ error: 'Document not found' });
      }

      const doc = new Y.Doc();

      // Only applies update of content from database doc if content not null
      if (req.body.content !== null) {
        const base64Update = req.body.content;
        const update = toUint8Array(base64Update)
        if (docToUpdate.content !== "AA==") {
          Y.applyUpdate(doc, toUint8Array(docToUpdate.content));
        }
        Y.applyUpdate(doc, update);
        docToUpdate.content = fromUint8Array(Y.encodeStateAsUpdate(doc))
      }

      if (req.body.title !== "" && req.body.title !== null) {
        docToUpdate.title = req.body.title;
      }

      docToUpdate.lastUpdatedDate = new Date().toISOString();
      await docToUpdate.save();

      res.json({ success: true });
    }
  }),
];

// Handle document load on GET.
exports.document_load_get = [
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('errors :c')
      return;
    } else {
      const docToFind = await Document.findOne({ documentId: req.params.id }).exec();
      if (!docToFind) {
        return res.status(404).json({ error: 'Document not found' });
      }

      // Only applies update of content from database doc if content not null
      const doc = new Y.Doc();
      if (docToFind.content !== "AA==") {
        Y.applyUpdate(doc, toUint8Array(docToFind.content));
      }

      res.send({ docToFind });
    }
  }),
];

// Handle document list on GET.
exports.document_list_get = [
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('errors :c');
      return;
    } else {
      const documents = await Document.find().sort({ lastUpdatedDate: -1 }).exec();
      res.send({ documents });
    }
  }),
];