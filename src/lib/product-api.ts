export interface FetchProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
}

export async function fetchAllProducts({
  page = 1,
  limit = 8,
  search = "",
  category = "",
}: FetchProductsParams) {
  try {
    // ডাইনামিক কোয়েরি ইউআরএল তৈরি
    const query = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
      ...(category && { category }),
    });

    const res = await fetch(
      `${process.env.BACKEND_URL}/api/products?${query.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      },
    );

    if (!res.ok) {
      throw new Error("Failed to fetch products");
    }

    return await res.json();
  } catch (error) {
    console.error("❌ fetchAllProducts Error:", error);
    return {
      success: false,
      products: [],
      meta: { totalPages: 1, currentPage: 1 },
    };
  }
}

// 🔍 ১. একটি সিঙ্গেল প্রোডাক্টের ফুল রিলেশনাল ডিটেইলস (With Comments) আনা
export async function fetchProductDetails(id: string) {
  try {
    const res = await fetch(
      `${process.env.BACKEND_URL}/api/products/${id}/details`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      },
    );
    if (!res.ok) throw new Error("Product not found");
    return await res.json();
  } catch (error) {
    console.error("❌ fetchProductDetails Error:", error);
    return { success: false, details: null };
  }
}

// 💬 ২. নতুন কমেন্ট এবং রেটিং পোস্ট করার ফাংশন
export async function postProductComment(commentData: {
  productId: string;
  content: string;
  rating: number;
}) {
  try {
    const res = await fetch(`${process.env.BACKEND_URL}/api/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // 🔑 এটি অত্যন্ত গুরুত্বপূর্ণ! ব্রাউজারের সেশন কুকি ব্যাকঅ্যান্ডে পাস করার জন্য
      credentials: "include",
      body: JSON.stringify(commentData),
    });
    return await res.json();
  } catch (error) {
    console.error("❌ postProductComment Error:", error);
    return { success: false, message: "Network error occurred." };
  }
}
