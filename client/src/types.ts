export type AnnotationTrack = "layman" | "expert";

export interface Piece {
  _id: string;
  title: string;
  composer: string;
  year?: number | null;
  coverUrl?: string | null;
  performer?: string; // convenience field surfaced from the first recording
  recordings?: Recording[];
  scores?: Score[];
  savedByCurrentUser?: boolean;
}

export interface Score {
  id: string;
  pieceId: string;
  musicXmlUrl: string;
  measureCount: number;
}

export interface Recording {
  id: string;
  pieceId: string;
  performer: string;
  year?: number | null;
  provider: string;
  youtubeVideoId: string;
  providerUrl?: string;
  annotations?: Annotation[];
}

export interface SyncPoint {
  id: string;
  recordingId: string;
  scoreId: string;
  measureNumber: number;
  timestampSec: number;
}

export interface Annotation {
  _id: string;
  recordingId: string;
  measureRangeStart: number;
  measureRangeEnd: number;
  track: AnnotationTrack;
  text: string;
}

/** Response shape of GET /recordings/:id/annotation-at-time */
export interface AnnotationAtTimeResponse {
  measureNumber: number | null;
  annotation: Annotation | null;
}
