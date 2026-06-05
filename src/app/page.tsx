"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Truck,
  ShieldCheck,
  RotateCcw,
  Headphones,
  ArrowRight,
  ShoppingBag,
  Eye,
} from "lucide-react";
import BannerSlider from "@/components/banner/Banner";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  images: string[];
  stock: number;
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // 📡 ডাটাবেজ থেকে ট্রেন্ডিং প্রোডাক্ট ফেচ করা (Safe Pattern)
  useEffect(() => {
    const fetchTrendingProducts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/products"); // আপনার পাবলিক প্রোডাক্ট এপিআই
        const data = await res.json();
        if (data.success) {
          // হোমপেজে দেখানোর জন্য প্রথম ৮টি প্রোডাক্ট নেওয়া হলো
          setProducts(data.products?.slice(0, 8) || []);
        }
      } catch (error) {
        console.error("Error loading homepage products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingProducts();
  }, []);

  return (
    <div className="bg-base-50 min-h-screen">
      <BannerSlider/>

      {/* 🛡️ ২. ট্রাস্ট ও ফিচার ব্যাজ সেকশন (Trust Badges) */}
      <section className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 bg-base-100 p-8 border border-base-200 shadow-sm rounded-2xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 text-primary rounded-xl">
              <Truck size={24} />
            </div>
            <div>
              <h4 className="font-bold text-sm">Free Shipping</h4>
              <p className="text-xs text-base-content/60">
                On all orders over $99
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-success/10 text-success rounded-xl">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 className="font-bold text-sm">Secure Payment</h4>
              <p className="text-xs text-base-content/60">
                100% protected checkout
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-info/10 text-info rounded-xl">
              <RotateCcw size={24} />
            </div>
            <div>
              <h4 className="font-bold text-sm">Easy Returns</h4>
              <p className="text-xs text-base-content/60">
                30 days money-back guarantee
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-warning/10 text-warning rounded-xl">
              <Headphones size={24} />
            </div>
            <div>
              <h4 className="font-bold text-sm">24/7 Support</h4>
              <p className="text-xs text-base-content/60">
                Dedicated live chat & email
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 🗂️ ৩. ক্যাটাগরি সেকশন (Shop by Category) */}
      <section className="container mx-auto px-4 py-10">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-base-content">
              Shop by Category
            </h2>
            <p className="text-xs text-base-content/60 mt-0.5">
              Find exactly what you are looking for
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {["Electronics", "Clothing", "Gadgets", "Home Decor"].map(
            (cat, idx) => (
              <Link
                href={`/shop?category=${cat}`}
                key={idx}
                className="card bg-base-100 border border-base-200 p-6 rounded-2xl text-center font-semibold hover:border-primary hover:text-primary hover:shadow-sm transition-all group"
              >
                <span className="text-lg block mb-1 group-hover:scale-110 transition-transform">
                  {cat === "Electronics" && "💻"}
                  {cat === "Clothing" && "👕"}
                  {cat === "Gadgets" && "⌚"}
                  {cat === "Home Decor" && "🏠"}
                </span>
                <p className="text-sm">{cat}</p>
              </Link>
            ),
          )}
        </div>
      </section>

      {/* 🔥 ৪. ট্রেন্ডিং প্রোডাক্টস গ্রিড (Featured Products) */}
      <section className="container mx-auto px-4 py-10">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-bold text-base-content">
              Trending Products
            </h2>
            <p className="text-xs text-base-content/60 mt-0.5">
              Top picks from our inventory this week
            </p>
          </div>
          <Link
            href="/shop"
            className="btn btn-ghost btn-sm text-primary gap-1 normal-case font-semibold"
          >
            See All Products <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, idx) => (
              <div key={idx} className="flex flex-col gap-3 w-full">
                <div className="skeleton h-52 w-full rounded-2xl"></div>
                <div className="skeleton h-4 w-28"></div>
                <div className="skeleton h-4 w-full"></div>
                <div className="skeleton h-4 w-20"></div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 opacity-60 text-sm">
            No products available at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="card bg-base-100 border border-base-200 shadow-none hover:shadow-md hover:border-base-300 transition-all rounded-2xl overflow-hidden group"
              >
                {/* প্রোডাক্ট ইমেজ ও হোভার ওয়ান-ক্লিক ভিউ */}
                <div className="relative h-52 bg-base-200/50 overflow-hidden">
                  <img
                    src={product.images?.[0] || "https://placehold.co/300"}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.stock === 0 && (
                    <span className="absolute top-2 left-2 badge badge-error text-white font-bold text-[10px] p-1.5 py-1 rounded-lg">
                      OUT OF STOCK
                    </span>
                  )}
                  {/* হোভার ওয়ান-ক্লিক অ্যাকশন */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Link
                      href={`/products/${product.id}`}
                      className="btn btn-circle btn-sm bg-base-100 text-base-content hover:bg-primary hover:text-white border-none shadow"
                    >
                      <Eye size={16} />
                    </Link>
                  </div>
                </div>

                {/* প্রোডাক্ট ডিটেইলস */}
                <div className="card-body p-4 justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-base-content/40 block mb-1">
                      {product.category}
                    </span>
                    <Link
                      href={`/product/${product.id}`}
                      className="font-semibold text-sm text-base-content hover:text-primary line-clamp-2 leading-snug"
                    >
                      {product.name}
                    </Link>
                  </div>

                  <div className="flex justify-between items-center mt-3 pt-2 border-t border-base-100">
                    <span className="text-base font-bold text-base-content">
                      ${product.price.toFixed(2)}
                    </span>
                    <button
                      disabled={product.stock === 0}
                      className="btn btn-primary btn-sm btn-square text-white rounded-xl shadow-sm"
                      title="Add to Cart"
                    >
                      <ShoppingBag size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 🎁 ৫. প্রমোশনাল অফার ব্যানার (Promo Section) */}
      <section className="container mx-auto px-4 py-10 mb-10">
        <div className="hero bg-gradient-to-r from-primary to-secondary text-primary-content rounded-3xl overflow-hidden shadow-sm">
          <div className="hero-content text-center py-12 px-6 lg:py-16">
            <div className="max-w-md mx-auto">
              <span className="badge badge-accent font-bold text-xs uppercase tracking-widest px-3 py-1 mb-3 text-accent-content">
                Limited Offer
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight">
                Upgrade Your Lifestyle
              </h2>
              <p className="py-4 text-sm opacity-90 leading-relaxed">
                Get up to{" "}
                <span className="font-bold underline text-accent">30% OFF</span>{" "}
                on our premium electronics and gadgets category. Free shipping
                included!
              </p>
              <Link
                href="/shop"
                className="btn bg-base-100 hover:bg-base-200 text-primary border-none rounded-xl font-bold px-6 shadow-md normal-case mt-2"
              >
                Shop The Sale
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
