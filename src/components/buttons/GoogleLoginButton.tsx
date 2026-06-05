"use client";

import React, { useState } from "react";
import { signIn } from "@/lib/auth-client"; 

function GoogleLoginButton() {
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await signIn.social({
        provider: "google",
        callbackURL: "http://localhost:3000", 
      });
    } catch (error) {
      console.error("🔒 Google Auth Frontend Error:", error);
      alert("Google login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        className="btn btn-outline w-full flex items-center justify-center gap-3 font-semibold normal-case border-base-300 hover:bg-base-200 bg-base-100 text-base-content shadow-sm rounded-xl py-3 transition-all"
      >
        {loading ? (
          <span className="loading loading-spinner loading-sm"></span>
        ) : (
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.33 0 3.357 2.72 1.486 6.677l3.78 3.088z"
            />
            <path
              fill="#34A853"
              d="M16.04 15.345c-1.054.71-2.4 1.146-4.04 1.146-2.836 0-5.264-1.927-6.118-4.527L2.1 15.052A11.936 11.936 0 0 0 12 24c3.31 0 6.136-1.09 8.182-2.96l-4.142-3.195z"
            />
            <path
              fill="#4285F4"
              d="M23.49 12.273c0-.818-.073-1.609-.21-2.364H12v4.473h6.464a5.532 5.532 0 0 1-2.4 3.636l4.141 3.196c2.42-2.232 3.819-5.514 3.819-9.35l-.034-.59z"
            />
            <path
              fill="#FBBC05"
              d="M5.922 11.964a7.12 7.12 0 0 1 0-2.2l-3.78-3.087a11.96 11.96 0 0 0 0 10.76l3.78-3.087c-.237-.7-.364-1.446-.364-2.2l.364-.186z"
            />
          </svg>
        )}
        <span>{loading ? "Connecting..." : "Sign in with Google"}</span>
      </button>
    </div>
  );
}

export default GoogleLoginButton;
