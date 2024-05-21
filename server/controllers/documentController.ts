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

      const document = new Document({
        documentId: documentId,
        title: title,
        content: content
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
      const base64Update = req.body.content;
      const update = toUint8Array(base64Update)

      // Finds the document we want to update and then applies and saves the update
      const docToUpdate = await Document.findOne({ documentId: req.body.documentId }).exec();

      const doc = new Y.Doc();
      // TODO not sure if we need to do a double update or if just the outer update is fine
      // Y.applyUpdate(doc, toUint8Array(docToUpdate.content));
      Y.applyUpdate(doc, update);

      // TODO currently broken
      // docToUpdate.content = fromUint8Array(Y.encodeStateAsUpdate(doc))
      // docToUpdate.save();

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
      // const docToFind = await Document.findOne({ documentId: "b34f778d-2f40-41a0-8cb4-7502999ca4b7" }).exec();
      const docToFind = await Document.findOne({ documentId: req.params.id }).exec();

      if (docToFind === null) {
        console.log('error finding document');
        return;
      }

      res.json({ docToFind });
    }
  }),
];