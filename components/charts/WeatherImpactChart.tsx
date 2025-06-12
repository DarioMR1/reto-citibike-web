"use client";

import React from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Thermometer, TrendingUp } from "lucide-react";

interface WeatherDataPoint {
  temperature: number;
  avg_revenue: number;
  trip_count: number;
}

interface WeatherImpactChartProps {
  data?: WeatherDataPoint[];
  loading?: boolean;
}

const WeatherImpactChart = ({
  data,
  loading = false,
}: WeatherImpactChartProps) => {
  if (loading) {
    return (
      <Card className="border-0 bg-white/70 backdrop-blur-md shadow-lg rounded-3xl">
        <CardHeader className="bg-gradient-to-r from-slate-900/5 to-blue-800/5 backdrop-blur-sm rounded-t-3xl">
          <CardTitle className="text-xl font-bold text-slate-900">
            Weather Impact Analysis
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
            Weather Impact Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="text-center py-12">
            <div className="p-4 bg-blue-800/10 rounded-2xl w-fit mx-auto mb-6">
              <Thermometer className="w-12 h-12 text-blue-800" />
            </div>
            <p className="text-slate-700 font-medium">
              Weather data not available
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const optimalTemp = data.reduce(
    (max, item) => (item.avg_revenue > max.avg_revenue ? item : max),
    data[0]
  );

  const totalTrips = data.reduce((sum, item) => sum + item.trip_count, 0);

  return (
    <Card className="border-0 bg-white/70 backdrop-blur-md shadow-lg rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-slate-900/5 to-blue-800/5 backdrop-blur-sm border-b border-slate-200/60">
        <div className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-slate-900 mb-3">
              Weather Impact Analysis
            </CardTitle>
            <div className="flex items-center">
              <span className="text-sm font-semibold text-slate-700">
                Optimal Temperature:
              </span>
              <span className="text-lg font-bold text-blue-800 ml-2">
                {optimalTemp.temperature}°C
              </span>
              <div className="flex items-center ml-6 text-emerald-600">
                <div className="p-1 bg-emerald-100/70 rounded-lg mr-2">
                  <TrendingUp className="w-3 h-3" />
                </div>
                <span className="text-sm font-semibold">
                  ${optimalTemp.avg_revenue.toFixed(2)} avg revenue
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold text-slate-600">
              Total Trips
            </div>
            <div className="text-2xl font-bold text-slate-900">
              {totalTrips.toLocaleString()}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-8">
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="temperature"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#475569", fontSize: 12, fontWeight: 500 }}
              label={{
                value: "Temperature (°C)",
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
              yAxisId="revenue"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#475569", fontSize: 12, fontWeight: 500 }}
              label={{
                value: "Average Revenue ($)",
                angle: -90,
                position: "insideLeft",
                style: {
                  textAnchor: "middle",
                  fontSize: "12px",
                  fontWeight: 600,
                },
              }}
            />
            <YAxis
              yAxisId="trips"
              orientation="right"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#475569", fontSize: 12, fontWeight: 500 }}
              label={{
                value: "Trip Count",
                angle: 90,
                position: "insideRight",
                style: {
                  textAnchor: "middle",
                  fontSize: "12px",
                  fontWeight: 600,
                },
              }}
            />
            <Tooltip
              formatter={(value: number | string, name: string) => {
                if (name === "avg_revenue")
                  return [`$${Number(value).toFixed(2)}`, "Avg Revenue"];
                if (name === "trip_count")
                  return [Number(value).toLocaleString(), "Trip Count"];
                return [value, name];
              }}
              labelFormatter={(label) => `Temperature: ${label}°C`}
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
            <Line
              yAxisId="revenue"
              type="monotone"
              dataKey="avg_revenue"
              stroke="#1e40af"
              strokeWidth={3}
              dot={{ fill: "#1e40af", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: "#1e40af", strokeWidth: 2 }}
            />
            <Line
              yAxisId="trips"
              type="monotone"
              dataKey="trip_count"
              stroke="#059669"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: "#059669", strokeWidth: 2, r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>

        {/* Summary Stats */}
        <div className="mt-8 grid grid-cols-3 gap-6 pt-6 border-t border-slate-200/60">
          <div className="text-center p-4 bg-slate-50/70 backdrop-blur-sm rounded-xl">
            <div className="text-sm font-semibold text-slate-600">
              Min Temperature
            </div>
            <div className="text-lg font-bold text-blue-800">
              {Math.min(...data.map((d) => d.temperature))}°C
            </div>
          </div>
          <div className="text-center p-4 bg-slate-50/70 backdrop-blur-sm rounded-xl">
            <div className="text-sm font-semibold text-slate-600">
              Max Temperature
            </div>
            <div className="text-lg font-bold text-slate-700">
              {Math.max(...data.map((d) => d.temperature))}°C
            </div>
          </div>
          <div className="text-center p-4 bg-slate-50/70 backdrop-blur-sm rounded-xl">
            <div className="text-sm font-semibold text-slate-600">
              Avg Revenue
            </div>
            <div className="text-lg font-bold text-emerald-600">
              $
              {(
                data.reduce((sum, d) => sum + d.avg_revenue, 0) / data.length
              ).toFixed(2)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherImpactChart;
