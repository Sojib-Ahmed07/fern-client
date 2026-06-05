"use client";

import React, { useEffect, useState } from "react";
import {
  Package,
  ShieldAlert,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
} from "lucide-react";

function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // 🔄 ১. সমস্ত কাস্টমারের অর্ডার লোড করা
  useEffect(() => {
    fetch("${process.env.BACKEND_URL}/api/admin/orders", {
      credentials: "include", // অ্যাডমিন কুকি সেশন পাস করার জন্য
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setOrders(data.orders);
        } else {
          alert(data.message || "Failed to load admin orders.");
        }
      })
      .catch((err) => console.error("Admin Fetch Error:", err))
      .finally(() => setLoading(false));
  }, []);

  // 🔄 ২. অ্যাডমিন দ্বারা অর্ডার স্ট্যাটাস আপডেট করা
  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const response = await fetch(
        `${process.env.BACKEND_URL}/api/admin/orders/${orderId}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ status: newStatus }),
        },
      );

      const data = await response.json();

      if (data.success) {
        alert(`Status successfully updated to ${newStatus}`);
        // লোকাল স্টেট আপডেট করা যাতে পেজ রিফ্রেশ ছাড়া চেঞ্জ দেখা যায়
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId ? { ...order, status: newStatus } : order,
          ),
        );
      } else {
        alert(data.message || "Failed to update status.");
      }
    } catch (error) {
      console.error("Status Update Error:", error);
      alert("Something went wrong!");
    } finally {
      setUpdatingId(null);
    }
  };

  // 🎨 স্ট্যাটাস অনুযায়ী ব্যাজের রঙ নির্ধারণের হেল্পার ফাংশন
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="badge badge-warning font-semibold gap-1">
            <Clock size={12} /> PENDING
          </span>
        );
      case "SHIPPED":
        return (
          <span className="badge badge-info text-white font-semibold gap-1">
            <Truck size={12} /> SHIPPED
          </span>
        );
      case "DELIVERED":
        return (
          <span className="badge badge-success text-white font-semibold gap-1">
            <CheckCircle size={12} /> DELIVERED
          </span>
        );
      case "CANCELLED":
        return (
          <span className="badge badge-error text-white font-semibold gap-1">
            <XCircle size={12} /> CANCELLED
          </span>
        );
      default:
        return (
          <span className="badge badge-ghost font-semibold">{status}</span>
        );
    }
  };

  if (loading)
    return (
      <div className="text-center py-20 font-medium">
        Loading Admin Console...
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-primary/10 text-primary rounded-xl">
          <ShieldAlert size={28} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-base-content">
            Admin Order Management
          </h1>
          <p className="text-xs text-base-content/60">
            Manage customer orders and tracking status
          </p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16 border rounded-2xl opacity-60 bg-base-100">
          No orders placed by any customer yet.
        </div>
      ) : (
        <div className="overflow-x-auto border border-base-200 rounded-2xl shadow-sm bg-base-100">
          <table className="table w-full">
            {/* টেবিল হেডার */}
            <thead className="bg-base-200/50">
              <tr>
                <th>Transaction & Date</th>
                <th>Customer Info</th>
                <th>Ordered Items</th>
                <th>Total Amount</th>
                <th>Current Status</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            {/* টেবিল বডি */}
            <tbody className="divide-y divide-base-200">
              {orders.map((order: any) => (
                <tr
                  key={order.id}
                  className="hover:bg-base-200/30 transition-colors"
                >
                  {/* ট্রানজেকশন আইডি ও ডেট */}
                  <td>
                    <span className="font-mono text-xs font-bold block text-primary">
                      {order.transactionId}
                    </span>
                    <span className="text-[11px] opacity-60">
                      {new Date(order.createdAt).toLocaleString()}
                    </span>
                  </td>

                  {/* কাস্টমার ডিটেইলস */}
                  <td>
                    <p className="font-semibold text-sm">
                      {order.user?.name || "Unknown User"}
                    </p>
                    <p className="text-xs opacity-60">{order.user?.email}</p>
                  </td>

                  {/* প্রোডাক্ট আইটেমস */}
                  <td>
                    <div className="space-y-1 max-w-[220px]">
                      {order.items?.map((item: any, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-center gap-1.5 text-xs text-base-content/80"
                        >
                          <Package
                            size={12}
                            className="text-base-content/40 shrink-0"
                          />
                          <span className="truncate">{item.product?.name}</span>
                          <span className="font-mono text-primary font-medium">
                            x{item.quantity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </td>

                  {/* টোটাল প্রাইস */}
                  <td className="font-bold text-sm text-base-content">
                    ${order.totalAmount.toLocaleString()}
                  </td>

                  {/* কারেন্ট স্ট্যাটাস ব্যাজ */}
                  <td>{getStatusBadge(order.status)}</td>

                  {/* অ্যাকশন ড্রপডাউন কন্ট্রোলার */}
                  <td className="text-center">
                    <select
                      disabled={updatingId === order.id}
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order.id, e.target.value)
                      }
                      className="select select-bordered select-xs font-semibold max-w-xs focus:outline-none"
                    >
                      <option value="PENDING">Set PENDING</option>
                      <option value="SHIPPED">Set SHIPPED</option>
                      <option value="DELIVERED">Set DELIVERED</option>
                      <option value="CANCELLED">Set CANCELLED</option>
                    </select>
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

export default AdminOrdersPage;
