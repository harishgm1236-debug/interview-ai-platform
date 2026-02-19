"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  FiUsers, FiActivity, FiCheckCircle, FiTrendingUp, 
  FiArrowLeft, FiSearch, FiTrash2 
} from "react-icons/fi";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from "recharts";
import { getAdminDashboard, getAdminUsers } from "@/lib/api";
import toast from "react-hot-toast";
import type { 
  AdminDashboard, User, DomainStat, InterviewRecord 
} from "@/lib/types";

// --- Local Types for Admin Page ---

interface AdminChartData {
  name: string;
  value: number;
}

// Extend DomainStat to handle potential MongoDB raw output (_id)
interface RawDomainStat extends DomainStat {
  _id?: string;
}

// Extend InterviewRecord because Admin API populates the 'user' field
interface PopulatedInterview extends Omit<InterviewRecord, "user"> {
  user: User | string; // Can be an ID string or a User object
}

interface ExtendedAdminDashboard extends Omit<AdminDashboard, "recentInterviews" | "domainStats"> {
  recentInterviews: PopulatedInterview[];
  domainStats: RawDomainStat[];
}

// Type Guard to check if user is an object
function isUserObject(user: User | string): user is User {
  return typeof user === "object" && user !== null && "name" in user;
}

export default function AdminPage() {
  const router = useRouter();
  
  const [isMounted, setIsMounted] = useState(false);
  const [stats, setStats] = useState<ExtendedAdminDashboard | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadData = useCallback(async () => {
    try {
      const [dashData, usersData] = await Promise.all([
        getAdminDashboard(),
        getAdminUsers()
      ]);
      // Cast the response to our extended type
      setStats(dashData as unknown as ExtendedAdminDashboard);
      setUsers(usersData.users);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to load admin data";
      console.error(message);
      toast.error("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
      return;
    }
    
    try {
      const user: User = JSON.parse(userData);
      if (user.role !== "admin") {
        toast.error("⛔ Access Denied: Admins Only");
        router.push("/dashboard");
        return;
      }
      loadData();
    } catch {
      router.push("/login");
    }
  }, [isMounted, router, loadData]);

  if (!isMounted) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center text-white">
        <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      </div>
    );
  }

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  // Safe mapping with proper types
  const domainData: AdminChartData[] = stats?.domainStats?.map((d: RawDomainStat) => {
    // Handle both 'domain' and '_id' properties safely
    const rawName = d.domain || d._id || "Unknown";
    return {
      name: String(rawName).replace("_", " ").toUpperCase(),
      value: d.count
    };
  }) || [];

  const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ec4899", "#06b6d4"];

  return (
    <div className="min-h-screen bg-dark-950 text-white relative">
      <div className="fixed inset-0 particles-bg opacity-10" />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-8 py-5 border-b border-dark-800 bg-dark-900/50 backdrop-blur">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push("/dashboard")} className="p-2 hover:bg-dark-800 rounded-lg transition">
            <FiArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold gradient-text">Admin Dashboard</h1>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-bold uppercase">
          SUPER ADMIN
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-8 py-10 space-y-8">
        
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: "Total Users", value: stats?.totalUsers || 0, icon: FiUsers, color: "bg-blue-500" },
            { label: "Total Interviews", value: stats?.totalInterviews || 0, icon: FiActivity, color: "bg-purple-500" },
            { label: "Avg Platform Score", value: `${Math.round(stats?.averageScore || 0)}%`, icon: FiTrendingUp, color: "bg-green-500" },
            { label: "Active Today", value: "12", icon: FiCheckCircle, color: "bg-orange-500" },
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6 flex items-center gap-4"
            >
              <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center shadow-lg`}>
                <stat.icon className="text-white" size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-dark-400 text-sm">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chart */}
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            className="lg:col-span-2 glass-card p-6"
          >
            <h3 className="text-lg font-bold mb-6">Popular Domains</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={domainData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                <YAxis tick={{ fill: "#94a3b8" }} />
                <Tooltip contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", color: "#fff" }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {domainData.map((_entry: AdminChartData, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Recent Activity */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-bold mb-4">Recent Interviews</h3>
            <div className="space-y-4">
              {stats?.recentInterviews?.map((item: PopulatedInterview, i: number) => (
                <div key={i} className="flex items-center justify-between p-3 bg-dark-800/50 rounded-lg">
                  <div>
                    {/* Safe check using type guard */}
                    <p className="text-sm font-medium">
                      {isUserObject(item.user) ? item.user.name : "User"}
                    </p>
                    <p className="text-xs text-dark-400 capitalize">{item.domain}</p>
                  </div>
                  <span className={`text-sm font-bold ${item.percentage >= 70 ? "text-green-400" : "text-yellow-400"}`}>
                    {Math.round(item.percentage)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* User Management */}
        <div className="glass-card p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold">User Management</h3>
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" />
              <input 
                type="text" 
                placeholder="Search users..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm focus:outline-none focus:border-primary-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-dark-400 text-sm border-b border-dark-700">
                  <th className="pb-3 pl-2">Name</th>
                  <th className="pb-3">Email</th>
                  <th className="pb-3">Role</th>
                  <th className="pb-3">Interviews</th>
                  <th className="pb-3">Joined</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredUsers.map((user: User, i: number) => (
                  <tr key={user._id} className="border-b border-dark-800 hover:bg-dark-800/30 transition-colors">
                    <td className="py-4 pl-2 font-medium">{user.name}</td>
                    <td className="py-4 text-dark-300">{user.email}</td>
                    <td className="py-4"><span className={`px-2 py-1 rounded text-xs ${user.role === 'admin' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>{user.role}</span></td>
                    <td className="py-4">{user.totalInterviews || 0}</td>
                    <td className="py-4 text-dark-400">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</td>
                    <td className="py-4 text-right">
                      <button className="text-dark-500 hover:text-red-400 transition-colors">
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}