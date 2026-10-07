import type { Request, Response, NextFunction } from "express";
import { getAuth } from "@clerk/express";
import { prisma } from "../config/prisma";

export async function listPieces(_req: Request, res: Response, next: NextFunction) {
  try {
    const pieces = await prisma.piece.findMany({
      orderBy: { createdAt: "desc" },
      include: { recordings: { take: 1 } },
    });
    res.json(pieces);
  } catch (err) {
    next(err);
  }
}

export async function listSavedPieces(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ message: "Not authenticated." });

    const saved = await prisma.savedItem.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: { piece: { include: { recordings: { take: 1 } } } },
    });

    res.json(saved.map((s) => s.piece));
  } catch (err) {
    next(err);
  }
}

export async function searchPieces(req: Request, res: Response, next: NextFunction) {
  try {
    const q = String(req.query.q ?? "").trim();
    if (!q) return res.json([]);

    const pieces = await prisma.piece.findMany({
      where: {
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { composer: { contains: q, mode: "insensitive" } },
        ],
      },
      include: { recordings: { take: 1 } },
    });
    res.json(pieces);
  } catch (err) {
    next(err);
  }
}

export async function getPiece(req: Request, res: Response, next: NextFunction) {
  try {
    const piece = await prisma.piece.findUnique({
      where: { id: req.params.id },
      include: { recordings: true, scores: true },
    });
    if (!piece) return res.status(404).json({ message: "Piece not found." });

    // This route isn't behind requireAuth (a signed-out visitor can view a
    // piece), so getAuth() may return no userId — that's expected, not an error.
    const { userId } = getAuth(req);
    let savedByCurrentUser = false;
    if (userId) {
      const saved = await prisma.savedItem.findUnique({
        where: { userId_pieceId: { userId, pieceId: piece.id } },
      });
      savedByCurrentUser = Boolean(saved);
    }

    res.json({ ...piece, savedByCurrentUser });
  } catch (err) {
    next(err);
  }
}

export async function savePiece(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ message: "Not authenticated." });

    // Clerk owns identity; Prisma's User row is just a local FK anchor for
    // SavedItem/Comment, so ensure it exists on first write rather than
    // requiring a separate sync step or webhook before this can succeed.
    await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: { id: userId },
    });

    await prisma.savedItem.upsert({
      where: { userId_pieceId: { userId, pieceId: req.params.id } },
      update: {},
      create: { userId, pieceId: req.params.id },
    });
    res.status(201).json({ saved: true });
  } catch (err) {
    next(err);
  }
}

export async function unsavePiece(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ message: "Not authenticated." });

    await prisma.savedItem
      .delete({
        where: { userId_pieceId: { userId, pieceId: req.params.id } },
      })
      .catch(() => null); // idempotent — deleting an already-absent save is not an error
    res.json({ saved: false });
  } catch (err) {
    next(err);
  }
}
