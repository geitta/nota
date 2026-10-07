import { Router } from "express";
import * as pieceController from "../controllers/piece.controller";
import { requireAuth } from "@clerk/express";

const router = Router();

router.get("/", pieceController.listPieces);
router.get("/search", pieceController.searchPieces);
router.get("/saved", requireAuth, pieceController.listSavedPieces);
router.get("/:id", pieceController.getPiece);
router.post("/:id/save", requireAuth, pieceController.savePiece);
router.delete("/:id/save", requireAuth, pieceController.unsavePiece);

export default router;
