"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Layers, ShoppingBag, Eye, SlidersHorizontal } from "lucide-react";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  images: string[];
  stock: number;
}

function ShopContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ইউআরএল থেকে কারেন্ট ক্যাটাগরি, পেজ নাম্বার এবং সার্চ কুয়েরি রিড করা
  const currentCategory = searchParams.get("category") || "All";
  const currentPage = searchParams.get("page") || "1";
  const currentSearch = searchParams.get("search") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const categories = [
    "All",
    "Electronics",
    "Clothing",
    "Gadgets",
    "Home Decor",
  ];

  useEffect(() => {
    let isMounted = true;

    const fetchFilteredProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost:5000/api/products?category=${currentCategory}&page=${currentPage}&search=${encodeURIComponent(currentSearch)}&limit=12`,
        );
        const data = await res.json();
        if (data.success && isMounted) {
          setProducts(data.products || []);
          setTotalPages(data.meta?.totalPages || 1);
        }
      } catch (error) {
        console.error("Error filtering products:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchFilteredProducts();

    return () => {
      isMounted = false;
    };
  }, [currentCategory, currentPage, currentSearch]);

  // 🔄 ক্যাটাগরি সুইচ করার হ্যান্ডলার (সার্চ কুয়েরি বজায় রাখবে)
  const handleCategoryChange = (category: string) => {
    const searchPart = currentSearch
      ? `&search=${encodeURIComponent(currentSearch)}`
      : "";
    if (category === "All") {
      router.push(`/shop?page=1${searchPart}`);
    } else {
      router.push(`/shop?category=${category}&page=1${searchPart}`);
    }
  };

  // 📄 পেজ চেঞ্জ করার হ্যান্ডলার (ক্যাটাগরি ও সার্চ কুয়েরি দুইটাই ধরে রাখবে)
  const handlePageChange = (page: number) => {
    const searchPart = currentSearch
      ? `&search=${encodeURIComponent(currentSearch)}`
      : "";
    if (currentCategory === "All") {
      router.push(`/shop?page=${page}${searchPart}`);
    } else {
      router.push(
        `/shop?category=${currentCategory}&page=${page}${searchPart}`,
      );
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 min-h-screen">
      {/* হেডার টাইটেল */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-base-content flex items-center gap-2">
          <SlidersHorizontal className="text-primary" size={24} /> Marketplace
        </h1>
        {currentSearch && (
          <p className="text-sm text-primary font-medium mt-1">
            Showing results for: {currentSearch}
          </p>
        )}
        <p className="text-xs text-base-content/60 mt-1">
          Explore our products or filter by your favorite category.
        </p>
      </div>

      {/* 🗂️ ফিল্টারিং ট্যাব বাটনস */}
      <div className="flex flex-wrap gap-2 mb-10 bg-base-200/40 p-2 rounded-2xl border border-base-200 max-w-max">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`btn btn-sm rounded-xl px-5 border-none font-semibold normal-case transition-all ${
              currentCategory === cat
                ? "btn-primary text-white shadow-sm"
                : "btn-ghost text-base-content/70 hover:bg-base-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 🛍️ প্রোডাক্ট গ্রিড ডিসপ্লে */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(8)].map((_, idx) => (
            <div key={idx} className="flex flex-col gap-3 w-full">
              <div className="skeleton h-52 w-full rounded-2xl"></div>
              <div className="skeleton h-4 w-28"></div>
              <div className="skeleton h-4 w-full"></div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-base-300 rounded-3xl bg-base-100 max-w-md mx-auto">
          <Layers size={40} className="mx-auto opacity-30 mb-2" />
          <p className="font-semibold text-base-content/60">
            No products found!
          </p>
          <p className="text-xs text-base-content/40 mt-1">
            We couldnt find any items in {currentCategory}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="card bg-base-100 border border-base-200 shadow-none hover:shadow-md transition-all rounded-2xl overflow-hidden group"
              >
                {/* ছবি */}
                <div className="relative h-52 bg-base-200/50 overflow-hidden">
                  <img
                    src={product.images?.[0] || "https://placehold.co/300"}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.stock === 0 && (
                    <span className="absolute top-2 left-2 badge badge-error text-white font-bold text-[10px] rounded-lg">
                      OUT OF STOCK
                    </span>
                  )}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    {/* 🔗 ফিক্সড: /products/ পাথ আপডেট করা হয়েছে */}
                    <Link
                      href={`/products/${product.id}`}
                      className="btn btn-circle btn-sm bg-base-100 text-base-content border-none shadow"
                    >
                      <Eye size={16} />
                    </Link>
                  </div>
                </div>

                {/* বডি ডিটেইলস */}
                <div className="card-body p-4 justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-base-content/40 block mb-1">
                      {product.category}
                    </span>
                    {/* 🔗 ফিক্সড: /products/ পাথ আপডেট করা হয়েছে */}
                    <Link
                      href={`/products/${product.id}`}
                      className="font-semibold text-sm hover:text-primary line-clamp-2 leading-snug"
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
                      className="btn btn-primary btn-sm btn-square text-white rounded-xl"
                    >
                      <ShoppingBag size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 📄 পেজিনেশন */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-12">
              <div className="join border border-base-300 bg-base-100 p-1 rounded-xl shadow-sm">
                {[...Array(totalPages)].map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`join-item btn btn-sm rounded-lg px-4 border-none normal-case transition-all ${
                        Number(currentPage) === pageNum
                          ? "btn-primary text-white font-bold shadow-sm"
                          : "btn-ghost text-base-content/60 hover:bg-base-200"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
