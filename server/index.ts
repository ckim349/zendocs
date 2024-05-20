import express, { Request, Response } from "express";
import dotenv from "dotenv";
var path = require('path');
const Router = require("./routes/routes");
const cors = require('cors');

// configures dotenv to work in your application
dotenv.config();
const app = express();

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const mongoDB = process.env.MONGOURL;

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

app.use(cors());
app.use(express.json());
app.use("/", Router);

app.get("/api", (req: Request, res: Response) => {
  res.json({ "users": ["userOne", "userTwo"] })
});

app.listen(5000, () => {
  console.log("Server running at PORT: 5000");
}).on("error", (error) => {
  // gracefully handle error
  throw new Error(error.message);
});