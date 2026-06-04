"use client";

import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useCartStore } from "@/lib/cart-store";
import { CheckCircle, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const txnId = searchParams.get("txn");
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    // পেমেন্ট সফল হলে কার্ট খালি করে দিচ্ছি
    clearCart();
  }, [clearCart]);

  return (
    <div className="container mx-auto px-4 py-20 text-center max-w-md">
      <div className="w-24 h-24 bg-success/20 text-success rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle size={48} />
      </div>
      <h1 className="text-3xl font-black">Payment Successful!</h1>
      <p className="text-base-content/60 mt-2">
        Thank you for your purchase. Your order has been processed.
      </p>

      {txnId && (
        <div className="mt-6 p-4 bg-base-200 rounded-lg font-mono text-sm">
          Transaction ID: <span className="font-bold">{txnId}</span>
        </div>
      )}

      <div className="flex flex-col gap-3 mt-8">
        <Link
          href="/orders"
          className="btn btn-primary w-full text-white font-bold"
        >
          <ShoppingBag size={18} /> View My Orders
        </Link>
        <Link href="/products" className="btn btn-ghost w-full">
          Continue Shopping <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
