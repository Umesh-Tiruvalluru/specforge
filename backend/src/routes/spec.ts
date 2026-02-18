import { Router } from "express";
import {
  getSpecs,
  getSpec,
  patchSpec,
  removeSpec,
} from "../controllers/specController";
import { validate } from "../middleware/validate";
import {
  listSpecsQuerySchema,
  updateSpecBodySchema,
  specIdParamSchema,
} from "../validator/specSchema";

const router = Router();

router.get("/", validate(listSpecsQuerySchema, "query"), getSpecs);
router.get("/:id", validate(specIdParamSchema, "params"), getSpec);
router.patch(
  "/:id",
  validate(specIdParamSchema, "params"),
  validate(updateSpecBodySchema),
  patchSpec,
);
router.delete("/:id", validate(specIdParamSchema, "params"), removeSpec);

export default router;
