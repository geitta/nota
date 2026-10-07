import { api } from "./api";
import type { AnnotationAtTimeResponse, Piece } from "../types";
import type { AnnotationTrack } from "../types";

export const getPieces = (): Promise<Piece[]> =>
  api.get<Piece[]>("/pieces").then((r) => r.data);

export const getSavedPieces = (): Promise<Piece[]> =>
  api.get<Piece[]>("/pieces/saved").then((r) => r.data);

export const searchPieces = (q: string): Promise<Piece[]> =>
  api.get<Piece[]>("/pieces/search", { params: { q } }).then((r) => r.data);

export const getPiece = (id: string): Promise<Piece> =>
  api.get<Piece>(`/pieces/${id}`).then((r) => r.data);

/**
 * The actual sync-engine call: given a live playback timestamp, the
 * server resolves which measure that corresponds to (via the recording's
 * SyncPoints) and returns whichever annotation covers that measure for
 * the requested track. This is what PieceDetail's player loop calls on
 * every tick where the timestamp has moved into a new measure.
 */
export const getAnnotationAtTime = (
  recordingId: string,
  timestampSec: number,
  track: AnnotationTrack
): Promise<AnnotationAtTimeResponse> =>
  api
    .get<AnnotationAtTimeResponse>(`/recordings/${recordingId}/annotation-at-time`, {
      params: { t: timestampSec, track },
    })
    .then((r) => r.data);

export const toggleSave = (pieceId: string, saved: boolean): Promise<void> =>
  saved
    ? api.delete(`/pieces/${pieceId}/save`).then(() => undefined)
    : api.post(`/pieces/${pieceId}/save`).then(() => undefined);

export const getRecommendation = (pieceId: string) =>
  api.get(`/pieces/${pieceId}/recommendation`).then((r) => r.data);
