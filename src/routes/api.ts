import { Router, Request, Response } from "express";
import axios from "axios";
import cron from "node-cron";
import multer from "multer";
import { supabase } from "../app";
import sgMail from "@sendgrid/mail";

import { ExchangeRateResponse } from "./types";

const upload = multer();

const router = Router();

const getCurrencyRate = async (): Promise<number | null> => {
  try {
    const response = await axios.get<ExchangeRateResponse>(
      `${process.env.EXCHANGE_RATE_API_BASE_URL}/${process.env.EXCHANGE_RATE_API_KEY}/pair/USD/UAH`,
    );
    return response.data.conversion_rate;
  } catch (error) {
    console.error("Error fetching currency rate:", error);
    return null;
  }
};

const sendEmails = async (rate: number) => {
  const { data: subscribers, error } = await supabase
    .from("subscriptions")
    .select("email");

  if (error) {
    console.error("Error fetching subscribers:", error);
    return;
  }

  const msg = {
    from: "artemmeges@gmail.com",
    subject: "Daily Currency Rate",
    text: `The current currency rate from USD to UAH is ${rate}`,
  };

  for (const subscriber of subscribers) {
    try {
      await sgMail.send({ ...msg, to: subscriber.email });
    } catch (error) {
      console.error(error);
    }
  }
};

cron.schedule("0 8 * * *", async () => {
  const rate = await getCurrencyRate();
  if (rate !== null) {
    await sendEmails(rate);
  }
});

router.get("/rate", async (_, res: Response<number | { error: string }>) => {
  try {
    const rate = await getCurrencyRate();
    if (rate === null) {
      throw new Error("Failed to fetch currency rate");
    }
    res.json(rate);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch currency rate" });
  }
});

/*TODO: Test that it's email type*/
router.post(
  "/subscribe",
  upload.none(),
  async (req: Request<{ email: string }>, res) => {
    const email = req.body.email;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    try {
      const existingSubscription = await supabase
        .from("subscriptions")
        .select("email", email)
        .single();

      if (existingSubscription.data) {
        return res
          .status(409)
          .json({ message: existingSubscription.data.email });
      } else {
        await supabase.from("subscriptions").insert([{ email }]);

        return res.status(200).json({ message: "E-mail додано" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to subscribe" });
    }
  },
);

export default router;
