"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, UserX } from "lucide-react";

interface UserTypeDistributionChartProps {
  data?: any[];
  loading?: boolean;
}

const UserTypeDistributionChart = ({
  data,
  loading = false,
}: UserTypeDistributionChartProps) => {
  const COLORS = ["#1e40af", "#059669", "#64748b"];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage = (
        (data.value / payload[0].payload.total) *
        100
      ).toFixed(1);
      return (
        <div className="bg-white/95 backdrop-blur-md p-4 border border-slate-200/60 rounded-xl shadow-2xl">
          <p className="font-semibold text-slate-900 mb-2">
            {data.payload.name}
          </p>
          <p className="text-blue-800 font-semibold">
            {data.value.toLocaleString()} trips
          </p>
          <p className="text-slate-600 text-sm font-medium">
            {percentage}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <Card className="border-0 bg-white/70 backdrop-blur-md shadow-lg rounded-3xl">
        <CardHeader className="bg-gradient-to-r from-slate-900/5 to-blue-800/5 backdrop-blur-sm rounded-t-3xl">
          <CardTitle className="text-xl font-bold text-slate-900">
            User Type Distribution
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="h-80 bg-slate-100/70 animate-pulse rounded-2xl"></div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="border-0 bg-white/70 backdrop-blur-md shadow-lg rounded-3xl">
        <CardHeader className="bg-gradient-to-r from-slate-900/5 to-blue-800/5 backdrop-blur-sm rounded-t-3xl">
          <CardTitle className="text-xl font-bold text-slate-900">
            User Type Distribution
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="text-center py-12">
            <div className="p-4 bg-blue-800/10 rounded-2xl w-fit mx-auto mb-6">
              <Users className="w-12 h-12 text-blue-800" />
            </div>
            <p className="text-slate-700 font-medium">No user data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Add total to each data point for percentage calculation
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const dataWithTotal = data.map((item) => ({
    ...item,
    total: total,
  }));

  const memberData = data.find((item) =>
    item.name.toLowerCase().includes("member")
  );
  const casualData = data.find((item) =>
    item.name.toLowerCase().includes("casual")
  );

  const getIcon = (name: string) => {
    if (name.toLowerCase().includes("member")) {
      return <UserCheck className="w-5 h-5 text-blue-800" />;
    }
    if (name.toLowerCase().includes("casual")) {
      return <UserX className="w-5 h-5 text-emerald-600" />;
    }
    return <Users className="w-5 h-5 text-slate-700" />;
  };

  const getColor = (name: string) => {
    if (name.toLowerCase().includes("member")) return "#1e40af";
    if (name.toLowerCase().includes("casual")) return "#059669";
    return "#64748b";
  };

  return (
    <Card className="border-0 bg-white/70 backdrop-blur-md shadow-lg rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-slate-900/5 to-blue-800/5 backdrop-blur-sm border-b border-slate-200/60">
        <div className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-slate-900 mb-3">
              User Type Distribution
            </CardTitle>
            <div className="flex items-center">
              <div className="p-1 bg-blue-800/10 rounded-lg mr-2">
                <Users className="w-3 h-3 text-blue-800" />
              </div>
              <span className="text-sm font-semibold text-slate-700">
                Total Users: {total.toLocaleString()}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold text-slate-600">
              Most Active
            </div>
            <div className="text-lg font-bold text-blue-800">
              {memberData && casualData
                ? memberData.value > casualData.value
                  ? "Members"
                  : "Casual"
                : data[0]?.name || "N/A"}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-8">
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={dataWithTotal}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {dataWithTotal.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={getColor(entry.name)}
                  stroke="#ffffff"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* User Type Details */}
        <div className="space-y-4 mt-6">
          {data.map((item, index) => {
            const percentage = ((item.value / total) * 100).toFixed(1);
            const color = getColor(item.name);

            return (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-slate-50/70 backdrop-blur-sm rounded-xl hover:bg-slate-50/90 transition-colors duration-200"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-white/80 rounded-lg">
                    {getIcon(item.name)}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">
                      {item.name}
                    </div>
                    <div className="text-sm text-slate-600 font-medium">
                      {percentage}% of total
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className="font-bold text-slate-900 text-lg"
                    style={{ color }}
                  >
                    {item.value.toLocaleString()}
                  </div>
                  <div className="text-sm text-slate-500 font-medium">
                    trips
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary Statistics */}
        {memberData && casualData && (
          <div className="mt-6 pt-6 border-t border-slate-200/60">
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center p-4 bg-slate-50/70 backdrop-blur-sm rounded-xl">
                <div className="text-sm font-semibold text-slate-600">
                  Member Ratio
                </div>
                <div className="text-2xl font-bold text-blue-800">
                  {((memberData.value / total) * 100).toFixed(1)}%
                </div>
              </div>
              <div className="text-center p-4 bg-slate-50/70 backdrop-blur-sm rounded-xl">
                <div className="text-sm font-semibold text-slate-600">
                  Casual Ratio
                </div>
                <div className="text-2xl font-bold text-emerald-600">
                  {((casualData.value / total) * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserTypeDistributionChart;
