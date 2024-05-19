import express from "express";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import sgMail from "@sendgrid/mail";

import { Database } from "./database.types";

const app = express();
const port = 3000;

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");

import apiRouter from "./routes/api";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", apiRouter);

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
export const supabase = createClient<Database>(
  supabaseUrl || "",
  supabaseKey || "",
);

app.listen(port, () => {
  console.log(`Express app listening at http://localhost:${port}`);
});
