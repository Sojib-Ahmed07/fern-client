"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import { Mail, Lock, Loader2 } from "lucide-react";
import GoogleLoginButton from "@/components/buttons/GoogleLoginButton";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await signIn.email(
        {
          email,
          password,
          callbackURL: "/", // লগইন সফল হলে হোমপেজে রিডাইরেক্ট করবে
        },
        {
          onRequest: () => setLoading(true), // ✨ Better Auth নিজেই লোডিং হ্যান্ডেল করবে শুরুতেই
          onError: (ctx) => {
            setError(ctx.error.message || "Invalid email or password.");
            setLoading(false);
          },
          onSuccess: () => {
            setLoading(false);
            router.push("/");
            router.refresh(); // নেভবার আপডেট করার জন্য পেজ রিফ্রেশ
          },
        },
      );
    } catch (err) {
      setError("An unexpected error occurred.");
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-100px)] px-4 bg-base-200/30">
      <div className="card bg-base-100 w-full max-w-md shadow-xl border border-base-200 rounded-2xl">
        <div className="card-body p-8">
          <h2 className="card-title text-2xl font-bold text-center justify-center text-primary">
            Welcome Back
          </h2>
          <p className="text-center text-sm text-base-content/60 mb-4">
            Sign in to access your orders and cart
          </p>

          {error && (
            <div className="alert alert-error text-sm py-2 rounded-lg mb-2">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSignIn} className="space-y-4">
            {/* Email */}
            <div className="form-control">
              <label className="label-text font-medium mb-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="input input-bordered w-full pl-10 focus:input-primary text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Mail className="absolute left-3 top-3.5 text-base-content/40 w-5 h-5" />
              </div>
            </div>

            {/* Password */}
            <div className="form-control">
              <label className="label-text font-medium mb-1">Password</label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="••••••••"
                  className="input input-bordered w-full pl-10 focus:input-primary text-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Lock className="absolute left-3 top-3.5 text-base-content/40 w-5 h-5" />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn btn-primary w-full mt-2 font-semibold text-white normal-case"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin w-5 h-5 mr-2" /> Signing
                  In...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* ✨ ফিক্সড: ইমেইল এবং গুগলের মাঝখানে সুন্দর "OR" ডিভাইডার */}
          <div className="divider my-4 text-xs uppercase text-base-content/40 tracking-wider font-semibold">
            OR
          </div>

          {/* গুগল লগইন বাটন */}
          <GoogleLoginButton />

          <div className="text-center text-sm mt-6 text-base-content/80">
            Dont have an account?{" "}
            <Link
              href="/auth/signup"
              className="link link-primary font-semibold"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
