import { Router, Request, Response } from "express";
import axios from "axios";
import multer from "multer";
import { supabase } from "../app";
const upload = multer();

const router = Router();

router.get("/rate", async (_, res: Response<number | { error: string }>) => {
  try {
    const response = await axios.get<{ conversion_rate: number }>(
      `${process.env.EXCHANGE_RATE_API_BASE_URL}/${process.env.EXCHANGE_RATE_API_KEY}/pair/USD/UAH`,
    );
    /*TODO: types?*/
    res.json(response.data.conversion_rate);
  } catch (error) {
    /*TODO: better handling?*/
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
        .select("value", email)
        .single();

      if (existingSubscription.data) {
        return res
          .status(409)
          .json({ message: existingSubscription.data.value });
      } else {
        /*TODO: error*/
        const { error } = await supabase
          .from("subscriptions")
          .insert([{ value: email }]);

        return res.status(200).json({ message: "E-mail додано" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to subscribe" });
    }
  },
);

export default router;
