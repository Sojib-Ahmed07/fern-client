"use client";

import { useCartStore } from "@/lib/cart-store";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchProductDetails, postProductComment } from "@/lib/product-api";
import { useSession } from "@/lib/auth-client";
import {
  Star,
  ShoppingCart,
  ArrowLeft,
  Send,
  MessageSquare,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import Link from "next/link";

export default function ProductDetailsPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  // 🔒 Better Auth সেশন এবং Zustand কার্ট অ্যাকশন (সবার উপরে একসাথে রাখা হলো)
  const { data: session } = useSession();
  const addToCart = useCartStore((state) => state.addToCart);

  // ⚙️ স্টেটস
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState("");

  // 💬 কমেন্ট ফর্মের স্টেট
  const [newComment, setNewComment] = useState("");
  const [rating, setRating] = useState(5);
  const [commentSubmitLoading, setCommentSubmitLoading] = useState(false);
  const [commentError, setCommentError] = useState("");

  // 🔄 ডাটা লোডিং ইফেক্ট (React 19 Safe)
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      const data = await fetchProductDetails(id);

      if (isMounted && data.success && data.details) {
        setProduct(data.details);
        setSelectedImage(data.details.images?.[0] || "");
      }

      if (isMounted) setLoading(false);
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [id]);

  // 📝 কমেন্ট সাবমিট হ্যান্ডলার
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setCommentSubmitLoading(true);
    setCommentError("");

    const response = await postProductComment({
      productId: id,
      content: newComment,
      rating: rating,
    });

    if (response.id || response.success) {
      setNewComment("");
      setRating(5);
      // কমেন্ট সফল হলে লাইভ রিফ্রেশ
      const updatedData = await fetchProductDetails(id);
      if (updatedData.success) setProduct(updatedData.details);
    } else {
      setCommentError(
        response.message || "Failed to post comment. Ensure you are logged in.",
      );
    }
    setCommentSubmitLoading(false);
  };

  // 🛒 কার্ট হ্যান্ডলার
  const handleAddToCart = () => {
    if (product.stock <= 0) return;

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image:
        product.images?.[0] ||
        "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=500",
      category: product.category,
      quantity: quantity,
      stock: product.stock,
    });

    alert(`🎉 Added ${quantity}x ${product.name} to your cart successfully!`);
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-sm font-medium text-base-content/60">
          Loading premium product data...
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-error">Product Not Found!</h2>
        <Link
          href="/products"
          className="btn btn-primary btn-sm mt-4 rounded-lg"
        >
          <ArrowLeft size={16} /> Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 lg:px-8 max-w-6xl">
      {/* 🔙 ব্যাক বাটন */}
      <Link
        href="/products"
        className="btn btn-ghost btn-sm gap-2 mb-6 font-medium text-base-content/70"
      >
        <ArrowLeft size={18} /> Back to discover
      </Link>

      {/* 💎 প্রোডাক্ট ইনফো গ্রিড লেআউট */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 bg-base-100 p-6 md:p-8 rounded-3xl shadow-sm border border-base-200">
        {/* 📸 বাম পাশ: ইমেজ গ্যালারি */}
        <div className="space-y-4">
          <div className="w-full h-[350px] md:h-[420px] relative bg-base-200 rounded-2xl overflow-hidden border border-base-200 flex items-center justify-center">
            <img
              src={
                selectedImage ||
                "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=500"
              }
              alt={product.name}
              className="object-cover max-h-full max-w-full"
            />
          </div>
          {/* থাম্বনেইল ইমেজেস */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto py-1">
              {product.images.map((img: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 bg-base-200 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                    selectedImage === img
                      ? "border-primary scale-95"
                      : "border-transparent opacity-70"
                  }`}
                >
                  <img
                    src={img}
                    alt="thumbnail"
                    className="object-cover w-full h-full"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 🏷️ ডান পাশ: ইনফরমেশন ও অ্যাকশন প্যানেল */}
        <div className="flex flex-col justify-between">
          <div className="space-y-4">
            <div className="badge badge-secondary font-semibold tracking-wider text-xs uppercase px-3 py-2.5">
              {product.category}
            </div>
            <h1 className="text-3xl font-extrabold text-base-content tracking-tight">
              {product.name}
            </h1>

            {/* দাম */}
            <div className="text-2xl font-black text-primary">
              ${product.price?.toLocaleString()}
            </div>

            <hr className="border-base-200" />
            <p className="text-sm text-base-content/70 leading-relaxed">
              {product.description}
            </p>

            {/* স্টক স্ট্যাটাস */}
            <div className="text-xs font-semibold flex items-center gap-1.5 mt-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${product.stock > 0 ? "bg-success" : "bg-error"}`}
              ></span>
              {product.stock > 0 ? (
                <span className="text-success-content/80">
                  Available in Stock ({product.stock} units left)
                </span>
              ) : (
                <span className="text-error">Out of Stock</span>
              )}
            </div>
          </div>

          {/* 🛒 কোয়ান্টিটি এবং কার্ট একশন */}
          <div className="mt-8 space-y-4 bg-base-200/40 p-4 rounded-2xl border border-base-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-base-content/70">
                Select Quantity
              </span>
              <div className="join border border-base-300 rounded-lg overflow-hidden bg-base-100">
                <button
                  className="btn btn-sm btn-ghost join-item"
                  onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))}
                  disabled={product.stock <= 0}
                >
                  -
                </button>
                <span className="px-4 py-1.5 font-bold text-sm bg-base-100 flex items-center">
                  {quantity}
                </span>
                <button
                  className="btn btn-sm btn-ghost join-item"
                  onClick={() =>
                    setQuantity((prev) => Math.min(prev + 1, product.stock))
                  }
                  disabled={product.stock <= 0 || quantity >= product.stock}
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="btn btn-primary w-full rounded-xl shadow-md font-bold text-white gap-2"
              disabled={product.stock <= 0}
            >
              <ShoppingCart size={20} /> Add to Shopping Cart
            </button>
          </div>
        </div>
      </div>

      {/* 💬 রিভিউ এবং কমেন্ট সেকশন লেআউট */}
      <div className="mt-12 bg-base-100 p-6 md:p-8 rounded-3xl shadow-sm border border-base-200">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-base-content">
          <MessageSquare className="w-5 h-5 text-primary" />
          Customer Reviews ({product.comments?.length || 0})
        </h2>

        {/* 📝 নতুন কমেন্ট লেখার ফর্ম */}
        {session?.user ? (
          <form
            onSubmit={handleCommentSubmit}
            className="mb-8 p-4 bg-base-200/30 border border-base-200 rounded-2xl space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-sm font-semibold text-base-content/80">
                Share your experience:
              </span>

              {/* ৫-স্টার সিলেকশন বাটন */}
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    className="focus:outline-none transition-transform active:scale-90"
                  >
                    <Star
                      className={`w-5 h-5 ${star <= rating ? "fill-warning text-warning" : "text-base-content/20"}`}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-warning ml-1">
                  ({rating}/5)
                </span>
              </div>
            </div>

            {commentError && (
              <div className="text-xs text-error font-medium">
                {commentError}
              </div>
            )}

            <div className="relative">
              <textarea
                placeholder="Write your review here... How is the quality? Packaging? Delivery speed?"
                className="textarea textarea-bordered w-full pr-12 focus:textarea-primary min-h-[80px] rounded-xl text-sm"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                maxLength={500}
                required
              />
              <button
                type="submit"
                className="btn btn-primary btn-circle btn-sm absolute right-3 bottom-3 shadow-md"
                disabled={commentSubmitLoading || !newComment.trim()}
              >
                {commentSubmitLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send size={14} className="text-white" />
                )}
              </button>
            </div>
          </form>
        ) : (
          /* 🔑 কাস্টমার লগইন না থাকলে ওয়ার্নিং ব্যানার */
          <div className="alert bg-base-200 border-dashed border-base-300 text-sm rounded-2xl mb-8 flex items-center justify-between">
            <span className="text-base-content/60">
              You must be logged in to leave a review for this product.
            </span>
            <Link
              href="/auth/login"
              className="btn btn-sm btn-primary rounded-lg text-white"
            >
              Sign In Now
            </Link>
          </div>
        )}

        {/* 📃 কমেন্ট লিস্ট ডিসপ্লে */}
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
          {!product.comments || product.comments.length === 0 ? (
            <p className="text-sm text-base-content/40 text-center py-6 border border-dashed border-base-200 rounded-xl">
              No reviews yet for this product. Be the first one to share your
              thoughts!
            </p>
          ) : (
            product.comments.map((comment: any) => (
              <div
                key={comment.id}
                className="p-4 bg-base-200/20 border border-base-200 rounded-2xl space-y-2 hover:bg-base-200/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  {/* ইউজার ইনফো */}
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-neutral text-neutral-content flex items-center justify-center font-bold text-xs uppercase">
                      {comment.user?.name?.substring(0, 2) || "UR"}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-base-content flex items-center gap-1">
                        {comment.user?.name || "Anonymous Buyer"}
                        <ShieldCheck className="w-3.5 h-3.5 text-success" />
                      </h4>
                      <span className="text-[10px] text-base-content/40 block">
                        {new Date(comment.createdAt).toLocaleDateString(
                          "en-US",
                          { year: "numeric", month: "short", day: "numeric" },
                        )}
                      </span>
                    </div>
                  </div>

                  {/* গিভেন রেটিং স্টার */}
                  <div className="flex items-center gap-0.5 bg-warning/10 px-2 py-0.5 rounded-full border border-warning/20">
                    <Star className="w-3.5 h-3.5 fill-warning text-warning" />
                    <span className="text-xs font-bold text-warning">
                      {comment.rating}
                    </span>
                  </div>
                </div>

                {/* কমেন্ট কন্টেন্ট */}
                <p className="text-sm text-base-content/80 pl-10 leading-relaxed">
                  {comment.content}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
