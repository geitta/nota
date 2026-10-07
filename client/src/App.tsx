import { Navigate, Route, Routes } from "react-router-dom";
import type { ReactElement } from "react";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import Home from "./pages/Home";
import SearchResults from "./pages/SearchResults";
import PieceDetail from "./pages/PieceDetail";
import Compare from "./pages/Compare";
import Profile from "./pages/Profile";

function RequireAuth({ children }: { children: ReactElement }) {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/home"
        element={
          <RequireAuth>
            <Home />
          </RequireAuth>
        }
      />
      <Route
        path="/search"
        element={
          <RequireAuth>
            <SearchResults />
          </RequireAuth>
        }
      />
      <Route
        path="/pieces/:id"
        element={
          <RequireAuth>
            <PieceDetail />
          </RequireAuth>
        }
      />
      <Route
        path="/pieces/:id/compare"
        element={
          <RequireAuth>
            <Compare />
          </RequireAuth>
        }
      />
      <Route
        path="/profile"
        element={
          <RequireAuth>
            <Profile />
          </RequireAuth>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}