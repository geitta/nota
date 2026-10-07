import { Router } from "express";
import multer from "multer";
import * as scoreController from "../controllers/score.controller";
import { requireAuth } from "@clerk/express";

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

router.get("/:pieceId", scoreController.getScore);
router.post(
  "/:pieceId/upload",
  requireAuth,
  upload.single("file"),
  scoreController.uploadScore
);

export default router;
