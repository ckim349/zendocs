const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const DocumentSchema = new Schema({
  documentId: { type: String },
  title: { type: String },
  content: { type: String },
  createdDate: { type: String },
  lastUpdatedDate: { type: String }
})

module.exports = mongoose.model("Document", DocumentSchema);