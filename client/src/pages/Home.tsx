import { useEffect, useState } from "react";
import Navbar from "../components/layout/Navbar";
import PieceCard from "../components/piece/PieceCard";
import { getPieces } from "../services/pieces.service";
import type { Piece } from "../types";

export default function Home() {
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPieces()
      .then((data) => setPieces(Array.isArray(data) ? data : []))
      .catch(() => setPieces([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen relative">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/assets/cello.jpg)" }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-black/[0.27]" aria-hidden="true" />

      <div className="relative z-10">
        <Navbar />
        <main className="px-8 pb-16 max-w-[1100px] mx-auto">
          <h1 className="font-display font-medium text-3xl text-white mt-6 mb-8">
            Welcome, here is what we have done so far
          </h1>

          {loading && <p className="text-white font-body">Loading pieces…</p>}
          {!loading && pieces.length === 0 && (
            <p className="text-white font-body">
              No pieces yet — check back soon, or try a search.
            </p>
          )}

          <div className="flex flex-col gap-6">
            {pieces.map((piece) => (
              <PieceCard key={piece._id} piece={piece} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}