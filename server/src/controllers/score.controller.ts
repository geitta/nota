import type { Request, Response, NextFunction } from "express";
import { prisma } from "../config/prisma";
import { parseMusicXml } from "../services/musicxml.service";

// Multer augments Request with `file` at runtime; @types/multer supplies
// Express.Multer.File but doesn't merge it into Request by default without
// the express typings picking it up via its own global augmentation, so we
// type it explicitly here for clarity at the call site.
interface UploadRequest extends Request {
  file?: Express.Multer.File;
}

/**
 * Accepts a raw MusicXML upload (multipart field "file"), parses it,
 * and stores the score. Actual file storage (S3/disk) is left as a
 * TODO — `musicXmlUrl` currently stores wherever req.file ends up; wire
 * in real object storage before this leaves development.
 */
export async function uploadScore(req: UploadRequest, res: Response, next: NextFunction) {
  try {
    const { pieceId } = req.params;
    if (!req.file) {
      return res.status(400).json({ message: "No MusicXML file uploaded." });
    }

    const xml = req.file.buffer.toString("utf-8");
    const parsed = parseMusicXml(xml);

    const score = await prisma.score.create({
      data: {
        pieceId,
        musicXmlUrl: `TODO-store-and-link:${req.file.originalname}`,
        measureCount: parsed.measureCount,
      },
    });

    res.status(201).json({ score, parts: parsed.parts });
  } catch (err) {
    next(err);
  }
}

export async function getScore(req: Request, res: Response, next: NextFunction) {
  try {
    const score = await prisma.score.findFirst({
      where: { pieceId: req.params.pieceId },
      orderBy: { createdAt: "desc" },
    });
    if (!score) return res.status(404).json({ message: "No score uploaded for this piece yet." });
    res.json(score);
  } catch (err) {
    next(err);
  }
}
