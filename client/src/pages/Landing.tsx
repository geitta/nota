import { Link } from "react-router-dom";
import Logo from "../components/layout/Logo";
import { LEVELS, LEVEL_META } from "../context/LevelContext";

export default function Landing() {
  return (
    <div className="min-h-screen bg-brown">
      <header className="flex flex-wrap items-center justify-between gap-4 px-4 sm:px-8 py-4 sm:py-6">
        <Logo />
        <nav className="flex gap-3 sm:gap-4">
          <Link to="/signup" className="btn-solid !py-2.5 !px-4 sm:!py-3 sm:!px-6 !text-sm sm:!text-base">
            Sign up
          </Link>
          <Link to="/login" className="btn-solid !py-2.5 !px-4 sm:!py-3 sm:!px-6 !text-sm sm:!text-base">
            Login
          </Link>
        </nav>
      </header>

      <main className="px-4 sm:px-8 pb-16 sm:pb-24 max-w-[1512px] mx-auto">
        <section className="relative overflow-hidden rounded-card grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center p-6 sm:p-10 lg:p-16">
          <div
            className="absolute inset-0 opacity-40 bg-repeat"
            style={{ backgroundImage: "url(/assets/many-notes.jpg)" }}
            aria-hidden="true"
          />
          {/* Figma: rgba(192,133,82,0.2) — a faint tan tint over the pattern,
              not a solid section background. */}
          <div className="absolute inset-0 bg-tan/20" aria-hidden="true" />
          <img
            src="/assets/bass-cleff.png"
            alt=""
            className="relative opacity-70 w-40 sm:w-56 lg:max-w-md lg:w-auto justify-self-center lg:justify-self-start"
          />
          <div className="relative">
            <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-6xl leading-tight text-black break-words">
              Making classical music more accessible :)
            </h1>
            <p className="font-display font-bold text-base sm:text-lg lg:text-2xl mt-4 lg:mt-6 text-black">
              Made for both beginners and more seasoned listeners
            </p>
            <Link to="/signup" className="btn-solid inline-block mt-6 lg:mt-8">
              Get started
            </Link>
          </div>
        </section>

        <section className="mt-10 sm:mt-16 text-white font-display font-semibold text-base sm:text-xl lg:text-2xl leading-relaxed max-w-4xl">
          <p>
            <em className="italic">Nota</em> — your essential platform for music
            comprehension
          </p>
          <p className="mt-4 sm:mt-6">
            <em className="italic">Nota</em> is a platform to help people get into
            classical music, or help foster further appreciation for seasoned
            listeners. Synchronized explanations of a piece are explained to you
            while you listen. We also compare different interpretations and
            recommend a recording for each piece we analyze.
          </p>
        </section>

        {/* This replaces the Figma placeholder:
            "Carousel for images of beginner, seasoned and interpretations screens" */}
        <section className="mt-10 sm:mt-16 border-4 border-espresso rounded-card bg-brown p-4 sm:p-10">
          <h2 className="sr-only">See Nota at every level</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8">
            {Object.values(LEVELS).map((value) => (
              <PreviewCard
                key={value}
                label={LEVEL_META[value].label}
                tagline={LEVEL_META[value].tagline}
              />
            ))}
            {/* Not a Level — Interpretations is the recording-comparison
                mode (see pages/Compare.tsx), a separate tab from the two
                explanation depths above, not a third depth itself. */}
            <PreviewCard
              label="Interpretations"
              tagline="Compare recordings side by side."
            />
          </div>
        </section>

        <div className="flex justify-center mt-10 sm:mt-16">
          <Link to="/signup" className="btn-solid">
            Get started
          </Link>
        </div>
      </main>
    </div>
  );
}

function PreviewCard({ label, tagline }: { label: string; tagline: string }) {
  return (
    <div className="card-surface p-6 flex flex-col gap-3">
      <span className="font-display font-semibold text-tan uppercase text-sm tracking-wide">
        {label}
      </span>
      <p className="font-body text-espresso">{tagline}</p>
      <div className="mt-2 h-32 rounded-card bg-tan/30 flex items-center justify-center text-espresso/50 font-body text-sm">
        Screen preview
      </div>
    </div>
  );
}