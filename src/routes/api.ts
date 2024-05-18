import { Router, Request, Response } from "express";
import axios from "axios";

const router = Router();

router.get("/rate", async (_, res) => {
  try {
    const response = await axios.get(
      `${process.env.EXCHANGE_RATE_API_BASE_URL}/${process.env.EXCHANGE_RATE_API_KEY}/pair/USD/UAH`,
    );
    res.json(response.data.conversion_rate);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch currency rate" });
  }
});

router.get("/subscribe", (req: Request, res: Response) => {
  res.send("Subscribe");
});

export default router;
