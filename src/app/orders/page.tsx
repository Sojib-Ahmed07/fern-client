"use client";

import React, { useEffect, useState } from "react";
import { Package, XCircle } from "lucide-react";

function MyOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("${process.env.BACKEND_URL}/api/orders/my-orders", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          // ব্যাকঅ্যান্ড থেকেই ফিল্টার হয়ে আসছে, তাই সরাসরি সেট করে দিন
          setOrders(data.orders);
        }
      })
      .catch((err) => console.error("Error fetching orders:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm("Are you sure you want to cancel this order?")) return;

    try {
      const response = await fetch(
        `${process.env.BACKEND_URL}/api/orders/${orderId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ status: "CANCELLED" }),
        },
      );

      const data = await response.json();

      if (data.success) {
        alert("Order cancelled successfully!");
        // ✨ জাদুকরী লাইন: ক্যানসেল সফল হওয়া মাত্রই ফ্রন্টঅ্যান্ড স্টেট থেকে এটিকে হাওয়া করে দেবে
        setOrders((currentOrders) =>
          currentOrders.filter((item) => item.id !== orderId),
        );
      } else {
        alert(data.message || "Failed to cancel order.");
      }
    } catch (error) {
      console.error("Cancel Error:", error);
      alert("Something went wrong while cancelling the order.");
    }
  };

  if (loading)
    return <div className="text-center py-20">Loading orders...</div>;

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-10 border rounded-2xl opacity-60">
          No active orders found.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order: any) => {
            // শুধুমাত্র PENDING হলে ক্যানসেল করা যাবে
            const canCancel = order.status === "PENDING";

            return (
              <div
                key={order.id}
                className="bg-base-100 p-5 rounded-2xl border border-base-200 shadow-sm"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="font-bold text-sm">
                      Transaction: {order.transactionId}
                    </p>
                    <p className="text-xs text-base-content/60">
                      Placed: {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`badge font-semibold ${
                      order.status === "PENDING"
                        ? "badge-warning"
                        : "badge-info text-white"
                    }`}
                  >
                    {order.status === "SHIPPED"
                      ? "🚚 OUT FOR SHIPPING"
                      : order.status}
                  </span>
                </div>

                <div className="my-4 space-y-2 border-t pt-4">
                  {order.items?.length > 0 ? (
                    order.items.map((item: any, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-center gap-4 text-sm"
                      >
                        <Package size={16} className="text-primary" />
                        <span>{item.product?.name || "Product"}</span>
                        <span className="ml-auto font-mono">
                          x {item.quantity}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs opacity-50">No items available</p>
                  )}
                </div>

                <div className="flex justify-between items-center mt-4 border-t pt-4">
                  <p className="font-bold">
                    Total: ${order.totalAmount.toLocaleString()}
                  </p>

                  {canCancel ? (
                    <button
                      onClick={() => handleCancelOrder(order.id)}
                      className="btn btn-error btn-sm text-white font-bold"
                    >
                      <XCircle size={16} /> Cancel Order
                    </button>
                  ) : (
                    <span className="text-xs text-error font-medium bg-error/10 px-3 py-1.5 rounded-lg">
                      In Transit / Not Cancellable
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MyOrdersPage;
