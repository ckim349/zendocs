import express, { Request, Response } from "express";
import dotenv from "dotenv";
var path = require('path');
const router = express.Router();
const document_controller = require('./controllers/documentController');

// configures dotenv to work in your application
dotenv.config();
const app = express();

app.use(express.json());
app.use("/", router);

router.post("/api", document_controller.document_update_post);

app.get("/api", (req: Request, res: Response) => {
  res.json({ "users": ["userOne", "userTwo"] })
});

app.listen(5000, () => {
  console.log("Server running at PORT: 5000");
}).on("error", (error) => {
  // gracefully handle error
  throw new Error(error.message);
});