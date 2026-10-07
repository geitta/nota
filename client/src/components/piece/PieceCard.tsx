import { Link } from "react-router-dom";
import type { Piece } from "../../types";

interface PieceCardProps {
  piece: Piece;
}

export default function PieceCard({ piece }: PieceCardProps) {
  const { _id, title, composer, year, performer, coverUrl } = piece;

  return (
    <Link
      to={`/pieces/${_id}`}
      className="flex rounded-[12px] overflow-hidden bg-tan hover:opacity-95 transition"
    >
      <div className="w-[240px] shrink-0 bg-espresso flex items-end p-4 relative">
        {coverUrl ? (
          <img src={coverUrl} alt="" className="h-full w-full object-cover absolute inset-0" />
        ) : (
          <span className="font-display text-white text-sm relative z-10">
            Cover art
          </span>
        )}
      </div>
      <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 p-6 font-display font-medium text-white text-lg">
        <dt>Title:</dt>
        <dd>{title}</dd>
        <dt>Composer:</dt>
        <dd>{composer}</dd>
        <dt>Year:</dt>
        <dd>{year}</dd>
        <dt>Performer:</dt>
        <dd>{performer}</dd>
      </dl>
    </Link>
  );
}