"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  PlusCircle,
  ArrowLeft,
  Package,
  DollarSign,
  Layers,
  Database,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";

function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 📸 ইমেজ সিলেক্ট ও প্রিভিউ হ্যান্ডলার
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file)); // ব্রাউজারে ইনস্ট্যান্ট প্রিভিউ দেখানোর জন্য
    }
  };

  // 📡 ব্যাকঅ্যান্ডে ডেটা সাবমিট করা
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.stock || !imageFile) {
      alert("Please fill in all required fields and select an image.");
      return;
    }

    setLoading(true);

    try {
      // 🚀 ফাইল আপলোডের জন্য FormData ব্যবহার করতে হবে
      const dataToSend = new FormData();
      dataToSend.append("name", formData.name);
      dataToSend.append("description", formData.description);
      dataToSend.append("price", formData.price);
      dataToSend.append("stock", formData.stock);
      dataToSend.append("category", formData.category);
      dataToSend.append("image", imageFile); // 'image' কি-টি ব্যাকঅ্যান্ডের upload.single("image") এর সাথে মিলতে হবে

      const response = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        credentials: "include", // কুকি সেশন পাস করার জন্য
        body: dataToSend, // ⚠️ এখানে Headers-এ Content-Type দেওয়ার প্রয়োজন নেই, ব্রাউজার নিজেই FormData-এর জন্য বাউন্ডারি সেট করে নেবে।
      });

      const data = await response.json();

      if (response.ok || data.success) {
        alert("Product added successfully! 🎉");
        setFormData({
          name: "",
          description: "",
          price: "",
          stock: "",
          category: "",
        });
        setImageFile(null);
        setImagePreview(null);
        router.push("/admin/products");
      } else {
        alert(data.message || "Failed to add product.");
      }
    } catch (error) {
      console.error("Add Product Error:", error);
      alert("Something went wrong while adding the product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl">
      <button
        onClick={() => router.back()}
        className="btn btn-ghost btn-sm gap-2 mb-6 normal-case text-base-content/70"
      >
        <ArrowLeft size={16} /> Back to Products
      </button>

      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-primary/10 text-primary rounded-xl">
          <PlusCircle size={28} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-base-content">
            Add New Product
          </h1>
          <p className="text-xs text-base-content/60">
            Upload a new product with images directly to Cloudinary
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
              placeholder="e.g., Premium Wireless Headphones"
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

        {/* 📸 নতুন প্রফেশনাল ইমেজ আপলোডার ফিল্ড */}
        <div className="form-control w-full">
          <label className="label font-semibold text-sm">Product Image *</label>
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
                    Click to upload product image
                  </p>
                  <p className="text-xs text-base-content/40 mt-1">
                    Supports PNG, JPG, JPEG (Max 5MB)
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
            placeholder="Write detailed specifications of the product..."
            className="textarea textarea-bordered w-full h-24 focus:outline-none focus:border-primary text-sm p-3"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full mt-4 text-white font-bold normal-case"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin w-5 h-5 mr-2" /> Uploading to
              Cloudinary...
            </>
          ) : (
            "Publish Product"
          )}
        </button>
      </form>
    </div>
  );
}

export default AddProductPage;
