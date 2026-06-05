"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import {
  Edit3,
  ArrowLeft,
  Package,
  DollarSign,
  Layers,
  Database,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";

interface EditProductProps {
  params: Promise<{ id: string }>;
}

export default function EditProductPage({ params }: EditProductProps) {
  const router = useRouter();
  // 🎯 Next.js-এর নিয়ম অনুযায়ী async params আনল্যাপ করা
  const resolvedParams = use(params);
  const productId = resolvedParams.id;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // 📋 ফর্ম স্টেট
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
  });

  // 📡 ১. কারেন্ট প্রোডাক্টের ডাটা ব্যাকঅ্যান্ড থেকে লোড করা (Safe Effect)
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const res = await fetch(
          `${process.env.BACKEND_URL}/api/products/${productId}`,
          {
            credentials: "include",
          },
        );
        const data = await res.json();

        if (data.success && data.product) {
          const p = data.product;
          setFormData({
            name: p.name || "",
            description: p.description || "",
            price: p.price?.toString() || "",
            stock: p.stock?.toString() || "",
            category: p.category || "",
          });
          if (p.images && p.images.length > 0) {
            setImagePreview(p.images[0]); // আগের আপলোড করা ইমেজ প্রিভিউতে দেখানো
          }
        } else {
          alert("Product not found!");
          router.push("/admin/products");
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
      } finally {
        setFetching(false);
      }
    };

    fetchProductDetails();
  }, [productId, router]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 📸 নতুন ইমেজ সিলেক্ট ও চেঞ্জ হ্যান্ডলার
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file)); // নতুন ইমেজের ইনস্ট্যান্ট প্রিভিউ
    }
  };

  // 📡 ২. আপডেট হওয়া ডেটা সাবমিট করা
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.stock) {
      alert("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    try {
      const dataToSend = new FormData();
      dataToSend.append("name", formData.name);
      dataToSend.append("description", formData.description);
      dataToSend.append("price", formData.price);
      dataToSend.append("stock", formData.stock);
      dataToSend.append("category", formData.category);

      // অ্যাডমিন যদি নতুন ছবি সিলেক্ট করে থাকে, তবেই ফর্মে ফাইল পাঠানো হবে
      if (imageFile) {
        dataToSend.append("image", imageFile);
      }

      const response = await fetch(
        `${process.env.BACKEND_URL}/api/products/${productId}`,
        {
          method: "PATCH", // ব্যাকঅ্যান্ডের আপডেটের জন্য PATCH মেথড
          credentials: "include",
          body: dataToSend, // হেডার্স দেওয়ার দরকার নেই, ব্রাউজার নিজেই বাউন্ডারি নিয়ে নেবে
        },
      );

      const data = await response.json();

      if (response.ok || data.success) {
        alert("Product updated successfully! 🔄🎉");
        router.push("/admin/products");
      } else {
        alert(data.message || "Failed to update product.");
      }
    } catch (error) {
      console.error("Update Product Error:", error);
      alert("Something went wrong while updating the product.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex justify-center items-center h-96">
        <span className="loading loading-spinner loading-md text-primary"></span>
        <span className="ml-2 font-medium">Loading Product Data...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl">
      <button
        onClick={() => router.push("/admin/products")}
        className="btn btn-ghost btn-sm gap-2 mb-6 normal-case text-base-content/70"
      >
        <ArrowLeft size={16} /> Back to Inventory
      </button>

      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-info/10 text-info rounded-xl">
          <Edit3 size={28} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-base-content">Edit Product</h1>
          <p className="text-xs text-base-content/60">
            Modify details or replace product images securely via Cloudinary
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="card bg-base-100 border border-base-200 shadow-sm p-6 space-y-5 rounded-2xl"
      >
        {/* প্রোডাক্ট নাম */}
        <div className="form-control w-full">
          <label className="label font-semibold text-sm">Product Title *</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-base-content/40">
              <Package size={18} />
            </span>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Product Title"
              className="input input-bordered w-full pl-10 focus:outline-none focus:border-primary text-sm"
              required
            />
          </div>
        </div>

        {/* প্রাইস ও স্টক */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-control w-full">
            <label className="label font-semibold text-sm">Price ($) *</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-base-content/40">
                <DollarSign size={18} />
              </span>
              <input
                type="number"
                name="price"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                placeholder="99.99"
                className="input input-bordered w-full pl-10 focus:outline-none focus:border-primary text-sm"
                required
              />
            </div>
          </div>

          <div className="form-control w-full">
            <label className="label font-semibold text-sm">
              Stock Quantity *
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-base-content/40">
                <Database size={18} />
              </span>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="50"
                className="input input-bordered w-full pl-10 focus:outline-none focus:border-primary text-sm"
                required
              />
            </div>
          </div>
        </div>

        {/* ক্যাটাগরি */}
        <div className="form-control w-full">
          <label className="label font-semibold text-sm">Category</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-base-content/40">
              <Layers size={18} />
            </span>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="select select-bordered w-full pl-10 focus:outline-none focus:border-primary text-sm font-normal"
            >
              <option value="">Select Category</option>
              <option value="Electronics">Electronics</option>
              <option value="Clothing">Clothing</option>
              <option value="Gadgets">Gadgets</option>
              <option value="Home Decor">Home Decor</option>
            </select>
          </div>
        </div>

        {/* 📸 ইমেজ মডিফায়ার ফিল্ড */}
        <div className="form-control w-full">
          <label className="label font-semibold text-sm">
            Product Image (Keep empty to preserve original)
          </label>
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-base-300 rounded-xl p-4 bg-base-50 hover:bg-base-100/50 transition-all relative group">
            {imagePreview ? (
              <div className="relative w-full h-40 rounded-lg overflow-hidden">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-contain"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview(null);
                  }}
                  className="absolute top-2 right-2 bg-error text-white btn btn-circle btn-xs border-none"
                >
                  ✕
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-32 cursor-pointer">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <ImageIcon size={32} className="text-base-content/40 mb-2" />
                  <p className="text-sm text-base-content/70 font-medium">
                    Click to upload new image
                  </p>
                  <p className="text-xs text-base-content/40 mt-1">
                    Leave blank to keep old image
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {/* ডেসক্রিপশন */}
        <div className="form-control w-full">
          <label className="label font-semibold text-sm">
            Product Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Product specifications..."
            className="textarea textarea-bordered w-full h-24 focus:outline-none focus:border-primary text-sm p-3"
          />
        </div>

        {/* সাবমিট বোতাম */}
        <button
          type="submit"
          disabled={loading}
          className="btn btn-info w-full mt-4 text-white font-bold normal-case"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin w-5 h-5 mr-2" /> Updating
              Inventory...
            </>
          ) : (
            "Save Changes"
          )}
        </button>
      </form>
    </div>
  );
}
