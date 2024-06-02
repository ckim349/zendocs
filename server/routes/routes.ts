const express = require("express");
const router = express.Router();

const document_controller = require('../controllers/documentController');

router.post("/document/create", document_controller.document_create_post);
router.post("/document/delete/:id", document_controller.document_delete_post);
router.post("/document/update", document_controller.document_update_post);
router.get("/document/load/:id", document_controller.document_load_get);
router.get("/document_list", document_controller.document_list_get);

module.exports = router;
