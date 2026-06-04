"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import { useCartStore } from "@/lib/cart-store";
import {
  ShoppingCart,
  Search,
  User,
  Menu,
  X,
  LogOut,
  ShoppingBag,
  Loader2,
} from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSignOutLoading, setIsSignOutLoading] = useState(false);

  // 🔒 Better Auth থেকে রিয়েল-টাইম সেশন ডাটা নেওয়া
  const { data: session, isPending } = useSession();

  // 💡 কার্ট কাউন্টার আপাতত স্ট্যাটিক (পরবর্তীতে Zustand/Context দিয়ে ডাইনামিক করা যাবে)
  const cartItems = useCartStore((state) => state.items);
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // 🚪 সাইন-আউট হ্যান্ডলার
  const handleSignOut = async () => {
    try {
      setIsSignOutLoading(true);
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/");
            router.refresh(); // নেভবার স্টেট রিসেট করার জন্য রিফ্রেশ
          },
        },
      });
    } catch (error) {
      console.error("Sign out failed", error);
    } finally {
      setIsSignOutLoading(false);
    }
  };

  return (
    <div className="bg-base-100 shadow-md sticky top-0 z-50">
      <div className="navbar container mx-auto px-4 md:px-6 min-h-[70px]">
        {/* 1. Mobile Menu Hamburger (Left) */}
        <div className="navbar-start lg:hidden w-auto">
          <button
            className="btn btn-ghost btn-circle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* 2. Logo / Brand Name */}
        <div className="navbar-start lg:w-auto flex-1 lg:flex-none justify-center lg:justify-start">
          <Link
            href="/"
            className="btn btn-ghost text-xl font-bold tracking-wider text-primary flex items-center gap-2"
          >
            <ShoppingBag className="w-6 h-6" />
            <span>
              FERN<span className="text-secondary">SHOP</span>
            </span>
          </Link>
        </div>

        {/* 3. Desktop Navigation Links (Center) */}
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 gap-2 font-medium">
            <li>
              <Link href="/products">Shop</Link>
            </li>
            <li>
              <Link href="/categories">Categories</Link>
            </li>
            {session && (
              <li>
                <Link href="/orders">My Orders</Link>
              </li>
            )}{" "}
            {/* শুধু লগইন থাকলে দেখাবে */}
          </ul>
        </div>

        {/* 4. Search, Cart & Profile (Right) */}
        <div className="navbar-end gap-2 w-auto lg:flex-1">
          {/* Desktop Search Bar */}
          <div className="form-control hidden md:flex relative max-w-xs w-full mx-2">
            <input
              type="text"
              placeholder="Search products..."
              className="input input-bordered input-sm rounded-full pl-4 pr-10 w-full focus:input-primary"
            />
            <Search className="absolute right-3 top-2.5 text-base-content/50 w-4 h-4 cursor-pointer hover:text-primary" />
          </div>

          {/* Cart Icon with Badge */}
          <Link href="/cart" className="btn btn-ghost btn-circle">
            <div className="indicator">
              <ShoppingCart className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className="badge badge-sm badge-secondary indicator-item font-bold">
                  {cartItemCount}
                </span>
              )}
            </div>
          </Link>

          {/* ⏳ সেশন লোড হওয়ার সময় স্কেলেটন/লোডার ইফেক্ট */}
          {isPending ? (
            <div className="w-10 h-10 rounded-full bg-base-300 animate-pulse flex items-center justify-center">
              <Loader2 className="w-4 h-4 animate-spin text-base-content/40" />
            </div>
          ) : session?.user ? (
            /* 👤 ইউজার লগইন থাকলে: প্রোফাইল ড্রপডাউন */
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar border border-base-300"
              >
                <div className="w-10 rounded-full flex items-center justify-center bg-neutral text-neutral-content">
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name}
                      className="rounded-full"
                    />
                  ) : (
                    <span className="font-bold text-sm uppercase">
                      {session.user.name?.substring(0, 2)}
                    </span>
                  )}
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow-lg border border-base-200"
              >
                <div className="px-4 py-2 font-bold text-xs text-base-content/60 truncate">
                  Hello, {session.user.name}
                </div>
                <hr className="border-base-200 my-1" />
                <li>
                  <Link href="/profile">My Profile</Link>
                </li>
                <li>
                  <Link href="/orders">My Orders</Link>
                </li>

                {/* 🛡️ ইউজার যদি ADMIN হয় তবেই কেবল এই ড্যাশবোর্ড অপশনটি রেন্ডার হবে */}
                {session.user.role === "ADMIN" && (
                  <li>
                    <Link
                      href="/admin/orders"
                      className="text-error font-medium"
                    >
                      Admin Dashboard
                    </Link>
                  </li>
                )}

                <hr className="border-base-200 my-1" />
                <li>
                  <button
                    onClick={handleSignOut}
                    className="text-error flex items-center gap-2"
                    disabled={isSignOutLoading}
                  >
                    {isSignOutLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <LogOut size={16} />
                    )}
                    Sign Out
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            /* 🔑 ইউজার লগইন না থাকলে: Sign In বাটন */
            <Link
              href="/auth/login"
              className="btn btn-primary btn-sm md:btn-md rounded-full px-6 shadow-sm"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>

      {/* 5. Mobile Search & Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-base-200 bg-base-100 p-4 shadow-inner">
          <div className="form-control relative w-full mb-4">
            <input
              type="text"
              placeholder="Search products..."
              className="input input-bordered rounded-full pl-4 pr-10 w-full"
            />
            <Search className="absolute right-4 top-3.5 text-base-content/50 w-4 h-4" />
          </div>

          <ul className="menu bg-base-100 w-full rounded-box gap-1 font-medium">
            <li>
              <Link href="/products" onClick={() => setIsMobileMenuOpen(false)}>
                Shop All Products
              </Link>
            </li>
            <li>
              <Link
                href="/categories"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Categories
              </Link>
            </li>
            {session && (
              <li>
                <Link href="/orders" onClick={() => setIsMobileMenuOpen(false)}>
                  My Orders
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
