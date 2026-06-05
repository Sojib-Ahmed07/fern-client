"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Trash2, Edit, Package, Layers, Database } from "lucide-react";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  images: string[];
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch("${process.env.BACKEND_URL}/api/products", {
          credentials: "include", // সেশন কুকি পাস করার জন্য
        });
        const data = await res.json();
        if (data.success) {
          setProducts(data.products || []);
        } else {
          alert(data.message || "Failed to load products.");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); // 👈 খালি ডিপেন্ডেন্সি অ্যারে, তাই এটি পেজ লোডের সময় শুধু একবারই রান করবে


  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product? ⚠️")) return;

    try {
      const res = await fetch(`${process.env.BACKEND_URL}/api/products/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();

      if (data.success) {
        alert("Product deleted successfully! 🗑️");
        // স্টেট থেকে প্রোডাক্টটি রিমুভ করা (পেজ রিফ্রেশ ছাড়া ইনস্ট্যান্ট আপডেট)
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert(data.message || "Failed to delete product.");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Something went wrong!");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <span className="loading loading-spinner loading-md text-primary"></span>
        <span className="ml-2 font-medium">Loading Product Inventory...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      {/* হেডার সেকশন */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-base-content flex items-center gap-2">
            <Package className="text-primary" /> Product Inventory
          </h1>
          <p className="text-xs text-base-content/60">
            Manage your store products, modify pricing, and track live stock
            levels
          </p>
        </div>
        {/* 🔗 এখানে ক্লিক করলেই সরাসরি আপনার তৈরি করা প্রোডাক্ট অ্যাড পেজে চলে যাবে */}
        <Link
          href="/admin/products/add"
          className="btn btn-primary text-white font-semibold normal-case rounded-xl shadow-sm"
        >
          <Plus size={18} /> Add New Product
        </Link>
      </div>

      {/* প্রোডাক্ট লিস্ট টেবিল */}
      {products.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-base-300 rounded-2xl bg-base-100 opacity-75">
          <Package size={48} className="mx-auto text-base-content/30 mb-2" />
          <p className="font-medium text-base-content/60">
            No products found in the inventory.
          </p>
          <Link
            href="/admin/products/add"
            className="btn btn-link btn-sm text-primary mt-2"
          >
            Create your first product now
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto border border-base-200 rounded-2xl shadow-sm bg-base-100">
          <table className="table w-full text-sm">
            {/* টেবিল হেডার */}
            <thead className="bg-base-200/50 text-base-content/80 font-bold">
              <tr>
                <th>Product Image</th>
                <th>Title / Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock Availability</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            {/* টেবিল বডি */}
            <tbody className="divide-y divide-base-200">
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-base-200/30 transition-colors"
                >
                  {/* ইমেজ প্রিভিউ */}
                  <td>
                    <div className="avatar">
                      <div className="mask mask-squircle w-12 h-12 bg-base-200">
                        <img
                          src={
                            product.images?.[0] || "https://placehold.co/150"
                          }
                          alt={product.name}
                          className="object-cover"
                        />
                      </div>
                    </div>
                  </td>

                  {/* প্রোডাক্ট নাম */}
                  <td className="font-semibold text-base-content max-w-xs truncate">
                    {product.name}
                  </td>

                  {/* ক্যাটাগরি */}
                  <td>
                    <span className="badge badge-neutral bg-base-200 text-base-content/80 border-none font-medium gap-1">
                      <Layers size={12} />
                      {product.category || "General"}
                    </span>
                  </td>

                  {/* প্রাইস */}
                  <td className="font-bold text-primary">
                    ${product.price.toFixed(2)}
                  </td>

                  {/* স্টক কাউন্ট */}
                  <td>
                    <span
                      className={`font-semibold flex items-center gap-1 ${
                        product.stock < 10
                          ? "text-error"
                          : "text-base-content/70"
                      }`}
                    >
                      <Database size={12} />
                      {product.stock} pcs
                      {product.stock < 10 && product.stock > 0 && (
                        <span className="text-[10px] badge badge-error badge-outline p-1 py-0.5 ml-1">
                          Low Stock
                        </span>
                      )}
                      {product.stock === 0 && (
                        <span className="text-[10px] badge badge-error p-1 py-0.5 ml-1 text-white">
                          Out of Stock
                        </span>
                      )}
                    </span>
                  </td>

                  {/* অ্যাকশন বাটনসমূহ */}
                  <td className="text-right">
                    <div className="flex justify-end gap-2">
                      {/* 🔄 এডিট বাটন: ক্লিক করলে /admin/products/edit/[id] ডাইনামিক রাউটে নিয়ে যাবে */}
                      <Link
                        href={`/admin/products/edit/${product.id}`}
                        className="btn btn-ghost btn-square btn-sm text-info hover:bg-info/10"
                        title="Edit Product Details"
                      >
                        <Edit size={18} />
                      </Link>
                      {/* 🗑️ ডিলিট বাটন */}
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="btn btn-ghost btn-square btn-sm text-error hover:bg-error/10"
                        title="Delete Product"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
