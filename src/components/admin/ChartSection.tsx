"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { Users, Activity, TrendingUp, Database } from "lucide-react";

interface ChartSectionProps {
  usersByRole: { name: string; value: number }[];
  apiUsageData: { name: string; calls: number }[];
  providersData: { name: string; count: number }[];
  dailyStats: { day: string; chats: number; users: number }[];
}

export function ChartSection({
  usersByRole,
  apiUsageData,
  providersData,
  dailyStats,
}: ChartSectionProps) {
  // Colors for charts
  const COLORS = ["#ffd700", "#7c3aed", "#ff6b6b", "#4ecdc4"];
  const PIE_COLORS = ["#ffd700", "#7c3aed"];

  return (
    <>
      {/* Users Chart */}
      <GlassCard className="p-6" variant="liquid">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
          <Users className="mr-2" />
          Users Distribution
        </h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={usersByRole}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name}: ${(percent ? (percent as number) * 100 : 0).toFixed(
                    0
                  )}%`
                }
              >
                {usersByRole.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={PIE_COLORS[index % PIE_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(45, 27, 78, 0.8)",
                  borderColor: "rgba(255, 215, 0, 0.5)",
                  borderRadius: "0.5rem",
                  backdropFilter: "blur(10px)",
                }}
                itemStyle={{ color: "#fff" }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      {/* API Usage Chart */}
      <GlassCard className="p-6" variant="liquid">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
          <Activity className="mr-2" />
          API Usage by Endpoint
        </h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={apiUsageData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255, 255, 255, 0.1)"
              />
              <XAxis dataKey="name" stroke="#ffd700" />
              <YAxis stroke="#ffd700" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(45, 27, 78, 0.8)",
                  borderColor: "rgba(255, 215, 0, 0.5)",
                  borderRadius: "0.5rem",
                  backdropFilter: "blur(10px)",
                }}
                itemStyle={{ color: "#fff" }}
              />
              <Bar dataKey="calls" fill="#7c3aed" name="API Calls">
                {apiUsageData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      {/* Daily Activity Chart */}
      <GlassCard className="p-6" variant="liquid">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
          <TrendingUp className="mr-2" />
          Daily Activity
        </h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={dailyStats}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255, 255, 255, 0.1)"
              />
              <XAxis dataKey="day" stroke="#ffd700" />
              <YAxis stroke="#ffd700" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(45, 27, 78, 0.8)",
                  borderColor: "rgba(255, 215, 0, 0.5)",
                  borderRadius: "0.5rem",
                  backdropFilter: "blur(10px)",
                }}
                itemStyle={{ color: "#fff" }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="chats"
                stroke="#7c3aed"
                activeDot={{ r: 8 }}
                name="Chats"
              />
              <Line
                type="monotone"
                dataKey="users"
                stroke="#ffd700"
                name="New Users"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      {/* Providers Chart */}
      <GlassCard className="p-6" variant="liquid">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
          <Database className="mr-2" />
          AI Providers Usage
        </h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={providersData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255, 255, 255, 0.1)"
              />
              <XAxis dataKey="name" stroke="#ffd700" />
              <YAxis stroke="#ffd700" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(45, 27, 78, 0.8)",
                  borderColor: "rgba(255, 215, 0, 0.5)",
                  borderRadius: "0.5rem",
                  backdropFilter: "blur(10px)",
                }}
                itemStyle={{ color: "#fff" }}
              />
              <Bar dataKey="count" fill="#7c3aed" name="Usage Count">
                {providersData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>
    </>
  );
}
