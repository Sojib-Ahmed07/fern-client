"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  DollarSign,
  ShoppingBag,
  Package,
  Users,
  ArrowRight,
  TrendingUp,
  Clock,
} from "lucide-react";

interface DashboardData {
  stats: {
    totalSales: number;
    totalOrders: number;
    totalProducts: number;
    totalUsers: number;
  };
  recentOrders: any[];
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("${process.env.BACKEND_URL}/api/admin/dashboard-stats", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success) setData(resData);
      })
      .catch((err) => console.error("Dashboard fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  const stats = data?.stats;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* হেডার */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-base-content flex items-center gap-2">
          <TrendingUp className="text-primary" /> Admin Overview
        </h1>
        <p className="text-xs text-base-content/60 mt-1">
          Welcome back! Here is a real-time summary of your stores business
          metrics.
        </p>
      </div>

      {/* 📊 স্ট্যাটস গ্রিড কার্ডস */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {/* মোট সেলস */}
        <div className="card bg-base-100 border border-base-200 shadow-sm rounded-2xl hover:shadow-md transition-all">
          <div className="card-body p-6 flex flex-row items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-base-content/50 uppercase tracking-wider">
                Total Revenue
              </p>
              <h3 className="text-2xl font-bold mt-1 text-base-content">
                ${stats?.totalSales.toLocaleString()}
              </h3>
            </div>
            <div className="p-3 bg-success/10 text-success rounded-xl">
              <DollarSign size={24} />
            </div>
          </div>
        </div>

        {/* মোট অর্ডার */}
        <Link
          href="/admin/orders"
          className="card bg-base-100 border border-base-200 shadow-sm rounded-2xl hover:border-primary/40 hover:shadow-md transition-all"
        >
          <div className="card-body p-6 flex flex-row items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-base-content/50 uppercase tracking-wider">
                Total Orders
              </p>
              <h3 className="text-2xl font-bold mt-1 text-base-content">
                {stats?.totalOrders}
              </h3>
            </div>
            <div className="p-3 bg-primary/10 text-primary rounded-xl">
              <ShoppingBag size={24} />
            </div>
          </div>
        </Link>

        {/* মোট প্রোডাক্ট */}
        <Link
          href="/admin/products"
          className="card bg-base-100 border border-base-200 shadow-sm rounded-2xl hover:border-primary/40 hover:shadow-md transition-all"
        >
          <div className="card-body p-6 flex flex-row items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-base-content/50 uppercase tracking-wider">
                Active Products
              </p>
              <h3 className="text-2xl font-bold mt-1 text-base-content">
                {stats?.totalProducts}
              </h3>
            </div>
            <div className="p-3 bg-info/10 text-info rounded-xl">
              <Package size={24} />
            </div>
          </div>
        </Link>

        {/* মোট কাস্টমার */}
        <Link
          href="/admin/users"
          className="card bg-base-100 border border-base-200 shadow-sm rounded-2xl hover:border-primary/40 hover:shadow-md transition-all"
        >
          <div className="card-body p-6 flex flex-row items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-base-content/50 uppercase tracking-wider">
                Registered Users
              </p>
              <h3 className="text-2xl font-bold mt-1 text-base-content">
                {stats?.totalUsers}
              </h3>
            </div>
            <div className="p-3 bg-warning/10 text-warning rounded-xl">
              <Users size={24} />
            </div>
          </div>
        </Link>
      </div>

      {/* 🕒 সাম্প্রতিক অর্ডার টেবিল সেকশন */}
      <div className="card bg-base-100 border border-base-200 shadow-sm rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-base-200 flex justify-between items-center bg-base-200/20">
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-primary" />
            <h2 className="text-lg font-bold text-base-content">
              Recent Customer Orders
            </h2>
          </div>
          <Link
            href="/admin/orders"
            className="btn btn-ghost btn-xs text-primary font-semibold gap-1 normal-case"
          >
            View All <ArrowRight size={14} />
          </Link>
        </div>

        {data?.recentOrders.length === 0 ? (
          <div className="p-10 text-center text-sm text-base-content/50">
            No recent orders found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full text-sm">
              <thead className="bg-base-200/30 text-base-content/70">
                <tr>
                  <th>Transaction ID</th>
                  <th>Customer</th>
                  <th>Total Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {data?.recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-base-200/20 transition-all"
                  >
                    <td className="font-mono text-xs font-bold text-primary">
                      {order.transactionId}
                    </td>
                    <td>
                      <p className="font-semibold">
                        {order.user?.name || "Guest"}
                      </p>
                      <p className="text-xs opacity-50">{order.user?.email}</p>
                    </td>
                    <td className="font-bold">
                      ${order.totalAmount.toLocaleString()}
                    </td>
                    <td>
                      <span
                        className={`badge badge-sm font-semibold text-xs ${
                          order.status === "DELIVERED"
                            ? "badge-success text-white"
                            : order.status === "SHIPPED"
                              ? "badge-info text-white"
                              : order.status === "PENDING"
                                ? "badge-warning"
                                : "badge-error text-white"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="text-xs text-base-content/60">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
