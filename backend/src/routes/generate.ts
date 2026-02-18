import { Router } from "express";
import { generateSpec } from "../controllers/specController";
import { validate } from "../middleware/validate";
import { specGenerateRequestSchema } from "../validator/generateSchema";

const router = Router();
router.post("/", validate(specGenerateRequestSchema), generateSpec);
export default router;
