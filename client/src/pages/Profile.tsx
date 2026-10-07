import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import Navbar from "../components/layout/Navbar";
import PieceCard from "../components/piece/PieceCard";
import { getSavedPieces } from "../services/pieces.service";
import type { Piece } from "../types";

export default function Profile() {
  const { user } = useUser();
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSavedPieces()
      .then((data) => setPieces(Array.isArray(data) ? data : []))
      .catch(() => setPieces([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-brown">
      <Navbar />
      <main className="px-8 pb-16 max-w-[1100px] mx-auto">
        <h1 className="font-display font-medium text-2xl text-white mt-6 mb-8">
          Hello {user?.firstName ?? "there"}, here are your saved pieces
        </h1>

        {loading && <p className="text-white font-body">Loading…</p>}
        {!loading && pieces.length === 0 && (
          <p className="text-white font-body">
            Nothing saved yet — hit Save on a piece to see it here.
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