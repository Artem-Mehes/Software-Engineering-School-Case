import express from "express";
const app = express();
const port = 3000;
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { Database } from "../database.types";

dotenv.config();

import apiRouter from "./routes/api";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", apiRouter);

const supabaseUrl = "https://abwaahqyxlhvfgykvduw.supabase.co";
const supabaseKey = process.env.SUPABASE_KEY;
export const supabase = createClient<Database>(supabaseUrl, supabaseKey!);

app.listen(port, () => {
  console.log(`Express app listening at http://localhost:${port}`);
});
