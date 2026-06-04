"use client";

import React, { useState, useEffect } from "react";
import { fetchAllProducts } from "@/lib/product-api";
import {
  Search,
  SlidersHorizontal,
  ArrowLeft,
  ArrowRight,
  ShoppingCart,
} from "lucide-react";
import Link from "next/link";

export default function ShopPage() {
  // ⚙️ স্টেটস
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ totalPages: 1, totalProducts: 0 });
  const [loading, setLoading] = useState(true);

  // ক্যাটাগরি লিস্ট (আপাতত স্ট্যাটিক, ডাটাবেজের সাথে মিল রেখে)
  const categories = [
    "All",
    "Smartphones",
    "Electronics",
    "Clothing",
    "Home Appliances",
  ];

  // 🔄 ডাটা লোড করার ইফেক্ট (সার্চ, পেজ বা ক্যাটাগরি চেঞ্জ হলেই রান হবে)
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      const data = await fetchAllProducts({
        page,
        limit: 8,
        search,
        category: category === "All" ? "" : category,
      });

      if (data.success) {
        setProducts(data.products);
        setMeta({
          totalPages: data.meta.totalPages,
          totalProducts: data.meta.totalProducts,
        });
      }
      setLoading(false);
    };

    // ⏳ সার্চবারে টাইপ করার সাথে সাথে যেন ঘন ঘন রিকোয়েস্ট না যায় (Debounce effect)
    const delayDebounceFn = setTimeout(() => {
      loadProducts();
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [search, category, page]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 🏷️ পেজ হেডার */}
      <div className="mb-8 text-center md:text-left">
        <h1 className="text-3xl font-bold text-base-content tracking-tight">
          Discover Products
        </h1>
        <p className="text-sm text-base-content/60 mt-1">
          Found {meta.totalProducts} premium items ready for you
        </p>
      </div>

      {/* 🔍 ফিল্টার এবং সার্চ কন্ট্রোল বার */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between bg-base-100 p-4 rounded-xl shadow-sm border border-base-200">
        {/* সার্চ ইনপুট */}
        <div className="form-control relative w-full md:max-w-md">
          <input
            type="text"
            placeholder="What are you looking for today?..."
            className="input input-bordered w-full pl-10 focus:input-primary rounded-lg"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }} // সার্চ দিলে পেজ আবার ১ এ যাবে
          />
          <Search className="absolute left-3 top-3.5 text-base-content/40 w-5 h-5" />
        </div>

        {/* ক্যাটাগরি ট্যাব/ফিল্টার */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          <SlidersHorizontal className="text-base-content/50 hidden md:block w-5 h-5 mr-1" />
          {categories.map((cat) => (
            <button
              key={cat}
              className={`btn btn-sm rounded-full px-4 font-medium transition-all ${
                category === cat || (cat === "All" && !category)
                  ? "btn-primary shadow-sm"
                  : "btn-ghost bg-base-200/50 hover:bg-base-200"
              }`}
              onClick={() => {
                setCategory(cat);
                setPage(1);
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 📦 প্রোডাক্টস ডিসপ্লে গ্রিড */}
      {loading ? (
        /* ⏳ লোডিং স্কেলেটন ইফেক্ট */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="card bg-base-100 border border-base-200 shadow-sm h-[380px] animate-pulse"
            >
              <div className="bg-base-300 h-48 w-full rounded-t-2xl"></div>
              <div className="card-body p-4 space-y-3">
                <div className="h-4 bg-base-300 rounded w-1/3"></div>
                <div className="h-6 bg-base-300 rounded w-full"></div>
                <div className="h-4 bg-base-300 rounded w-1/2"></div>
                <div className="h-10 bg-base-300 rounded w-full mt-4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        /* 🚫 প্রোডাক্ট না পাওয়া গেলে নোটিফিকেশন */
        <div className="text-center py-16 bg-base-100 rounded-2xl shadow-sm border border-base-200 max-w-xl mx-auto">
          <p className="text-lg font-semibold text-base-content/70">
            No products match your search.
          </p>
          <p className="text-sm text-base-content/40 mt-1">
            Try checking your spelling or selecting another category.
          </p>
        </div>
      ) : (
        /* 🛍️ আসল প্রোডাক্ট গ্রিড */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product: any) => (
            <div
              key={product.id}
              className="card bg-base-100 border border-base-200 shadow-sm hover:shadow-md transition-all duration-300 group rounded-2xl overflow-hidden"
            >
              {/* প্রোডাক্ট ইমেজ */}
              <figure className="relative bg-base-200 h-48 overflow-hidden">
                <img
                  src={
                    product.images?.[0] ||
                    "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=500"
                  }
                  alt={product.name}
                  className="object-cover h-full w-full group-hover:scale-105 transition-transform duration-500"
                />
                {product.stock <= 0 && (
                  <div className="absolute inset-0 bg-base-300/80 backdrop-blur-xs flex items-center justify-center font-bold text-error">
                    OUT OF STOCK
                  </div>
                )}
              </figure>

              {/* প্রোডাক্ট ডিটেইলস বডি */}
              <div className="card-body p-4 flex flex-col justify-between">
                <div>
                  <span className="text-xs uppercase font-semibold text-secondary tracking-wider">
                    {product.category}
                  </span>
                  <Link href={`/products/${product.id}`} className="block mt-1">
                    <h2 className="card-title text-base font-bold line-clamp-1 hover:text-primary transition-colors cursor-pointer">
                      {product.name}
                    </h2>
                  </Link>
                  <p className="text-xs text-base-content/60 line-clamp-2 mt-1 h-8">
                    {product.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-base-200 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-base-content/40 block">
                      Price
                    </span>
                    <span className="text-lg font-black text-base-content">
                      ${product.price.toLocaleString()}
                    </span>
                  </div>

                  {/* প্রোডাক্ট ডিটেইলস বাটন */}
                  <Link
                    href={`/products/${product.id}`}
                    className="btn btn-primary btn-sm rounded-lg font-semibold shadow-sm text-white gap-2"
                  >
                    View details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 🧭 পেজিনেশন কন্ট্রোল বাটনসমূহ */}
      {meta.totalPages > 1 && (
        <div className="flex justify-center mt-12 gap-2">
          <button
            className="btn btn-sm btn-outline rounded-lg"
            disabled={page === 1 || loading}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          >
            <ArrowLeft className="w-4 h-4" /> Prev
          </button>

          <div className="join">
            {[...Array(meta.totalPages)].map((_, i) => (
              <button
                key={i}
                className={`join-item btn btn-sm rounded-lg mx-0.5 ${page === i + 1 ? "btn-primary text-white" : "btn-ghost"}`}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            className="btn btn-sm btn-outline rounded-lg"
            disabled={page === meta.totalPages || loading}
            onClick={() =>
              setPage((prev) => Math.min(prev + 1, meta.totalPages))
            }
          >
            Next <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
