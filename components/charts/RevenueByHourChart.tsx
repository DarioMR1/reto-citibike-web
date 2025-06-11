"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, DollarSign } from "lucide-react";

interface RevenueByHourChartProps {
  data?: any[];
  loading?: boolean;
}

const RevenueByHourChart = ({
  data,
  loading = false,
}: RevenueByHourChartProps) => {
  const formatTooltip = (value: any, name: any) => {
    if (name === "total_revenue") {
      return [`$${parseFloat(value).toFixed(2)}`, "Total Revenue"];
    }
    if (name === "avg_revenue") {
      return [`$${parseFloat(value).toFixed(2)}`, "Avg Revenue"];
    }
    if (name === "trip_count") {
      return [value.toLocaleString(), "Trip Count"];
    }
    return [value, name];
  };

  if (loading) {
    return (
      <Card className="col-span-2 border border-gray-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900">
            Revenue Analysis by Hour
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
      <Card className="col-span-2 border border-gray-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900">
            Revenue Analysis by Hour
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No revenue data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate peak revenue hour
  const peakHour = data.reduce(
    (max, item) => (item.total_revenue > max.total_revenue ? item : max),
    data[0]
  );

  const totalRevenue = data.reduce((sum, item) => sum + item.total_revenue, 0);
  const totalTrips = data.reduce((sum, item) => sum + item.trip_count, 0);

  return (
    <Card className="col-span-2 border border-gray-200 bg-white shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Revenue Analysis by Hour
          </CardTitle>
          <div className="flex items-center mt-2">
            <span className="text-sm text-gray-600">Peak Hour:</span>
            <span className="text-lg font-bold text-blue-600 ml-2">
              {peakHour.hour}:00
            </span>
            <div className="flex items-center ml-4 text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">
                ${peakHour.total_revenue.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600">Total Revenue</div>
          <div className="text-xl font-bold text-green-600">
            ${totalRevenue.toFixed(2)}
          </div>
          <div className="text-sm text-gray-500">
            {totalTrips.toLocaleString()} trips
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#2563EB" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="hour"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#374151", fontSize: 12, fontWeight: 500 }}
              label={{
                value: "Hour of Day",
                position: "insideBottom",
                offset: -5,
              }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#374151", fontSize: 12, fontWeight: 500 }}
              label={{
                value: "Revenue ($)",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip
              formatter={formatTooltip}
              labelFormatter={(label) => `Hour: ${label}:00`}
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                boxShadow:
                  "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                color: "#1f2937",
                fontWeight: 500,
              }}
            />
            <Area
              type="monotone"
              dataKey="total_revenue"
              stroke="#2563EB"
              strokeWidth={2}
              fill="url(#revenueGradient)"
              dot={{ r: 4, fill: "#2563EB", strokeWidth: 2 }}
              activeDot={{ r: 6, fill: "#2563EB", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>

        {/* Summary Statistics */}
        <div className="mt-4 grid grid-cols-4 gap-4 pt-4 border-t border-gray-200">
          <div className="text-center">
            <div className="text-sm text-gray-600">Total Revenue</div>
            <div className="text-lg font-bold text-green-600">
              ${totalRevenue.toFixed(2)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600">Avg per Hour</div>
            <div className="text-lg font-bold text-blue-600">
              ${(totalRevenue / data.length).toFixed(2)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600">Total Trips</div>
            <div className="text-lg font-bold text-purple-600">
              {totalTrips.toLocaleString()}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600">Avg per Trip</div>
            <div className="text-lg font-bold text-orange-600">
              ${(totalRevenue / totalTrips).toFixed(2)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RevenueByHourChart;
