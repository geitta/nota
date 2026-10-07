import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import LevelSelector from "../components/piece/LevelSelector";
import ExplanationPanel from "../components/piece/ExplanationPanel";
import { useYouTubePlayer } from "../hooks/useYouTubePlayer.tsx";
import { useLevel, trackForLevel } from "../context/LevelContext";
import { getPiece, toggleSave, getAnnotationAtTime } from "../services/pieces.service";
import type { Piece, Recording } from "../types";

export default function PieceDetail() {
  const { id } = useParams<{ id: string }>();
  const { level } = useLevel();
  const [piece, setPiece] = useState<Piece | null>(null);
  const [recording, setRecording] = useState<Recording | null>(null);
  const [saved, setSaved] = useState(false);

  const [explanationText, setExplanationText] = useState<string | null>(null);
  const [explanationLoading, setExplanationLoading] = useState(false);

  const { containerRef, currentTimeSec, isReady } = useYouTubePlayer(
    recording?.youtubeVideoId
  );

  useEffect(() => {
    if (!id) return;
    getPiece(id).then((data) => {
      setPiece(data);
      setSaved(Boolean(data.savedByCurrentUser));
      setRecording(data.recordings?.[0] || null);
    });
  }, [id]);

  // The actual sync-engine call. currentTimeSec comes from the real
  // YouTube player now (see useYouTubePlayer), not a fake clock — this
  // resolves that timestamp to a measure and its explanation server-side.
  // It re-fetches every 1s tick (matching the poll rate), not only on
  // measure changes — knowing whether the measure actually changed would
  // require duplicating the server's resolveMeasureAtTime logic client-side,
  // which isn't worth it for a lightweight indexed query.
  useEffect(() => {
    if (!recording) return;
    const track = trackForLevel(level);
    const roundedTime = Math.floor(currentTimeSec);

    setExplanationLoading(true);
    getAnnotationAtTime(recording.id, roundedTime, track)
      .then(({ annotation }) => {
        setExplanationText(annotation?.text ?? null);
      })
      .catch(() => setExplanationText(null))
      .finally(() => setExplanationLoading(false));
  }, [recording, level, Math.floor(currentTimeSec)]);

  async function handleSave() {
    if (!id) return;
    await toggleSave(id, saved);
    setSaved((s) => !s);
  }

  if (!piece || !id) {
    return (
      <div className="min-h-screen bg-cream">
        <Navbar />
        <p className="font-body text-espresso px-8">Loading piece…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <main className="px-8 pb-16 max-w-[1100px] mx-auto">
        <div className="flex items-center justify-between gap-6 mt-4 mb-4">
          <div>
            <h1 className="font-display font-bold text-3xl text-espresso">
              {piece.title}
            </h1>
            <p className="font-body text-espresso/70 mt-1">
              {piece.composer} · {piece.year}
              {recording && ` · ${recording.performer}`}
            </p>
          </div>
          <LevelSelector pieceId={id} />
        </div>

        <div className="rounded-[12px] overflow-hidden bg-black aspect-video mb-6">
          {recording ? (
            <div ref={containerRef} className="w-full h-full" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/60 font-body">
              No recording available for this piece yet.
            </div>
          )}
          {recording && !isReady && (
            <p className="text-white/50 font-body text-sm px-2">Loading player…</p>
          )}
        </div>

        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display font-semibold text-xl text-espresso">
            Explanations
          </h2>
          <button
            onClick={handleSave}
            className="font-display font-semibold rounded-pill px-6 py-2.5 border-2 border-espresso text-espresso hover:bg-espresso hover:text-white transition shrink-0"
          >
            {saved ? "Saved" : "Save"}
          </button>
        </div>

        <ExplanationPanel text={explanationText} loading={explanationLoading} />

        {/* Comments has a schema and is planned (see server's Comment model)
            but has no API routes yet — intentionally lowest priority per
            the project's own scope ordering. This is UI only for now. */}
        <section className="mt-10">
          <h2 className="font-display font-semibold text-xl text-espresso mb-3">
            Comments
          </h2>
          <div className="card-surface p-4">
            <input
              type="text"
              disabled
              placeholder="Add a comment (coming soon)"
              className="w-full bg-transparent outline-none font-body text-espresso/60 placeholder:text-espresso/40"
            />
          </div>
        </section>
      </main>
    </div>
  );
}