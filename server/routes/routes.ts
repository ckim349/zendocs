const express = require("express");
const router = express.Router();

const document_controller = require('../controllers/documentController');

router.post("/document/create", document_controller.document_create_post);
router.post("/document/update", document_controller.document_update_post);
router.get("/document/load/:id", document_controller.document_load_get);

module.exports = router;
