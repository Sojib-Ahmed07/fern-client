"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Lock, Loader2, CheckCircle2 } from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // ⚡ Better Auth এর মেইন পাসওয়ার্ড রিসেট মেথড
      const { error } = await authClient.resetPassword({
        newPassword: password,
      });

      if (error) {
        setError(
          error.message || "Failed to reset password. Token may be expired.",
        );
      } else {
        setIsSuccess(true);
        // ৩ সেকেন্ড পর লগইন পেজে অটো রিডাইরেক্ট করা
        setTimeout(() => {
          router.push("/auth/login");
        }, 3000);
      }
    } catch (err) {
      console.error("Reset password error:", err);
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-50 px-4">
      <div className="card w-full max-w-md bg-base-100 border border-base-200 shadow-xl rounded-3xl p-6 md:p-8">
        {!isSuccess ? (
          <>
            <h2 className="text-2xl font-black text-base-content tracking-tight">
              Create New Password
            </h2>
            <p className="text-xs text-base-content/60 mt-1 mb-6">
              Please enter your new strong password below.
            </p>

            {error && (
              <div className="alert alert-error bg-error/10 text-error border-none text-xs rounded-xl py-3 mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* New Password */}
              <div className="form-control">
                <label className="label font-semibold text-xs text-base-content/70">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input input-bordered w-full pl-10 rounded-xl focus:input-primary text-sm"
                  />
                  <Lock className="absolute left-3 top-3.5 text-base-content/40 w-4 h-4" />
                </div>
              </div>

              {/* Confirm Password */}
              <div className="form-control">
                <label className="label font-semibold text-xs text-base-content/70">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input input-bordered w-full pl-10 rounded-xl focus:input-primary text-sm"
                  />
                  <Lock className="absolute left-3 top-3.5 text-base-content/40 w-4 h-4" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full text-white font-bold rounded-xl normal-case mt-2 shadow-sm"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Update Password"
                )}
              </button>
            </form>
          </>
        ) : (
          /* Success State */
          <div className="text-center py-4 space-y-4">
            <div className="flex justify-center text-success">
              <CheckCircle2 size={56} />
            </div>
            <h2 className="text-xl font-bold text-base-content">
              Password Updated!
            </h2>
            <p className="text-sm text-base-content/70 max-w-sm mx-auto">
              Your password has been changed successfully. Redirecting you to
              the login page...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
