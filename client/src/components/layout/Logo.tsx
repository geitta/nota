import { Link } from "react-router-dom";

interface LogoProps {
  to?: string;
}

export default function Logo({ to = "/" }: LogoProps) {
  return (
    <Link to={to} className="flex items-center gap-3 shrink-0">
      <img
        src="/assets/logo.png"
        alt=""
        className="h-10 w-auto -rotate-[2deg]"
      />
      <span className="font-display italic font-bold text-3xl text-espresso">
        Nota
      </span>
    </Link>
  );
}