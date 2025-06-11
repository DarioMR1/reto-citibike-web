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
  const COLORS = ["#2563EB", "#059669", "#D97706"];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage = (
        (data.value / payload[0].payload.total) *
        100
      ).toFixed(1);
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{data.payload.name}</p>
          <p className="text-blue-600 font-medium">
            {data.value.toLocaleString()} trips
          </p>
          <p className="text-gray-600 text-sm">{percentage}% of total</p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <Card className="border border-gray-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900">
            User Type Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 bg-gray-100 animate-pulse rounded"></div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="border border-gray-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900">
            User Type Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No user data available</p>
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
      return <UserCheck className="w-5 h-5 text-blue-600" />;
    }
    if (name.toLowerCase().includes("casual")) {
      return <UserX className="w-5 h-5 text-green-600" />;
    }
    return <Users className="w-5 h-5 text-orange-600" />;
  };

  const getColor = (name: string) => {
    if (name.toLowerCase().includes("member")) return "#2563EB";
    if (name.toLowerCase().includes("casual")) return "#059669";
    return "#D97706";
  };

  return (
    <Card className="border border-gray-200 bg-white shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-semibold text-gray-900">
            User Type Distribution
          </CardTitle>
          <div className="flex items-center mt-2">
            <Users className="w-4 h-4 text-gray-600 mr-1" />
            <span className="text-sm text-gray-600">
              Total Users: {total.toLocaleString()}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600">Most Active</div>
          <div className="text-lg font-bold text-blue-600">
            {memberData && casualData
              ? memberData.value > casualData.value
                ? "Members"
                : "Casual"
              : data[0]?.name || "N/A"}
          </div>
        </div>
      </CardHeader>
      <CardContent>
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
        <div className="space-y-3 mt-4">
          {data.map((item, index) => {
            const percentage = ((item.value / total) * 100).toFixed(1);
            const color = getColor(item.name);

            return (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  {getIcon(item.name)}
                  <div>
                    <div className="font-medium text-gray-900">{item.name}</div>
                    <div className="text-sm text-gray-600">
                      {percentage}% of total
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900" style={{ color }}>
                    {item.value.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">trips</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary Statistics */}
        {memberData && casualData && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-sm text-gray-600">Member Ratio</div>
                <div className="text-lg font-bold text-blue-600">
                  {((memberData.value / total) * 100).toFixed(1)}%
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600">Casual Ratio</div>
                <div className="text-lg font-bold text-green-600">
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
