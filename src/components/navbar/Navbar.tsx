"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import { useCartStore } from "@/lib/cart-store";
import {
  ShoppingCart,
  Search,
  LogOut,
  ShoppingBag,
  Loader2,
  Menu,
  X,
} from "lucide-react";

interface ProductSuggestion {
  id: string;
  name: string;
  price: number;
  category: string;
  images: string[];
}

export default function Navbar() {
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSignOutLoading, setIsSignOutLoading] = useState(false);

  // 🔍 সার্চ ও লাইভ রিকমেন্ডেশন স্টেটস
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<ProductSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const { data: session, isPending } = useSession();
  const cartItems = useCartStore((state) => state.items);
  const cartItemCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  // 📡 ১. ইনপুট চেঞ্জ হ্যান্ডলার (এখানেই স্টেট আপডেট হবে, ইফেক্টের ভেতরে নয়)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.trim()) {
      setIsSearching(true); // টাইপ করা শুরু করলেই লোডার চালু হবে (Safe from Effect Error)
    } else {
      setSuggestions([]);
      setIsSearching(false);
      setShowDropdown(false);
    }
  };

  // ⚡ ২. পিওর ডিবোউন্স ইফেক্ট (শুধু অ্যাসিনক্রোনাস কাজ করবে, সিনক্রোনাস setState নেই)
  useEffect(() => {
    if (!searchQuery.trim()) return;

    const delayDebounceFn = setTimeout(async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/products?search=${encodeURIComponent(searchQuery)}&limit=5`,
        );
        const data = await res.json();
        if (data.success) {
          setSuggestions(data.products || []);
          setShowDropdown(true);
        }
      } catch (error) {
        console.error("Live search failed:", error);
      } finally {
        setIsSearching(false); // অ্যাসিনক্রোনাস কল বাউন্ডারির ভেতর স্টেট চেঞ্জ সম্পূর্ণ নিরাপদ
      }
    }, 300); // ৩০০ মিলি-সেকেন্ড ডিবোউন্স

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // 🖱️ ড্রপডাউনের বাইরে ক্লিক করলে সাজেশন বক্স বন্ধ করার লজিক
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🎯 মেইন সার্চ সাবমিট (এন্টার চাপলে ফুল শপ পেজে যাবে)
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    setShowDropdown(false);
    setIsMobileMenuOpen(false);
  };

  // 🛒 সাজেশন আইটেমে ক্লিক হ্যান্ডলার
  const handleSuggestionClick = (productId: string) => {
    router.push(`/products/${productId}`);
    setShowDropdown(false);
    setSearchQuery(""); // ক্লিয়ার ইনপুট
  };

  const handleSignOut = async () => {
    try {
      setIsSignOutLoading(true);
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/");
            router.refresh();
          },
        },
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsSignOutLoading(false);
    }
  };

  return (
    <div className="bg-base-100 shadow-md sticky top-0 z-50">
      <div className="navbar container mx-auto px-4 md:px-6 min-h-[70px]">
        {/* Mobile Menu Toggle */}
        <div className="navbar-start lg:hidden w-auto">
          <button
            className="btn btn-ghost btn-circle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Logo */}
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

        {/* Links */}
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 gap-2 font-medium">
            <li>
              <Link href="/shop">All Products</Link>
            </li>
            {session && (
              <li>
                <Link href="/orders">My Orders</Link>
              </li>
            )}
          </ul>
        </div>

        {/* Right Controls */}
        <div className="navbar-end gap-2 w-auto lg:flex-1">
          {/* 🔍 DESKTOP SEARCH WITH LIVE RECOMMENDATIONS */}
          <div
            ref={dropdownRef}
            className="hidden md:flex relative max-w-xs w-full mx-2"
          >
            <form onSubmit={handleSearchSubmit} className="w-full relative">
              <input
                type="text"
                value={searchQuery}
                onChange={handleInputChange} // 👈 আমাদের নতুন স্মার্ট চেঞ্জ হ্যান্ডলার
                onFocus={() => searchQuery.trim() && setShowDropdown(true)}
                placeholder="Search products..."
                className="input input-bordered input-sm rounded-full pl-4 pr-10 w-full focus:input-primary"
              />
              <button
                type="submit"
                className="absolute right-3 top-2.5 text-base-content/50 hover:text-primary"
              >
                {isSearching ? (
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
              </button>
            </form>

            {/* ✨ লাইভ সাজেশন ড্রপডাউন বক্স */}
            {showDropdown && (suggestions.length > 0 || searchQuery.trim()) && (
              <div className="absolute top-11 left-0 w-full bg-base-100 border border-base-200 rounded-2xl shadow-xl z-50 p-2 overflow-hidden max-h-80 overflow-y-auto">
                {suggestions.length === 0 ? (
                  <div className="text-xs p-4 text-center opacity-50">
                    No products match {searchQuery}
                  </div>
                ) : (
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold tracking-wider opacity-40 px-3 py-1 uppercase">
                      Suggestions
                    </span>
                    {suggestions.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => handleSuggestionClick(product.id)}
                        className="flex items-center gap-3 p-2 w-full hover:bg-base-200/60 rounded-xl transition-all text-left group"
                      >
                        <img
                          src={product.images?.[0] || "https://placehold.co/50"}
                          alt={product.name}
                          className="w-10 h-10 object-cover bg-base-200 rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate text-base-content group-hover:text-primary transition-colors">
                            {product.name}
                          </p>
                          <p className="text-xs text-base-content/50 uppercase font-bold text-[10px]">
                            {product.category}
                          </p>
                        </div>
                        <span className="text-sm font-bold text-primary">
                          ${product.price.toFixed(2)}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Cart Icon */}
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

          {/* Auth Button */}
          {isPending ? (
            <div className="w-10 h-10 rounded-full bg-base-300 animate-pulse flex items-center justify-center">
              <Loader2 className="w-4 h-4 animate-spin text-base-content/40" />
            </div>
          ) : session?.user ? (
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
                      alt={session.user.name ?? "User"}
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
                  <Link href="/orders">My Orders</Link>
                </li>
                {session.user.role === "ADMIN" && (
                  <li>
                    <Link href="/admin" className="text-error font-medium">
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
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="btn btn-primary btn-sm md:btn-md rounded-full px-6 shadow-sm"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Drawer Menu & Search */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-base-200 bg-base-100 p-4 shadow-inner">
          <form
            onSubmit={handleSearchSubmit}
            className="form-control relative w-full mb-4"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={handleInputChange} // 👈 মোবাইল ইনপুটেও সেম রিফ্যাক্টর্ড ফাংশন
              placeholder="Search products..."
              className="input input-bordered rounded-full pl-4 pr-10 w-full focus:input-primary"
            />
            <button
              type="submit"
              className="absolute right-4 top-3.5 text-base-content/50"
            >
              {isSearching ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
            </button>
          </form>
          <ul className="menu bg-base-100 w-full rounded-box gap-1 font-medium">
            <li>
              <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)}>
                Shop All Products
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
