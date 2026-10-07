import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSignUp } from "@clerk/clerk-react";
import Logo from "../components/layout/Logo";

function clerkErrorMessage(err: unknown, fallback: string): string {
  if (err && typeof err === "object" && "errors" in err) {
    const message = (err as { errors?: { message?: string }[] }).errors?.[0]
      ?.message;
    if (message) return message;
  }
  return fallback;
}

export default function Signup() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const navigate = useNavigate();

  // Clerk's account model is firstName/lastName, not a single "name" field —
  // the UI keeps one Name input to match the Figma design, and splits it on
  // the first space when calling signUp.create.
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Clerk requires a verification step after signUp.create() when email
  // verification is enabled (the default) — this can't be collapsed into
  // one screen the way login can, since there's a real code to wait for.
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");

  async function handleCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isLoaded) return;

    setError("");
    setSubmitting(true);
    try {
      const [firstName, ...rest] = name.trim().split(" ");
      const lastName = rest.join(" ") || undefined;

      const result = await signUp.create({
        firstName,
        lastName,
        emailAddress: email,
        password,
        legalAccepted: agreed,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        navigate("/home");
        return;
      }

      if (result.unverifiedFields.includes("email_address")) {
        await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
        setPendingVerification(true);
      } else {
        setError(
          "Your account needs an extra step this form doesn't support yet."
        );
      }
    } catch (err) {
      setError(clerkErrorMessage(err, "Couldn't create your account."));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleVerify(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isLoaded) return;

    setError("");
    setSubmitting(true);
    try {
      const result = await signUp.attemptEmailAddressVerification({ code });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        navigate("/home");
      } else {
        // The code itself can be correct while the overall sign-up still
        // isn't "complete" — Clerk may be waiting on another required
        // field (e.g. username). Surface exactly what's missing instead of
        // telling the user to retry a code that's already been consumed.
        console.log(
          "Sign-up not complete:",
          result.status,
          result.missingFields,
          result.unverifiedFields
        );
        const missing = result.missingFields?.join(", ");
        setError(
          missing
            ? `Almost there — we still need: ${missing}.`
            : "That code was accepted, but sign-up isn't complete yet. Please contact support."
        );
      }
    } catch (err) {
      setError(clerkErrorMessage(err, "That code wasn't accepted."));
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
          {!pendingVerification ? (
            <>
              <h1 className="font-display font-medium text-3xl text-black">
                Sign up
              </h1>

              <form onSubmit={handleCreate} className="flex flex-col gap-6">
                <div className="flex flex-col gap-1">
                  <label htmlFor="name" className="font-display text-black">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-14 rounded-[12px] bg-cream border border-black/[0.15] px-4 font-body text-lg outline-none focus:border-tan"
                  />
                </div>

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
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-14 rounded-[12px] bg-cream border border-black/[0.15] px-4 font-body text-lg outline-none focus:border-tan"
                  />
                </div>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="h-5 w-5 rounded accent-espresso"
                  />
                  <span className="font-display text-[#333]">
                    I agree to the terms
                  </span>
                </label>

                {/* Mount point for Clerk's Smart CAPTCHA widget. Without this,
                    Clerk silently falls back to Invisible CAPTCHA and logs a
                    console warning on every signUp.create() call. */}
                <div id="clerk-captcha" />

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
                  {submitting ? "Creating account…" : "Sign up"}
                </button>
              </form>

              <div className="flex flex-col items-center gap-4">
                <span className="font-display text-[#1c1c1c]">
                  Already have an account?{" "}
                  <Link to="/login" className="font-medium underline text-[#111]">
                    Log in
                  </Link>
                </span>
              </div>
            </>
          ) : (
            <>
              <h1 className="font-display font-medium text-3xl text-black">
                Check your email
              </h1>
              <p className="font-body text-black/70">
                Enter the code we sent to {email} to finish creating your account.
              </p>

              <form onSubmit={handleVerify} className="flex flex-col gap-6">
                <div className="flex flex-col gap-1">
                  <label htmlFor="code" className="font-display text-black">
                    Verification code
                  </label>
                  <input
                    id="code"
                    type="text"
                    inputMode="numeric"
                    required
                    autoComplete="one-time-code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
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
                  {submitting ? "Verifying…" : "Verify and continue"}
                </button>
              </form>
            </>
          )}
        </div>
      </main>
    </div>
  );
}