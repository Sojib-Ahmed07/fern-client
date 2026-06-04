"use client";

import React from "react";
import { XCircle, RefreshCw, ShoppingCart } from "lucide-react";
import Link from "next/link";

export default function PaymentFailPage() {
  return (
    <div className="container mx-auto px-4 py-20 text-center max-w-md">
      <div className="w-24 h-24 bg-error/20 text-error rounded-full flex items-center justify-center mx-auto mb-6">
        <XCircle size={48} />
      </div>
      <h1 className="text-3xl font-black">Payment Failed</h1>
      <p className="text-base-content/60 mt-2">
        Something went wrong or the payment was cancelled. No money was
        deducted.
      </p>

      <div className="flex flex-col gap-3 mt-8">
        <Link
          href="/checkout"
          className="btn btn-error w-full text-white font-bold"
        >
          <RefreshCw size={18} /> Try Paying Again
        </Link>
        <Link href="/cart" className="btn btn-ghost w-full">
          <ShoppingCart size={16} /> Back to Cart
        </Link>
      </div>
    </div>
  );
}
