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
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, DollarSign } from "lucide-react";

interface RevenueDataPoint {
  hour: number;
  total_revenue: number;
  avg_revenue: number;
  trip_count: number;
}

interface RevenueByHourChartProps {
  data?: RevenueDataPoint[];
  loading?: boolean;
}

const RevenueByHourChart = ({
  data,
  loading = false,
}: RevenueByHourChartProps) => {
  const formatTooltip = (value: number | string, name: string) => {
    if (name === "total_revenue") {
      return [`$${parseFloat(String(value)).toFixed(2)}`, "Total Revenue"];
    }
    if (name === "avg_revenue") {
      return [`$${parseFloat(String(value)).toFixed(2)}`, "Avg Revenue"];
    }
    if (name === "trip_count") {
      return [Number(value).toLocaleString(), "Trip Count"];
    }
    return [value, name];
  };

  if (loading) {
    return (
      <Card className="col-span-2 border-0 bg-white/70 backdrop-blur-md shadow-lg rounded-3xl">
        <CardHeader className="bg-gradient-to-r from-slate-900/5 to-blue-800/5 backdrop-blur-sm rounded-t-3xl">
          <CardTitle className="text-xl font-bold text-slate-900">
            Revenue Analysis by Hour
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
      <Card className="col-span-2 border-0 bg-white/70 backdrop-blur-md shadow-lg rounded-3xl">
        <CardHeader className="bg-gradient-to-r from-slate-900/5 to-blue-800/5 backdrop-blur-sm rounded-t-3xl">
          <CardTitle className="text-xl font-bold text-slate-900">
            Revenue Analysis by Hour
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="text-center py-12">
            <div className="p-4 bg-blue-800/10 rounded-2xl w-fit mx-auto mb-6">
              <DollarSign className="w-12 h-12 text-blue-800" />
            </div>
            <p className="text-slate-700 font-medium">
              No revenue data available
            </p>
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
    <Card className="col-span-2 border-0 bg-white/70 backdrop-blur-md shadow-lg rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-slate-900/5 to-blue-800/5 backdrop-blur-sm border-b border-slate-200/60">
        <div className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-slate-900 mb-3">
              Revenue Analysis by Hour
            </CardTitle>
            <div className="flex items-center">
              <span className="text-sm font-semibold text-slate-700">
                Peak Hour:
              </span>
              <span className="text-lg font-bold text-blue-800 ml-2">
                {peakHour.hour}:00
              </span>
              <div className="flex items-center ml-6 text-emerald-600">
                <div className="p-1 bg-emerald-100/70 rounded-lg mr-2">
                  <TrendingUp className="w-3 h-3" />
                </div>
                <span className="text-sm font-semibold">
                  ${peakHour.total_revenue.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold text-slate-600">
              Total Revenue
            </div>
            <div className="text-2xl font-bold text-emerald-600">
              ${totalRevenue.toFixed(2)}
            </div>
            <div className="text-sm text-slate-500 font-medium">
              {totalTrips.toLocaleString()} trips
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-8">
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1e40af" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#1e40af" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="hour"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#475569", fontSize: 12, fontWeight: 500 }}
              label={{
                value: "Hour of Day",
                position: "insideBottom",
                offset: -5,
                style: {
                  textAnchor: "middle",
                  fontSize: "12px",
                  fontWeight: 600,
                },
              }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#475569", fontSize: 12, fontWeight: 500 }}
              label={{
                value: "Revenue ($)",
                angle: -90,
                position: "insideLeft",
                style: {
                  textAnchor: "middle",
                  fontSize: "12px",
                  fontWeight: 600,
                },
              }}
            />
            <Tooltip
              formatter={formatTooltip}
              labelFormatter={(label) => `Hour: ${label}:00`}
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(148, 163, 184, 0.3)",
                borderRadius: "12px",
                boxShadow:
                  "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                color: "#1e293b",
                fontWeight: 500,
              }}
            />
            <Area
              type="monotone"
              dataKey="total_revenue"
              stroke="#1e40af"
              strokeWidth={3}
              fill="url(#revenueGradient)"
              dot={{ r: 4, fill: "#1e40af", strokeWidth: 2 }}
              activeDot={{ r: 6, fill: "#1e40af", strokeWidth: 3 }}
            />
          </AreaChart>
        </ResponsiveContainer>

        {/* Summary Statistics */}
        <div className="mt-8 grid grid-cols-4 gap-6 pt-6 border-t border-slate-200/60">
          <div className="text-center p-4 bg-slate-50/70 backdrop-blur-sm rounded-xl">
            <div className="text-sm font-semibold text-slate-600">
              Total Revenue
            </div>
            <div className="text-lg font-bold text-emerald-600">
              ${totalRevenue.toFixed(2)}
            </div>
          </div>
          <div className="text-center p-4 bg-slate-50/70 backdrop-blur-sm rounded-xl">
            <div className="text-sm font-semibold text-slate-600">
              Avg per Hour
            </div>
            <div className="text-lg font-bold text-blue-800">
              ${(totalRevenue / data.length).toFixed(2)}
            </div>
          </div>
          <div className="text-center p-4 bg-slate-50/70 backdrop-blur-sm rounded-xl">
            <div className="text-sm font-semibold text-slate-600">
              Total Trips
            </div>
            <div className="text-lg font-bold text-slate-700">
              {totalTrips.toLocaleString()}
            </div>
          </div>
          <div className="text-center p-4 bg-slate-50/70 backdrop-blur-sm rounded-xl">
            <div className="text-sm font-semibold text-slate-600">
              Avg per Trip
            </div>
            <div className="text-lg font-bold text-emerald-600">
              ${(totalRevenue / totalTrips).toFixed(2)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RevenueByHourChart;
