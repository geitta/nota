import { prisma } from "../config/prisma";
import type { SyncPoint, Annotation, AnnotationTrack } from "@prisma/client";

/**
 * Given a recording's full sync-point list (sorted by timestampSec
 * ascending) and a current playback time, find the measure that's
 * active right now — the last sync point whose timestamp has already
 * passed.
 *
 * This runs client-side against a cached list in the real player loop;
 * it's exposed here too so the server can serve the same lookup for
 * server-rendered previews, tests, and the sync-point authoring tool.
 */
export function resolveMeasureAtTime(
  syncPoints: Pick<SyncPoint, "timestampSec" | "measureNumber">[],
  currentTimeSec: number
): number | null {
  let active: Pick<SyncPoint, "timestampSec" | "measureNumber"> | null = null;
  for (const point of syncPoints) {
    if (point.timestampSec <= currentTimeSec) {
      active = point;
    } else {
      break;
    }
  }
  return active?.measureNumber ?? null;
}

export function getSyncPoints(recordingId: string): Promise<SyncPoint[]> {
  return prisma.syncPoint.findMany({
    where: { recordingId },
    orderBy: { timestampSec: "asc" },
  });
}

export interface UpsertSyncPointInput {
  recordingId: string;
  scoreId: string;
  measureNumber: number;
  timestampSec: number;
}

/**
 * Human-in-the-loop authoring: create or correct a single anchor point.
 * Upserts on (recordingId, measureNumber) so re-anchoring a measure
 * doesn't create duplicates.
 */
export function upsertSyncPoint({
  recordingId,
  scoreId,
  measureNumber,
  timestampSec,
}: UpsertSyncPointInput): Promise<SyncPoint> {
  return prisma.syncPoint.upsert({
    where: {
      recordingId_measureNumber: { recordingId, measureNumber },
    },
    update: { timestampSec, scoreId },
    create: { recordingId, scoreId, measureNumber, timestampSec },
  });
}

/**
 * Look up the annotation covering a given measure, for a given track.
 * Measure ranges let one annotation cover several measures (e.g. a
 * four-bar phrase) without duplicating text per measure.
 */
export function getAnnotationForMeasure(
  recordingId: string,
  measureNumber: number,
  track: AnnotationTrack
): Promise<Annotation | null> {
  return prisma.annotation.findFirst({
    where: {
      recordingId,
      track,
      measureRangeStart: { lte: measureNumber },
      measureRangeEnd: { gte: measureNumber },
    },
  });
}
