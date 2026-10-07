import { Router } from "express";
import * as syncController from "../controllers/sync.controller";
import { requireAuth } from "@clerk/express";

const router = Router();

router.get("/:recordingId/sync-points", syncController.listSyncPoints);
router.post("/:recordingId/sync-points", requireAuth, syncController.createSyncPoint);

router.get("/:recordingId/annotation-at-time", syncController.getAnnotationAtTime);
router.post("/:recordingId/annotations", requireAuth, syncController.createAnnotation);

export default router;
