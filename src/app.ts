import express from "express";
const app = express();
const port = 3000;
import dotenv from "dotenv";

dotenv.config();

import apiRouter from "./routes/api";

app.use(express.json());

app.use("/api", apiRouter);

app.listen(port, () => {
  console.log(`Express app listening at http://localhost:${port}`);
});
