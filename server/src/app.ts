import express from "express";
import morgan from "morgan";
import cors from "cors";
import { corsOptions } from "./config/cors";
import { stream } from "./config/logger";

const app = express();

app.use(cors(corsOptions));
app.use(morgan("combined", { stream }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("noted is live");
});

export default app;
