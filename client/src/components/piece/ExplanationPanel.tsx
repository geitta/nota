import { useMemo } from "react";
import { useLevel } from "../../context/LevelContext";
import type { Annotation } from "../../types";

interface ExplanationPanelProps {
  annotations?: Annotation[];
  currentTimeSec?: number;
}

/**
 * annotations: [{ timestampSec, text }] — text is either a plain string
 * (server already applied ?track=) or a { beginner, advanced, expert }
 * map. Both shapes are supported so this works before/after server-side
 * level filtering is wired up.
 */
export default function ExplanationPanel({
  annotations = [],
  currentTimeSec = 0,
}: ExplanationPanelProps) {
  const { level } = useLevel();

  const active = useMemo(() => {
    return [...annotations]
      .filter((a) => a.timestampSec <= currentTimeSec)
      .sort((a, b) => b.timestampSec - a.timestampSec)[0];
  }, [annotations, currentTimeSec]);

  const text = active
    ? typeof active.text === "string"
      ? active.text
      : active.text?.[level]
    : null;

  return (
    <div className="card-surface p-6 min-h-[140px]">
      <p className="font-display text-sm font-semibold text-tan uppercase tracking-wide mb-2">
        {active ? formatTime(active.timestampSec) : "Listening"}
      </p>
      <p className="font-body text-lg text-espresso leading-relaxed">
        {text || "Play the recording to see synchronized explanations here."}
      </p>
    </div>
  );
}

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}