"use client";

import React, { useEffect, useState } from "react";
import { Users, Shield, Trash2, UserX, Calendar, Mail } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  image?: string;
  createdAt: string;
}

function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // 📡 ১. ব্যাকঅ্যান্ড থেকে ইউজার লিস্ট লোড করা
  const fetchUsers = async () => {
    try {
      const res = await fetch("${process.env.BACKEND_URL}/api/users", {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setUsers(data.users);
      } else {
        alert(data.message || "Failed to load users.");
      }
    } catch (error) {
      console.error("Error loading users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchUsers();
    };
    loadData();
  }, []);

  // 🔄 ২. ইউজারের রোল পরিবর্তন করা (USER <-> ADMIN)
  const handleRoleChange = async (id: string, newRole: "USER" | "ADMIN") => {
    setUpdatingId(id);
    try {
      const res = await fetch(`${process.env.BACKEND_URL}/api/users/${id}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ role: newRole }),
      });
      const data = await res.json();

      if (data.success) {
        alert(`User role successfully updated to ${newRole}! 🔄`);
        // স্টেট আপডেট করা যাতে রিলোড ছাড়াই ইন্টারফেস চেঞ্জ হয়
        setUsers((prev) =>
          prev.map((u) => (u.id === id ? { ...u, role: newRole } : u)),
        );
      } else {
        alert(data.message || "Failed to update role");
      }
    } catch (error) {
      console.error("Role update error:", error);
      alert("Something went wrong!");
    } finally {
      setUpdatingId(null);
    }
  };

  // 🗑️ ৩. কোনো ইউজার অ্যাকাউন্ট ডিলিট করা
  const handleDeleteUser = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this user? This action cannot be undone! ⚠️",
      )
    )
      return;

    try {
      const res = await fetch(`${process.env.BACKEND_URL}/api/users/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();

      if (data.success) {
        alert("User account removed successfully! 🗑️");
        setUsers((prev) => prev.filter((u) => u.id !== id));
      } else {
        alert(data.message || "Failed to delete user.");
      }
    } catch (error) {
      console.error("Delete user error:", error);
      alert("Something went wrong!");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <span className="loading loading-spinner loading-md text-primary"></span>
        <span className="ml-2 font-medium">Loading User Directory...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      {/* হেডার সেকশন */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-primary/10 text-primary rounded-xl">
          <Users size={28} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-base-content">
            User Directory Management
          </h1>
          <p className="text-xs text-base-content/60">
            Control user permissions, roles, and administrative access
          </p>
        </div>
      </div>

      {users.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-base-300 rounded-2xl bg-base-100 opacity-75">
          <UserX size={48} className="mx-auto text-base-content/30 mb-2" />
          <p className="font-medium text-base-content/60">
            No users registered yet.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-base-200 rounded-2xl shadow-sm bg-base-100">
          <table className="table w-full text-sm">
            {/* টেবিল হেডার */}
            <thead className="bg-base-200/50 text-base-content/80 font-bold">
              <tr>
                <th>Customer Name</th>
                <th>Email Address</th>
                <th>Access Level</th>
                <th>Joined Date</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            {/* টেবিল বডি */}
            <tbody className="divide-y divide-base-200">
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-base-200/30 transition-colors"
                >
                  {/* ইউজার প্রোফাইল ও নাম */}
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="w-10 h-10 rounded-full bg-base-300">
                          <img
                            src={
                              user.image ||
                              `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`
                            }
                            alt={user.name}
                          />
                        </div>
                      </div>
                      <div className="font-semibold text-base-content">
                        {user.name}
                      </div>
                    </div>
                  </td>

                  {/* ইমেইল */}
                  <td className="text-base-content/70">
                    <span className="flex items-center gap-1.5">
                      <Mail size={14} className="opacity-40" />
                      {user.email}
                    </span>
                  </td>

                  {/* রোল সিলেকশন ড্রপডাউন */}
                  <td>
                    <select
                      disabled={updatingId === user.id}
                      value={user.role}
                      onChange={(e) =>
                        handleRoleChange(
                          user.id,
                          e.target.value as "USER" | "ADMIN",
                        )
                      }
                      className={`select select-bordered select-xs font-semibold rounded-lg focus:outline-none transition-all ${
                        user.role === "ADMIN"
                          ? "select-primary text-primary bg-primary/5"
                          : "text-base-content/75"
                      }`}
                    >
                      <option value="USER">USER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </td>

                  {/* জয়েন করার ডেট */}
                  <td className="text-xs text-base-content/60">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} className="opacity-40" />
                      {new Date(user.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </td>

                  {/* অ্যাকশন বাটনসমূহ */}
                  <td className="text-right">
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="btn btn-ghost btn-square btn-sm text-error hover:bg-error/10"
                      title="Delete User Account"
                    >
                      <Trash2 size={18} />
                    </button>
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

export default AdminUsersPage;
