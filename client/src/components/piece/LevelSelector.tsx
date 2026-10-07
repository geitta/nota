import { useNavigate } from "react-router-dom";
import { LEVELS, LEVEL_META, useLevel } from "../../context/LevelContext";

interface LevelSelectorProps {
  compact?: boolean;
  pieceId: string;
}

/**
 * Three tabs, but only the first two are the same kind of thing: Beginner
 * and Seasoned toggle the explanation depth in place. "Interpretations" is
 * a navigation tab — it leaves this page entirely for the recording
 * comparison view (pages/Compare.tsx), so it's rendered as a Link/button
 * that calls navigate() rather than setLevel().
 */
export default function LevelSelector({ compact = false, pieceId }: LevelSelectorProps) {
  const { level, setLevel } = useLevel();
  const navigate = useNavigate();

  const sizeClasses = compact ? "px-4 py-1.5" : "px-6 py-2.5";
  const textClass = compact ? "text-sm" : "text-base";

  return (
    <div
      role="tablist"
      aria-label="Piece view"
      className={`inline-flex rounded-pill bg-espresso/10 p-1 gap-1 ${textClass}`}
    >
      {Object.values(LEVELS).map((value) => {
        const active = value === level;
        return (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => setLevel(value)}
            className={[
              "font-display font-semibold rounded-pill transition",
              sizeClasses,
              active
                ? "bg-espresso text-white"
                : "text-espresso hover:bg-espresso/10",
            ].join(" ")}
          >
            {LEVEL_META[value].label}
          </button>
        );
      })}
      <button
        type="button"
        role="tab"
        aria-selected={false}
        onClick={() => navigate(`/pieces/${pieceId}/compare`)}
        className={[
          "font-display font-semibold rounded-pill transition text-espresso hover:bg-espresso/10",
          sizeClasses,
        ].join(" ")}
      >
        Interpretations
      </button>
    </div>
  );
}