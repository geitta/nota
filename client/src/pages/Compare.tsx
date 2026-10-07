import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import { getPiece, toggleSave } from "../services/pieces.service";
import type { Piece, Recording } from "../types";

/**
 * Uses the piece's own `recordings` array (already returned by getPiece)
 * rather than a dedicated /compare endpoint — the build spec proposed
 * `GET /pieces/:id/compare?recordings=idA,idB` for this, but that route
 * was never built, and there's no real recommendation algorithm behind it
 * yet either. This picks the first two recordings and labels the first as
 * "recommended" as a placeholder, not an actual computed result.
 */
export default function Compare() {
  const { id } = useParams<{ id: string }>();
  const [piece, setPiece] = useState<Piece | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!id) return;
    getPiece(id).then((data) => {
      setPiece(data);
      setSaved(Boolean(data.savedByCurrentUser));
    });
  }, [id]);

  async function handleSave() {
    if (!id) return;
    await toggleSave(id, saved);
    setSaved((s) => !s);
  }

  if (!piece || !id) {
    return (
      <div className="min-h-screen bg-cream">
        <Navbar />
        <p className="font-body text-espresso px-8">Loading…</p>
      </div>
    );
  }

  const recordings = piece.recordings ?? [];
  const [first, second] = recordings;
  const recommended = first;

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <main className="px-8 pb-16 max-w-[1100px] mx-auto">
        <div className="flex items-center justify-between gap-6 mt-4 mb-2">
          <div>
            <h1 className="font-display font-bold text-3xl text-espresso">
              {piece.title}
            </h1>
            <p className="font-body text-espresso/70 mt-1">Interpretations</p>
          </div>
          <Link
            to={`/pieces/${id}`}
            className="font-display font-semibold text-tan"
          >
            ← Back to listening view
          </Link>
        </div>

        {recordings.length < 2 ? (
          <p className="font-body text-espresso/70 mt-8">
            This piece needs at least two recordings before they can be compared —
            only {recordings.length} {recordings.length === 1 ? "is" : "are"}{" "}
            available right now.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6 mb-6">
              <RecordingPanel label="Recording 1" recording={first} />
              <RecordingPanel label="Recording 2" recording={second} />
            </div>

            <h2 className="font-display font-semibold text-xl text-espresso mb-3">
              Explanations
            </h2>
            <div className="card-surface p-6 mb-6 min-h-[100px]">
              <p className="font-body text-espresso/60">
                Side-by-side synchronized explanations aren't wired up yet — this
                needs both players' timestamps resolved through the sync engine
                at once, which the single-recording listening view doesn't do.
              </p>
            </div>

            {recommended && (
              <>
                <h2 className="font-display font-semibold text-xl text-espresso mb-3">
                  Recommended recording
                </h2>
                <div className="rounded-[12px] bg-tan p-4 flex items-center justify-between mb-6">
                  <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 font-display font-medium text-white">
                    <dt>Title:</dt>
                    <dd>{piece.title}</dd>
                    <dt>Composer:</dt>
                    <dd>{piece.composer}</dd>
                    <dt>Year:</dt>
                    <dd>{piece.year}</dd>
                    <dt>Performer:</dt>
                    <dd>{recommended.performer}</dd>
                  </dl>
                  <button
                    onClick={handleSave}
                    className="font-display font-semibold rounded-pill px-6 py-2.5 border-2 border-white text-white hover:bg-white hover:text-espresso transition shrink-0"
                  >
                    {saved ? "Saved" : "Save"}
                  </button>
                </div>
              </>
            )}

            <section>
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
          </>
        )}
      </main>
    </div>
  );
}

function RecordingPanel({ label, recording }: { label: string; recording: Recording }) {
  return (
    <div>
      <p className="font-display font-semibold text-espresso mb-2">
        {label} · {recording.performer}
      </p>
      <div className="rounded-[12px] overflow-hidden bg-black aspect-video">
        <iframe
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${recording.youtubeVideoId}`}
          title={`${label} — ${recording.performer}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}