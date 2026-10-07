import type { Request, Response, NextFunction } from "express";
import type { AnnotationTrack } from "@prisma/client";
import * as syncEngine from "../services/syncEngine.service";
import { prisma } from "../config/prisma";

export async function listSyncPoints(req: Request, res: Response, next: NextFunction) {
  try {
    const points = await syncEngine.getSyncPoints(req.params.recordingId);
    res.json(points);
  } catch (err) {
    next(err);
  }
}

// Human-in-the-loop authoring — an analyst anchoring/correcting one measure.
export async function createSyncPoint(req: Request, res: Response, next: NextFunction) {
  try {
    const { recordingId } = req.params;
    const { scoreId, measureNumber, timestampSec } = req.body as {
      scoreId?: string;
      measureNumber?: number;
      timestampSec?: number;
    };

    if (!scoreId || measureNumber == null || timestampSec == null) {
      return res
        .status(400)
        .json({ message: "scoreId, measureNumber, and timestampSec are required." });
    }

    const point = await syncEngine.upsertSyncPoint({
      recordingId,
      scoreId,
      measureNumber,
      timestampSec,
    });
    res.status(201).json(point);
  } catch (err) {
    next(err);
  }
}

// Playback-time lookup: given where we are in the video, what measure and
// which track, return the matching annotation.
export async function getAnnotationAtTime(req: Request, res: Response, next: NextFunction) {
  try {
    const { recordingId } = req.params;
    const currentTimeSec = Number(req.query.t);
    const track: AnnotationTrack = req.query.track === "expert" ? "expert" : "layman";

    if (Number.isNaN(currentTimeSec)) {
      return res.status(400).json({ message: "Query param t (seconds) is required." });
    }

    const syncPoints = await syncEngine.getSyncPoints(recordingId);
    const measureNumber = syncEngine.resolveMeasureAtTime(syncPoints, currentTimeSec);
    if (measureNumber == null) {
      return res.json({ measureNumber: null, annotation: null });
    }

    const annotation = await syncEngine.getAnnotationForMeasure(
      recordingId,
      measureNumber,
      track
    );
    res.json({ measureNumber, annotation });
  } catch (err) {
    next(err);
  }
}

export async function createAnnotation(req: Request, res: Response, next: NextFunction) {
  try {
    const { recordingId } = req.params;
    const { measureRangeStart, measureRangeEnd, track, text } = req.body as {
      measureRangeStart?: number;
      measureRangeEnd?: number;
      track?: AnnotationTrack;
      text?: string;
    };

    if (measureRangeStart == null || measureRangeEnd == null || !track || !text) {
      return res.status(400).json({
        message: "measureRangeStart, measureRangeEnd, track, and text are required.",
      });
    }

    const annotation = await prisma.annotation.create({
      data: { recordingId, measureRangeStart, measureRangeEnd, track, text },
    });
    res.status(201).json(annotation);
  } catch (err) {
    next(err);
  }
}
