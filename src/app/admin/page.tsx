"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/layout/Header";
import { Squares } from "@/components/ui/squares-background";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { ChartSection } from "@/components/admin/ChartSection";
import {
  Users,
  MessageSquare,
  Image as ImageIcon,
  Activity,
  Clock,
  AlertCircle,
  Settings,
  Database,
  Key,
  UserCheck,
  UserX,
  Trash2,
  TrendingUp,
  Shield,
  Zap,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface AdminStats {
  users: {
    total: number;
    newThisMonth: number;
    admins: number;
  };
  chats: {
    total: number;
    today: number;
    avgMessagesPerChat: number;
  };
  images: {
    total: number;
    today: number;
    safetyRejections: number;
  };
  apiUsage: {
    totalCalls: number;
    avgLatency: number;
    errorRate: number;
    byEndpoint: Record<string, number>;
  };
  providers: Record<string, number>;
}

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
}

interface AdminChat {
  _id: string;
  userId: { name: string; email: string };
  title: string;
  aiModel: string;
  messageCount: number;
  createdAt: string;
  messages: Array<{ role: string; content: string; timestamp: string }>;
}

export default function AdminDashboard() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [chats, setChats] = useState<AdminChat[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingChats, setLoadingChats] = useState(true);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is admin
  useEffect(() => {
    if (!loading && (!user || !user.isAdmin)) {
      router.push("/");
    }
  }, [user, loading, router]);

  // Fetch stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoadingStats(true);
        const res = await fetch("/api/admin/stats");
        const data = await res.json();

        if (data.success) {
          setStats(data.data);
        } else {
          setError(data.message || "Failed to fetch stats");
        }
      } catch (err) {
        setError("Failed to fetch stats");
        console.error(err);
      } finally {
        setLoadingStats(false);
      }
    };

    if (user?.isAdmin) {
      fetchStats();
    }
  }, [user]);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoadingUsers(true);
        const res = await fetch("/api/admin/users?limit=10");
        const data = await res.json();

        if (data.success) {
          setUsers(data.data.users);
        } else {
          setError(data.message || "Failed to fetch users");
        }
      } catch (err) {
        setError("Failed to fetch users");
        console.error(err);
      } finally {
        setLoadingUsers(false);
      }
    };

    if (user?.isAdmin) {
      fetchUsers();
    }
  }, [user]);

  // Fetch chats
  useEffect(() => {
    const fetchChats = async () => {
      try {
        setLoadingChats(true);
        const res = await fetch("/api/admin/chats?limit=10");
        const data = await res.json();

        if (data.success) {
          setChats(data.data.chats);
        } else {
          setError(data.message || "Failed to fetch chats");
        }
      } catch (err) {
        setError("Failed to fetch chats");
        console.error(err);
      } finally {
        setLoadingChats(false);
      }
    };

    if (user?.isAdmin) {
      fetchChats();
    }
  }, [user]);

  // Fetch settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoadingSettings(true);
        const res = await fetch("/api/admin/settings");
        const data = await res.json();

        if (data.success) {
          setSettings(data.data);
        } else {
          setError(data.message || "Failed to fetch settings");
        }
      } catch (err) {
        setError("Failed to fetch settings");
        console.error(err);
      } finally {
        setLoadingSettings(false);
      }
    };

    if (user?.isAdmin) {
      fetchSettings();
    }
  }, [user]);

  // Toggle user admin status
  const toggleUserAdmin = async (userId: string, isAdmin: boolean) => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, isAdmin: !isAdmin }),
      });

      const data = await res.json();

      if (data.success) {
        // Update users list
        setUsers(
          users.map((user) =>
            user._id === userId ? { ...user, isAdmin: !isAdmin } : user
          )
        );
      } else {
        setError(data.message || "Failed to update user");
      }
    } catch (err) {
      setError("Failed to update user");
      console.error(err);
    }
  };

  // Delete user
  const deleteUser = async (userId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const res = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const data = await res.json();

      if (data.success) {
        // Remove user from list
        setUsers(users.filter((user) => user._id !== userId));
      } else {
        setError(data.message || "Failed to delete user");
      }
    } catch (err) {
      setError("Failed to delete user");
      console.error(err);
    }
  };

  // Get the last message from a chat
  const getLastMessage = (messages: AdminChat["messages"]) => {
    if (!messages || messages.length === 0) return "No messages yet";
    const lastMessage = messages[messages.length - 1];
    return lastMessage.content.length > 100
      ? lastMessage.content.substring(0, 100) + "..."
      : lastMessage.content;
  };

  // Function to handle settings updates
  const updateSetting = async (settingName: string, value: any) => {
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [settingName]: value }),
      });

      const data = await res.json();

      if (data.success) {
        // Update settings state
        setSettings({
          ...settings,
          settings: {
            ...settings?.settings,
            [settingName]: value,
          },
        });
      } else {
        setError(data.message || "Failed to update setting");
      }
    } catch (err) {
      setError("Failed to update setting");
      console.error(err);
    }
  };

  // Prepare data for charts
  const prepareChartData = () => {
    // Users by role chart data
    const usersByRole = [
      {
        name: "Regular Users",
        value: stats?.users.total
          ? stats.users.total - (stats.users.admins || 0)
          : 0,
      },
      { name: "Admins", value: stats?.users.admins || 0 },
    ];

    // API usage by endpoint chart data
    const apiUsageData = stats?.apiUsage.byEndpoint
      ? Object.entries(stats.apiUsage.byEndpoint).map(([endpoint, calls]) => ({
          name: endpoint,
          calls,
        }))
      : [];

    // Providers usage chart data
    const providersData = stats?.providers
      ? Object.entries(stats.providers).map(([provider, count]) => ({
          name: provider,
          count,
        }))
      : [];

    // Daily stats for line chart
    const dailyStats = [
      {
        day: "Mon",
        chats: stats?.chats.today ? stats.chats.today * 0.7 : 0,
        users: stats?.users.newThisMonth
          ? Math.floor(stats.users.newThisMonth * 0.3)
          : 0,
      },
      {
        day: "Tue",
        chats: stats?.chats.today ? stats.chats.today * 0.4 : 0,
        users: stats?.users.newThisMonth
          ? Math.floor(stats.users.newThisMonth * 0.2)
          : 0,
      },
      {
        day: "Wed",
        chats: stats?.chats.today ? stats.chats.today * 0.6 : 0,
        users: stats?.users.newThisMonth
          ? Math.floor(stats.users.newThisMonth * 0.5)
          : 0,
      },
      {
        day: "Thu",
        chats: stats?.chats.today ? stats.chats.today * 0.9 : 0,
        users: stats?.users.newThisMonth
          ? Math.floor(stats.users.newThisMonth * 0.7)
          : 0,
      },
      {
        day: "Fri",
        chats: stats?.chats.today ? stats.chats.today : 0,
        users: stats?.users.newThisMonth
          ? Math.floor(stats.users.newThisMonth * 0.9)
          : 0,
      },
      {
        day: "Sat",
        chats: stats?.chats.today ? stats.chats.today * 0.6 : 0,
        users: stats?.users.newThisMonth
          ? Math.floor(stats.users.newThisMonth * 0.4)
          : 0,
      },
      {
        day: "Sun",
        chats: stats?.chats.today ? stats.chats.today * 0.3 : 0,
        users: stats?.users.newThisMonth
          ? Math.floor(stats.users.newThisMonth * 0.1)
          : 0,
      },
    ];

    return { usersByRole, apiUsageData, providersData, dailyStats };
  };

  const { usersByRole, apiUsageData, providersData, dailyStats } =
    prepareChartData();

  // Colors for charts
  const COLORS = ["#ffd700", "#7c3aed", "#ff6b6b", "#4ecdc4"];
  const PIE_COLORS = ["#ffd700", "#7c3aed"];

  if (loading || loadingStats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800">
        <Header
          items={["Home", "Features", "Chat", "Pricing", "Contact"]}
          color="#ffd700"
        />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/4 w-[600px] h-[600px] bg-purple-500 rounded-full mix-blend-soft-light filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-1/2 -left-1/4 w-[600px] h-[600px] bg-yellow-500 rounded-full mix-blend-soft-light filter blur-3xl opacity-20 animate-pulse"></div>
      </div>

      <Header
        items={["Home", "Features", "Chat", "Pricing", "Contact"]}
        color="#ffd700"
      />

      <div className="container mx-auto px-4 py-8 relative z-10 pt-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 text-center glow-text">
            Admin Dashboard
          </h1>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6">
              <p className="text-red-200">{error}</p>
            </div>
          )}

          {/* Stats Overview with Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <ChartSection
              usersByRole={usersByRole}
              apiUsageData={apiUsageData}
              providersData={providersData}
              dailyStats={dailyStats}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Chats with Message Layout */}
            <GlassCard className="p-6" variant="liquid">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <MessageSquare className="mr-2" />
                Recent Chats
              </h2>
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-purple-900/50 scrollbar-thumb-rounded-full">
                {chats.map((chat) => (
                  <motion.div
                    key={chat._id}
                    className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all duration-300 border border-white/10"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-white text-lg">
                          {chat.title}
                        </h3>
                        <p className="text-sm text-purple-300 flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {chat.userId.name}
                        </p>
                      </div>
                      <span className="text-xs text-gray-400 bg-gray-800/50 px-2 py-1 rounded-full">
                        {new Date(chat.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Message Preview Container */}
                    <div className="bg-gray-900/30 rounded-lg p-3 mb-3 border border-white/5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-purple-400 bg-purple-900/50 px-2 py-1 rounded">
                          Last Message
                        </span>
                        <span className="text-xs text-gray-400">
                          {chat.messages.length > 0
                            ? new Date(
                                chat.messages[
                                  chat.messages.length - 1
                                ].timestamp
                              ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "N/A"}
                        </span>
                      </div>
                      <p className="text-sm text-gray-200">
                        {getLastMessage(chat.messages)}
                      </p>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex space-x-2">
                        <span className="text-xs text-purple-300 bg-purple-900/50 px-2 py-1 rounded flex items-center">
                          <Zap className="w-3 h-3 mr-1" />
                          {chat.aiModel}
                        </span>
                        <span className="text-xs text-cyan-300 bg-cyan-900/50 px-2 py-1 rounded flex items-center">
                          <MessageSquare className="w-3 h-3 mr-1" />
                          {chat.messageCount}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>

            {/* User Management and Other Sections */}
            <div className="space-y-8">
              <GlassCard className="p-6" variant="liquid">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <Users className="mr-2" />
                  User Management
                </h2>
                <div className="space-y-3">
                  {users.map((user) => (
                    <motion.div
                      key={user._id}
                      className="flex items-center justify-between bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-all duration-300"
                      whileHover={{ x: 5 }}
                    >
                      <div>
                        <p className="font-medium text-white">{user.name}</p>
                        <p className="text-sm text-gray-300">{user.email}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() =>
                            toggleUserAdmin(user._id, user.isAdmin)
                          }
                          className={`px-3 py-1 rounded text-xs font-medium transition-all duration-300 ${
                            user.isAdmin
                              ? "bg-green-500/20 text-green-300 hover:bg-green-500/30"
                              : "bg-gray-500/20 text-gray-300 hover:bg-gray-500/30"
                          }`}
                        >
                          {user.isAdmin ? (
                            <UserCheck className="w-4 h-4 inline mr-1" />
                          ) : (
                            <UserX className="w-4 h-4 inline mr-1" />
                          )}
                          {user.isAdmin ? "Admin" : "User"}
                        </button>
                        <button
                          onClick={() => deleteUser(user._id)}
                          className="p-2 text-red-400 hover:bg-red-500/20 rounded-full transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>

              {/* API Keys Status */}
              <GlassCard className="p-6" variant="liquid">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <Key className="mr-2" />
                  API Keys Status
                </h2>
                <div className="space-y-3">
                  <ApiKeyStatus name="Groq" enabled={settings?.apiKeys?.groq} />
                  <ApiKeyStatus
                    name="Hugging Face"
                    enabled={settings?.apiKeys?.huggingface}
                  />
                  <ApiKeyStatus
                    name="Stability AI"
                    enabled={settings?.apiKeys?.stability}
                  />
                  <ApiKeyStatus
                    name="Pinecone"
                    enabled={settings?.apiKeys?.pinecone}
                  />
                </div>
              </GlassCard>

              {/* Settings Panel with enhanced functionality */}
              <GlassCard className="p-6" variant="liquid">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <Settings className="mr-2" />
                  Settings
                </h2>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div>
                      <p className="font-medium text-white">RAG Enabled</p>
                      <p className="text-sm text-gray-400">
                        Enable Retrieval Augmented Generation
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={settings?.settings?.rag_enabled || false}
                        onChange={(e) =>
                          updateSetting("rag_enabled", e.target.checked)
                        }
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>

                  <div className="p-3 bg-white/5 rounded-lg">
                    <label className="block text-white mb-2">
                      Vector DB Provider
                    </label>
                    <p className="text-sm text-gray-400 mb-3">
                      Select the vector database provider
                    </p>
                    <select
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      value={
                        settings?.settings?.vector_db_provider || "chromadb"
                      }
                      onChange={(e) =>
                        updateSetting("vector_db_provider", e.target.value)
                      }
                    >
                      <option value="chromadb">ChromaDB</option>
                      <option value="pinecone">Pinecone</option>
                      <option value="qdrant">Qdrant</option>
                    </select>
                  </div>

                  <div className="p-3 bg-white/5 rounded-lg">
                    <label className="block text-white mb-2">
                      Default AI Model
                    </label>
                    <p className="text-sm text-gray-400 mb-3">
                      Select the default AI model for chats
                    </p>
                    <select
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      value={
                        settings?.settings?.default_model ||
                        "llama-3.1-8b-instant"
                      }
                      onChange={(e) =>
                        updateSetting("default_model", e.target.value)
                      }
                    >
                      <option value="llama-3.1-8b-instant">
                        Llama 3.1 8B Instant
                      </option>
                      <option value="llama-3.1-70b-versatile">
                        Llama 3.1 70B Versatile
                      </option>
                      <option value="mixtral-8x7b-32768">Mixtral 8x7B</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div>
                      <p className="font-medium text-white">Image Generation</p>
                      <p className="text-sm text-gray-400">
                        Enable AI image generation
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={
                          settings?.settings?.image_generation_enabled || false
                        }
                        onChange={(e) =>
                          updateSetting(
                            "image_generation_enabled",
                            e.target.checked
                          )
                        }
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Add global styles for glow effect */}
      <style jsx global>{`
        .glow-text {
          text-shadow: 0 0 10px rgba(255, 215, 0, 0.5),
            0 0 20px rgba(255, 215, 0, 0.3), 0 0 30px rgba(255, 215, 0, 0.2);
          animation: glow 2s ease-in-out infinite alternate;
        }

        @keyframes glow {
          from {
            text-shadow: 0 0 10px rgba(255, 215, 0, 0.5),
              0 0 20px rgba(255, 215, 0, 0.3), 0 0 30px rgba(255, 215, 0, 0.2);
          }
          to {
            text-shadow: 0 0 15px rgba(255, 215, 0, 0.6),
              0 0 25px rgba(255, 215, 0, 0.4), 0 0 35px rgba(255, 215, 0, 0.3);
          }
        }
      `}</style>
    </div>
  );
}

// Stat Card Component
function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <motion.div
      className={`bg-gradient-to-r ${color} rounded-xl p-6 shadow-lg glass-card`}
      whileHover={{ y: -5, scale: 1.03 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-white/80 text-sm font-medium">{title}</p>
          <p className="text-white text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className="bg-white/20 p-3 rounded-lg">{icon}</div>
      </div>
    </motion.div>
  );
}

// API Key Status Component
function ApiKeyStatus({ name, enabled }: { name: string; enabled?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-300">{name}</span>
      <div className="flex items-center">
        {enabled ? (
          <span className="flex items-center text-green-400 bg-green-900/30 px-2 py-1 rounded">
            <CheckCircle className="w-4 h-4 mr-1" />
            Configured
          </span>
        ) : (
          <span className="flex items-center text-red-400 bg-red-900/30 px-2 py-1 rounded">
            <XCircle className="w-4 h-4 mr-1" />
            Missing
          </span>
        )}
      </div>
    </div>
  );
}
