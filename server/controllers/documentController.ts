import { Request, Response, NextFunction } from "express"
import { toUint8Array } from "js-base64";
const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");


// Handle document update on POST.
exports.document_update_post = [
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('errors :c')
      return;
    } else {
      // const documentId = req.body.documentId;
      // const base64Update = req.body;
      // const update = toUint8Array(base64Update)

      // // console.log('Received document ID:', documentId);
      console.log(req.body)
      res.json({ success: true });
    }
  }),
];