import { useState } from "react";
import {
  loginUser,
  registerUser,
  loginWithGoogle,
  resetPassword,
} from "../services/authService";

export default function AuthSection({ onAuthSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isReset, setIsReset] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg("");
    setResetSuccess(false);
    setLoading(true);

    try {
      if (isReset) {
        await resetPassword(form.email.trim());
        setResetSuccess(true);
        setLoading(false);
        return;
      }

      if (isSignUp) {
        if (!form.name.trim()) {
          throw new Error("Please enter your name.");
        }
        await registerUser(form.name.trim(), form.email.trim(), form.password);
      } else {
        await loginUser(form.email.trim(), form.password);
      }
      onAuthSuccess?.();
    } catch (err) {
      setErrorMsg(formatAuthError(err.code || err.message));
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setErrorMsg("");
    setLoading(true);
    try {
      await loginWithGoogle();
      onAuthSuccess?.();
    } catch (err) {
      setErrorMsg(formatAuthError(err.code || err.message));
    } finally {
      setLoading(false);
    }
  }

  function formatAuthError(code) {
    if (code.includes("email-already-in-use")) return "This email is already registered. Try signing in.";
    if (code.includes("wrong-password") || code.includes("invalid-credential")) return "Incorrect email or password. Please verify your credentials.";
    if (code.includes("user-not-found")) return "No account found with this email.";
    if (code.includes("weak-password")) return "Password should be at least 6 characters.";
    if (code.includes("invalid-email")) return "Please enter a valid email address.";
    if (code.includes("popup-closed-by-user")) return "Google sign-in was cancelled.";
    return code || "Authentication failed. Please try again.";
  }

  return (
    <section
      id="auth-section"
      className="my-8 rounded-2xl border border-[#dce3ea] bg-white p-6 sm:p-8 shadow-sm max-w-lg mx-auto"
    >
      <div className="text-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-[#17324d] tracking-tight">
          {isReset
            ? "Reset your password"
            : isSignUp
            ? "Join AttendMyEvent"
            : "Sign in to your account"}
        </h2>
        <p className="text-xs sm:text-sm text-[#657384] mt-1">
          {isReset
            ? "We'll send you an email with password reset instructions."
            : isSignUp
            ? "Discover what's happening around you and host your own gatherings."
            : "Welcome back! Keep up with events happening in your community."}
        </p>
      </div>

      {resetSuccess && (
        <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800">
          Password reset link sent! Check your inbox.
        </div>
      )}

      {errorMsg && (
        <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
          {errorMsg}
        </div>
      )}

      {/* Google Login Button */}
      {!isReset && (
        <>
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 rounded-xl border border-[#dce3ea] bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#17324d] shadow-xs hover:bg-[#f8fafc] hover:border-[#a9c6d7] transition-colors disabled:opacity-50"
          >
            <svg className="size-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="relative my-5 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#e2e8f0]" />
            </div>
            <span className="relative bg-white px-3 text-[11px] font-semibold uppercase tracking-wider text-[#94a3b8]">
              Or with email
            </span>
          </div>
        </>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3.5">
        {isSignUp && !isReset && (
          <div>
            <label className="block text-xs font-semibold text-[#3e5368] mb-1">
              Your Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Rahul Sharma"
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              className="w-full h-10 px-3.5 text-xs sm:text-sm rounded-xl border border-[#d4dfe6] bg-[#f8fafc] text-[#17324d] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2f6f96]/30"
            />
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-[#3e5368] mb-1">
            Email Address
          </label>
          <input
            type="email"
            required
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            className="w-full h-10 px-3.5 text-xs sm:text-sm rounded-xl border border-[#d4dfe6] bg-[#f8fafc] text-[#17324d] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2f6f96]/30"
          />
        </div>

        {!isReset && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-[#3e5368]">Password</label>
              {!isSignUp && (
                <button
                  type="button"
                  onClick={() => {
                    setIsReset(true);
                    setErrorMsg("");
                  }}
                  className="text-[11px] text-[#2f6f96] hover:underline"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <input
              type="password"
              required
              minLength={6}
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
              className="w-full h-10 px-3.5 text-xs sm:text-sm rounded-xl border border-[#d4dfe6] bg-[#f8fafc] text-[#17324d] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2f6f96]/30"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full h-10 rounded-xl bg-[#2f6f96] text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-[#245b7c] transition-colors disabled:opacity-50 mt-2"
        >
          {loading
            ? "Please wait..."
            : isReset
            ? "Send Reset Link"
            : isSignUp
            ? "Create Account"
            : "Sign In"}
        </button>
      </form>

      {/* Switch mode */}
      <div className="mt-5 text-center text-xs text-[#657384]">
        {isReset ? (
          <button
            type="button"
            onClick={() => {
              setIsReset(false);
              setErrorMsg("");
            }}
            className="font-semibold text-[#2f6f96] hover:underline"
          >
            ← Back to sign in
          </button>
        ) : isSignUp ? (
          <p>
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => {
                setIsSignUp(false);
                setErrorMsg("");
              }}
              className="font-semibold text-[#2f6f96] hover:underline"
            >
              Sign in here
            </button>
          </p>
        ) : (
          <p>
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => {
                setIsSignUp(true);
                setErrorMsg("");
              }}
              className="font-semibold text-[#2f6f96] hover:underline"
            >
              Sign up free
            </button>
          </p>
        )}
      </div>
    </section>
  );
}

