import { useNavigate } from "react-router-dom";
import { useState, type FormEvent } from "react";
import { UserButton } from "@clerk/clerk-react";
import Logo from "./Logo";

interface NavbarProps {
  initialQuery?: string;
}

export default function Navbar({ initialQuery = "" }: NavbarProps) {
  const [query, setQuery] = useState(initialQuery);
  const navigate = useNavigate();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <header className="flex items-center gap-6 px-8 py-4">
      <Logo to="/home" />
      <form onSubmit={handleSubmit} className="flex-1 max-w-2xl">
        <div className="flex items-center bg-cream rounded-[20px] px-5 py-2.5 gap-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="search"
            placeholder="Search"
            aria-label="Search pieces"
            className="flex-1 bg-transparent outline-none font-display text-xl text-black placeholder:text-black"
          />
          <button type="submit" aria-label="Submit search" className="text-black">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </button>
        </div>
      </form>
      <UserButton
        appearance={{
          elements: { avatarBox: "h-24 w-24 border-2 border-cream" },
        }}
      >
        <UserButton.MenuItems>
          <UserButton.Link
            label="Saved pieces"
            labelIcon={<BookmarkIcon />}
            href="/profile"
          />
        </UserButton.MenuItems>
      </UserButton>
    </header>
  );
}

function BookmarkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}