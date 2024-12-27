import "dotenv/config";
import express from "express";

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello, TypeScript with Node.js and Express!");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
