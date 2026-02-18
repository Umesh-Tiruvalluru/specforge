import express from "express";
import cors from "cors";
import generateRoutes from "./routes/generate";
import specRoutes from "./routes/spec";
import statusRoutes from "./routes/status";
import { errorHandler } from "./middleware/errorHandler";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/generate", generateRoutes);
app.use("/api/specs", specRoutes); // renamed: /api/spec → /api/specs
app.use("/api/status", statusRoutes);

app.use((_req, res) =>
  res.status(404).json({ success: false, error: "Route not found" }),
);
app.use(errorHandler);

export default app;
