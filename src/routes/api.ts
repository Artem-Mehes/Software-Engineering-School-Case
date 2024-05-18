import { Router, Request, Response } from "express";

const router = Router();

router.get("/rate", (req: Request, res: Response) => {
  res.send("Get rate");
});

router.get("/subscribe", (req: Request, res: Response) => {
  res.send("Subscribe");
});

export default router;
