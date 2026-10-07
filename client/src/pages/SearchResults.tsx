import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import PieceCard from "../components/piece/PieceCard";
import { searchPieces } from "../services/pieces.service";
import type { Piece } from "../types";

export default function SearchResults() {
  const [params] = useSearchParams();
  const q = params.get("q") || "";
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    searchPieces(q)
      .then((data) => setPieces(Array.isArray(data) ? data : []))
      .catch(() => setPieces([]))
      .finally(() => setLoading(false));
  }, [q]);

  return (
    <div className="min-h-screen bg-cream">
      <Navbar initialQuery={q} />
      <main className="px-8 pb-16 max-w-[1100px] mx-auto">
        <p className="font-display text-2xl text-espresso mt-4 mb-8">
          {q ? (
            <>
              Results for <span className="font-semibold">"{q}"</span>
            </>
          ) : (
            "Search for a piece, composer, or performer"
          )}
        </p>

        {loading && <p className="font-body text-espresso">Searching…</p>}
        {!loading && pieces.length === 0 && q && (
          <p className="font-body text-espresso">
            No pieces matched "{q}" — try a different composer or title.
          </p>
        )}

        <div className="flex flex-col gap-6">
          {pieces.map((piece) => (
            <PieceCard key={piece._id} piece={piece} />
          ))}
        </div>
      </main>
    </div>
  );
}