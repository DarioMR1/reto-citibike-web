"use client";

import React from "react";
import {
  ScatterChart,
  Scatter,
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

interface WeatherImpactChartProps {
  data?: any[];
  loading?: boolean;
}

const WeatherImpactChart = ({
  data,
  loading = false,
}: WeatherImpactChartProps) => {
  if (loading) {
    return (
      <Card className="border border-gray-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900">
            Weather Impact Analysis
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
            Weather Impact Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Thermometer className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Weather data not available</p>
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
    <Card className="border border-gray-200 bg-white shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Weather Impact Analysis
          </CardTitle>
          <div className="flex items-center mt-2">
            <span className="text-sm text-gray-600">Optimal Temperature:</span>
            <span className="text-lg font-bold text-blue-600 ml-2">
              {optimalTemp.temperature}°C
            </span>
            <div className="flex items-center ml-4 text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">
                ${optimalTemp.avg_revenue.toFixed(2)} avg revenue
              </span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600">Total Trips</div>
          <div className="text-xl font-bold text-gray-900">
            {totalTrips.toLocaleString()}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="temperature"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#374151", fontSize: 12, fontWeight: 500 }}
              label={{
                value: "Temperature (°C)",
                position: "insideBottom",
                offset: -5,
              }}
            />
            <YAxis
              yAxisId="revenue"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#374151", fontSize: 12, fontWeight: 500 }}
              label={{
                value: "Average Revenue ($)",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <YAxis
              yAxisId="trips"
              orientation="right"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#374151", fontSize: 12, fontWeight: 500 }}
              label={{
                value: "Trip Count",
                angle: 90,
                position: "insideRight",
              }}
            />
            <Tooltip
              formatter={(value: any, name: any) => {
                if (name === "avg_revenue")
                  return [`$${value.toFixed(2)}`, "Avg Revenue"];
                if (name === "trip_count")
                  return [value.toLocaleString(), "Trip Count"];
                return [value, name];
              }}
              labelFormatter={(label) => `Temperature: ${label}°C`}
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
            <Line
              yAxisId="revenue"
              type="monotone"
              dataKey="avg_revenue"
              stroke="#2563EB"
              strokeWidth={3}
              dot={{ fill: "#2563EB", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: "#2563EB", strokeWidth: 2 }}
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
        <div className="mt-4 grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
          <div className="text-center">
            <div className="text-sm text-gray-600">Min Temperature</div>
            <div className="text-lg font-bold text-blue-600">
              {Math.min(...data.map((d) => d.temperature))}°C
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600">Max Temperature</div>
            <div className="text-lg font-bold text-red-600">
              {Math.max(...data.map((d) => d.temperature))}°C
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600">Avg Revenue</div>
            <div className="text-lg font-bold text-green-600">
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
