import { Request, Response, NextFunction } from "express"
import { toUint8Array } from "js-base64";
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
      console.log('bro das save');

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
      // const documentId = req.body.documentId;
      const base64Update = req.body.content;
      const update = toUint8Array(base64Update)
      console.log(update);


      // FIND THE DOCUMENT WITH THE RIGHT ID FROM DATABASE
      // GET THAT DOCUMENT AND APPLY UPDATE

      // const doc = new Y.Doc();
      // Y.applyUpdate(doc, update);

      res.json({ success: true });
    }
  }),
];