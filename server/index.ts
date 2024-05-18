import express, { Request, Response } from "express";
import dotenv from "dotenv";
var path = require('path');

// configures dotenv to work in your application
dotenv.config();
const app = express();

// const PORT = process.env.PORT;

app.get("/api", (req: Request, res: Response) => {
  res.json({ "users": ["userOne", "userTwo"] })
});

app.listen(5000, () => {
  console.log("Server running at PORT: 5000");
}).on("error", (error) => {
  // gracefully handle error
  throw new Error(error.message);
});