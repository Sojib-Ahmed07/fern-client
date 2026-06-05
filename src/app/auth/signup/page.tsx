"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/auth-client";
import { User, Mail, Lock, Loader2 } from "lucide-react";
import GoogleLoginButton from "@/components/buttons/GoogleLoginButton";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await signUp.email(
        {
          email,
          password,
          name,
          callbackURL: "/", // ✨ ফিক্সড: সাকসেসফুল রেজিস্ট্রেশন ও অটো-লগইনের পর হোমপেজে নিয়ে যাবে
        },
        {
          onRequest: () => setLoading(true),
          onError: (ctx) => {
            setError(ctx.error.message || "Something went wrong.");
            setLoading(false);
          },
          onSuccess: () => {
            setLoading(false);
            // 💡 Better Auth অলরেডি ব্যাকঅ্যান্ডে ইউজার তৈরি করে লগইন সেশন চালু করে দিয়েছে
            alert(
              "Registration successful! 🎉 Welcome to FERN_SHOP. We've sent a verification link to your email, please verify it when you can.",
            );
            router.push("/"); // 🚀 ফিক্সড: সরাসরি হোমপেজে রিডাইরেক্ট (ম্যানুয়াল লগইনের ঝামেলা নেই)
            router.refresh(); // নেভবার ও সেশন স্টেট আপডেট করার জন্য
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
            Create an Account
          </h2>
          <p className="text-center text-sm text-base-content/60 mb-4">
            Join us today to start shopping!
          </p>

          {error && (
            <div className="alert alert-error text-sm py-2 rounded-lg mb-2">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSignUp} className="space-y-4">
            {/* Full Name Input */}
            <div className="form-control">
              <label className="label-text font-medium mb-1">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="John Doe"
                  className="input input-bordered w-full pl-10 focus:input-primary text-sm"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <User className="absolute left-3 top-3.5 text-base-content/40 w-5 h-5" />
              </div>
            </div>

            {/* Email Input */}
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

            {/* Password Input */}
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

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary w-full mt-2 font-semibold text-white normal-case"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin w-5 h-5 mr-2" /> Creating
                  Account...
                </>
              ) : (
                "Sign Up"
              )}
            </button>
          </form>

          {/* ডিভাইডার */}
          <div className="divider my-4 text-xs uppercase text-base-content/40 tracking-wider font-semibold">
            OR
          </div>

          {/* ওয়ান-ক্লিক গুগল সাইন-আপ বাটন */}
          <GoogleLoginButton />

          <div className="text-center text-sm mt-6 text-base-content/80">
            Already have an account?{" "}
            {/* 🔗 ফিক্সড লিংক: আপনার প্রজেক্টের মূল লগইন রাউট /auth/login এ ম্যাপ করা হয়েছে */}
            <Link
              href="/auth/login"
              className="link link-primary font-semibold"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
