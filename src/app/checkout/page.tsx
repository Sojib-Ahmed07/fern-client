"use client";

import React, { useState } from "react";
import { useCartStore } from "@/lib/cart-store";
import { useSession } from "@/lib/auth-client";
import { CreditCard, Truck, Loader2 } from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
  const { items, getTotalPrice } = useCartStore();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  // 📝 শিপিং স্টেট (এখানে আমরা শুধু ফোন, অ্যাড্রেস এবং কাস্টম নাম/ইমেইল ট্র্যাক করব)
  const [shippingInfo, setShippingInfo] = useState({
    customName: "",
    customEmail: "",
    phone: "",
    address: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  // 💳 পেমেন্ট গেটওয়ে ট্রিগার ফাংশন
  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setLoading(true);

    // 💡 Derived Values: ইউজার নিজে কিছু না লিখলে সেশনের ডেটা অটোমেটিক ব্যাকআপ হিসেবে যাবে
    const finalOrderPayload = {
      items: items.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      })),
      shippingInfo: {
        name: shippingInfo.customName || session?.user?.name || "Customer",
        email:
          shippingInfo.customEmail ||
          session?.user?.email ||
          "customer@mail.com",
        phone: shippingInfo.phone,
        address: shippingInfo.address,
      },
    };

    try {
      const res = await fetch("http://localhost:5000/api/orders/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // 🔒 সেশন কুকি ব্যাকঅ্যান্ড মিডলওয়্যারে পাস করার জন্য ক্রেডেনশিয়ালস অন্তর্ভুক্ত করা হলো
        credentials: "include",
        body: JSON.stringify(finalOrderPayload),
      });

      const data = await res.json();

      if (data.success && data.GatewayPageURL) {
        // 🚀 সরাসরি SSLCommerz-এর অফিশিয়াল স্যান্ডবক্স পেমেন্ট গেটওয়েতে রিডাইরেক্ট
        window.location.href = data.GatewayPageURL;
      } else {
        alert(data.message || "Payment initiation failed.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Checkout Request Error:", error);
      alert("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold">
          Your cart is empty. Cannot checkout!
        </h2>
        <Link
          href="/products"
          className="btn btn-primary btn-sm mt-4 rounded-lg"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 lg:px-8 max-w-4xl min-h-[75vh]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 📋 শিপিং ইনফরমেশন ফর্ম */}
        <div className="bg-base-100 p-6 rounded-3xl border border-base-200 shadow-sm space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2 text-base-content">
            <Truck className="text-primary w-5 h-5" /> Shipping Details
          </h2>

          <form onSubmit={handlePaymentSubmit} className="space-y-3">
            {/* 👤 ফুল নেম ইনপুট */}
            <div className="form-control">
              <label className="label-text text-xs font-semibold mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="customName"
                placeholder={session?.user?.name || "Enter your name"}
                className="input input-bordered w-full input-sm rounded-lg"
                value={shippingInfo.customName}
                onChange={handleInputChange}
              />
            </div>

            {/* 📧 ইমেইল ইনপুট */}
            <div className="form-control">
              <label className="label-text text-xs font-semibold mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="customEmail"
                placeholder={session?.user?.email || "Enter your email"}
                className="input input-bordered w-full input-sm rounded-lg"
                value={shippingInfo.customEmail}
                onChange={handleInputChange}
              />
            </div>

            {/* 📞 ফোন নম্বর ইনপুট */}
            <div className="form-control">
              <label className="label-text text-xs font-semibold mb-1">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                placeholder="e.g. 017XXXXXXXX"
                required
                className="input input-bordered w-full input-sm rounded-lg"
                value={shippingInfo.phone}
                onChange={handleInputChange}
              />
            </div>

            {/* 📍 ডেলিভারি অ্যাড্রেস ইনপুট */}
            <div className="form-control">
              <label className="label-text text-xs font-semibold mb-1">
                Full Delivery Address
              </label>
              <textarea
                name="address"
                required
                className="textarea textarea-bordered w-full textarea-sm rounded-lg min-h-[70px]"
                value={shippingInfo.address}
                onChange={handleInputChange}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full rounded-xl shadow-md font-bold text-white gap-2 mt-4"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <CreditCard size={18} />
              )}
              Pay with SSLCommerz (BDT)
            </button>
          </form>
        </div>

        {/* 🛍️ অর্ডার সামারি রিভিউ */}
        <div className="bg-base-200/40 p-6 rounded-3xl border border-base-200 h-fit space-y-4">
          <h3 className="text-lg font-bold text-base-content">
            Review Order Items
          </h3>
          <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center bg-base-100 p-2 rounded-xl border border-base-200 text-xs"
              >
                <div className="flex items-center gap-2">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-10 h-10 object-cover rounded-lg bg-base-200"
                  />
                  <div>
                    <p className="font-bold line-clamp-1">{item.name}</p>
                    <p className="text-base-content/50">Qty: {item.quantity}</p>
                  </div>
                </div>
                <span className="font-bold text-primary">
                  ${(item.price * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          <hr className="border-base-300" />
          <div className="flex justify-between font-black text-base-content text-base">
            <span>Payable Amount:</span>
            <span className="text-primary text-xl">
              ${getTotalPrice().toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
