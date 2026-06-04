import { create } from "zustand";
import { persist } from "zustand/middleware";

// 📝 টাইপ ডেফিনিশনস
export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  quantity: number;
  stock: number;
}

interface CartState {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

// 🛒 Zustand Store
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      // ১. কার্টে আইটেম যোগ করা (অলরেডি থাকলে কোয়ান্টিটি বাড়িয়ে দেবে)
      addToCart: (newItem) =>
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.id === newItem.id,
          );

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.id === newItem.id
                  ? {
                      ...item,
                      quantity: Math.min(
                        item.quantity + newItem.quantity,
                        item.stock,
                      ),
                    }
                  : item,
              ),
            };
          }
          return { items: [...state.items, newItem] };
        }),

      // ২. কার্ট থেকে আইটেম রিমুভ করা
      removeFromCart: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),

      // ৩. কার্টের ভেতরের কোয়ান্টিটি আপডেট করা
      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? {
                  ...item,
                  quantity: Math.min(Math.max(quantity, 1), item.stock),
                }
              : item,
          ),
        })),

      // ৪. পুরো কার্ট খালি করা
      clearCart: () => set({ items: [] }),

      // 🔢 ৫. টোটাল আইটেম কাউন্ট হিসেব করা (নেভবারের জন্য)
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      // 💰 ৬. মোট টাকার পরিমাণ হিসেব করা
      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0,
        );
      },
    }),
    {
      name: "fern-shopping-cart", // লোকালস্টোরেজ কী (Key) নাম
    },
  ),
);
