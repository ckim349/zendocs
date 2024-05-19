const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const DocumentSchema = new Schema({
  documentId: { type: String },
  content: { type: Uint8Array }
})

module.exports = mongoose.model("Document", DocumentSchema);