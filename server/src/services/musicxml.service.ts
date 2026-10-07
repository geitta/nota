import { XMLParser } from "fast-xml-parser";

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  isArray: (name) => ["part", "measure", "note"].includes(name),
});

export interface ParsedMeasure {
  number: number;
  timeSignature: string | null;
  keyFifths: number | null;
  noteCount: number;
}

export interface ParsedPart {
  id: string;
  name: string;
  measures: ParsedMeasure[];
}

export interface ParsedScore {
  measureCount: number;
  parts: ParsedPart[];
}

/**
 * Parses a MusicXML document (score-partwise) into a flat, per-measure
 * structure the rest of the system can key annotations and sync points
 * against. This intentionally does NOT try to fully model pitch/rhythm —
 * Nota only needs measure boundaries and enough metadata (time/key
 * signature changes) to make the score viewer and the sync-point editor
 * useful.
 */
export function parseMusicXml(xml: string): ParsedScore {
  const doc = parser.parse(xml);
  const scorePartwise = doc["score-partwise"];
  if (!scorePartwise) {
    throw new Error(
      "Unsupported MusicXML: expected a <score-partwise> root element."
    );
  }

  const partList: { id: string; name: string }[] = toArray(
    scorePartwise["part-list"]?.["score-part"]
  ).map((p: RawScorePart) => ({
    id: p["@_id"],
    name: p["part-name"] ?? p["@_id"],
  }));

  const parts: ParsedPart[] = toArray(scorePartwise.part).map((part: RawPart) => {
    const partId = part["@_id"];
    const measures = toArray(part.measure).map((measure: RawMeasure) =>
      parseMeasure(measure)
    );
    return {
      id: partId,
      name: partList.find((p) => p.id === partId)?.name ?? partId,
      measures,
    };
  });

  const measureCount = parts[0]?.measures.length ?? 0;

  return { measureCount, parts };
}

function parseMeasure(measure: RawMeasure): ParsedMeasure {
  const attributes = measure.attributes;
  const timeSignature = attributes?.time
    ? `${attributes.time.beats}/${attributes.time["beat-type"]}`
    : null;
  const keyFifths = attributes?.key?.fifths ?? null;

  return {
    number: Number(measure["@_number"]),
    timeSignature,
    keyFifths,
    noteCount: toArray(measure.note).length,
  };
}

function toArray<T>(value: T | T[] | undefined | null): T[] {
  if (value === undefined || value === null) return [];
  return Array.isArray(value) ? value : [value];
}

// Minimal shapes for the raw, loosely-typed fast-xml-parser output —
// intentionally not exhaustive, only the fields Nota actually reads.
interface RawScorePart {
  "@_id": string;
  "part-name"?: string;
}

interface RawMeasure {
  "@_number": string;
  attributes?: {
    time?: { beats: number; "beat-type": number };
    key?: { fifths: number };
  };
  note?: unknown[];
}

interface RawPart {
  "@_id": string;
  measure?: RawMeasure[];
}
