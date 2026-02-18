import { Router } from "express";

const router = Router();

router.get("/", async (req, res) => {
  try {
    res.json({ status: "OK" });
  } catch (error) {
    console.error("Error in /api/status:", error);
    return res
      .status(500)
      .json({ status: "ERROR", message: "Internal Server Error" });
  }
});

export default router;
