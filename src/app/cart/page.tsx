"use client";

import React, { useEffect, useState } from "react";
import { useCartStore } from "@/lib/cart-store";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, getTotalPrice, clearCart } =
    useCartStore();
  const [mounted, setMounted] = useState(false);

  // 🔄 Hydration Error এড়ানোর জন্য সল্যুশন
  useEffect(() => {
    requestAnimationFrame(() => {
      setMounted(true);
    });
  }, []);

  if (!mounted) return null;

  return (
    <div className="container mx-auto px-4 py-10 lg:px-8 max-w-5xl min-h-[75vh]">
      <h1 className="text-3xl font-black text-base-content tracking-tight mb-8 flex items-center gap-3">
        <ShoppingBag className="text-primary w-8 h-8" />
        Your Shopping Cart
      </h1>

      {items.length === 0 ? (
        /* 🛒 খালি কার্ট ইন্টারফেস */
        <div className="text-center py-16 bg-base-100 border border-base-200 rounded-3xl shadow-sm space-y-5">
          <div className="w-20 h-20 bg-base-200 rounded-full flex items-center justify-center mx-auto text-base-content/40">
            <ShoppingBag size={36} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-base-content">
              Your cart is absolutely empty
            </h2>
            <p className="text-sm text-base-content/50 mt-1">
              Looks like you havent added anything to your cart yet.
            </p>
          </div>
          <Link
            href="/products"
            className="btn btn-primary rounded-xl px-6 font-bold text-white gap-2"
          >
            <ArrowLeft size={16} /> Start Shopping
          </Link>
        </div>
      ) : (
        /* 🛍️ কার্ট কন্টেন্ট গ্রিড লেআউট */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* বাম পাশ: কার্ট আইটেম লিস্ট */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center px-2">
              <span className="text-xs font-bold text-base-content/50 uppercase tracking-wider">
                Product Description
              </span>
              <button
                onClick={clearCart}
                className="text-xs font-semibold text-error hover:underline"
              >
                Clear All Items
              </button>
            </div>

            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-center gap-4 bg-base-100 p-4 rounded-2xl border border-base-200 shadow-sm transition-all hover:border-base-300"
              >
                {/* ইমেজ */}
                <div className="w-20 h-20 bg-base-200 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center border border-base-200">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="object-cover w-full h-full"
                  />
                </div>

                {/* নাম ও ডিটেইলস */}
                <div className="flex-1 text-center sm:text-left space-y-1">
                  <span className="badge badge-sm bg-base-200 border-none font-medium text-base-content/60">
                    {item.category}
                  </span>
                  <h3 className="text-sm font-bold text-base-content line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="text-sm font-black text-primary">
                    ${item.price.toLocaleString()}
                  </p>
                </div>

                {/* কোয়ান্টিটি ম্যানেজার ও ডিলিট বাটন */}
                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="join border border-base-300 rounded-lg bg-base-100">
                    <button
                      className="btn btn-xs btn-ghost join-item"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus size={12} />
                    </button>
                    <span className="px-3 py-1 font-bold text-xs flex items-center bg-base-50">
                      {item.quantity}
                    </span>
                    <button
                      className="btn btn-xs btn-ghost join-item"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                    >
                      <Plus size={12} />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="btn btn-ghost btn-sm btn-circle text-base-content/40 hover:text-error hover:bg-error/10"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ডান পাশ: অর্ডার সামারি ও চেকআউট প্যানেল */}
          <div className="bg-base-100 p-6 rounded-3xl border border-base-200 shadow-sm h-fit space-y-6">
            <h3 className="text-lg font-bold text-base-content border-b border-base-200 pb-3">
              Order Summary
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-base-content/70">
                <span>Subtotal</span>
                <span className="font-semibold text-base-content">
                  ${getTotalPrice().toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-base-content/70">
                <span>Shipping Fee</span>
                <span className="text-success font-medium">Free Shipping</span>
              </div>
              <div className="flex justify-between text-base-content/70">
                <span>Estimated Tax</span>
                <span className="font-semibold text-base-content">$0.00</span>
              </div>

              <hr className="border-base-200 my-2" />

              <div className="flex justify-between text-base font-black text-base-content">
                <span>Total Amount</span>
                <span className="text-primary text-xl">
                  ${getTotalPrice().toLocaleString()}
                </span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="btn btn-primary w-full rounded-xl shadow-md font-bold text-white gap-2 mt-4 group"
            >
              Proceed to Checkout
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>

            <Link
              href="/products"
              className="btn btn-ghost btn-sm w-full font-medium text-xs text-base-content/50 gap-1.5 normal-case"
            >
              <ArrowLeft size={14} /> Continue browsing items
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
