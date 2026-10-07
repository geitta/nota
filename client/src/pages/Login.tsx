import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSignIn } from "@clerk/clerk-react";
import Logo from "../components/layout/Logo";

export default function Login() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isLoaded) return;

    setError("");
    setSubmitting(true);
    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        navigate("/home");
      } else {
        // Clerk supports many post-password steps (2FA, email verification,
        // etc.) that a single-screen form can't represent. Rather than
        // silently failing, surface it plainly — a fuller implementation
        // would branch on result.status here.
        setError(
          "Your account needs an extra verification step this form doesn't support yet."
        );
      }
    } catch (err) {
      const message =
        err && typeof err === "object" && "errors" in err
          ? // Clerk's error shape: { errors: [{ message }] }
            ((err as { errors?: { message?: string }[] }).errors?.[0]
              ?.message ?? "Couldn't log you in. Check your details.")
          : "Couldn't log you in. Check your details.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-brown relative overflow-hidden">
      <div className="absolute top-0 left-0 z-10 p-4 sm:p-8">
        <Logo />
      </div>

      <img
        src="/assets/bass-cleff.png"
        alt=""
        className="absolute left-8 top-32 opacity-50 w-[555px] hidden lg:block pointer-events-none scale-y-[-1] rotate-180"
      />

      <main className="min-h-screen flex items-center justify-center lg:justify-end px-4 sm:px-8 lg:pr-24 pt-24">
        <div className="flex flex-col gap-8 w-[580px] max-w-full">
          <h1 className="font-display font-medium text-3xl text-black">Log in</h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="font-display text-black">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-14 rounded-[12px] bg-cream border border-black/[0.15] px-4 font-body text-lg outline-none focus:border-tan"
              />
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="font-display text-black">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="font-display text-black/80 text-sm"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-14 rounded-[12px] bg-cream border border-black/[0.15] px-4 font-body text-lg outline-none focus:border-tan"
              />
            </div>

            {error && (
              <p role="alert" className="text-red-800 font-body text-sm">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={!isLoaded || submitting}
              className="btn-solid w-full"
            >
              {submitting ? "Logging in…" : "Log in"}
            </button>
          </form>

          <div className="flex flex-col items-center gap-4">
            <span className="font-display text-[#1c1c1c]">
              Don't have an account?{" "}
              <Link to="/signup" className="font-medium underline text-[#111]">
                Sign up
              </Link>
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}