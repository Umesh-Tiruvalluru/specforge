import { Router } from "express";
import mongoose, { connection } from "mongoose";

const router = Router();

router.get("/", async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        status: "unhealthy",
        database: "disconnected",
      });
    }

    res.status(200).json({
      status: "healthy",
      database: "connected",
      uptime: process.uptime(),
    });
  } catch (error) {
    res.status(503).json({
      status: "unhealthy",
    });
  }
});

export default router;
