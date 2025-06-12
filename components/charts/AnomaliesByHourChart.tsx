"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, AlertTriangle, Clock } from "lucide-react";

interface AnomalyDataPoint {
  hour: number;
  anomalies: number;
}

interface AnomaliesByHourChartProps {
  data?: AnomalyDataPoint[];
  loading?: boolean;
}

const AnomaliesByHourChart = ({
  data,
  loading = false,
}: AnomaliesByHourChartProps) => {
  if (loading) {
    return (
      <Card className="border-0 bg-white/70 backdrop-blur-md shadow-lg rounded-3xl">
        <CardHeader className="bg-gradient-to-r from-slate-900/5 to-blue-800/5 backdrop-blur-sm rounded-t-3xl">
          <CardTitle className="text-xl font-bold text-slate-900">
            Anomalies by Hour
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
            Anomalies by Hour
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="text-center py-12">
            <div className="p-4 bg-amber-100/80 backdrop-blur-sm rounded-2xl w-fit mx-auto mb-6">
              <AlertTriangle className="w-12 h-12 text-amber-600" />
            </div>
            <p className="text-slate-700 font-semibold text-lg mb-2">
              No anomaly data available
            </p>
            <p className="text-slate-600 font-medium">
              Train the anomaly detection model first
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate statistics
  const totalAnomalies = data.reduce((sum, item) => sum + item.anomalies, 0);
  const peakHour = data.reduce(
    (max, item) => (item.anomalies > max.anomalies ? item : max),
    data[0]
  );
  const averageAnomalies = totalAnomalies / data.length;

  // Get busy hours (hours with above-average anomalies)
  const busyHours = data.filter((item) => item.anomalies > averageAnomalies);

  const formatTooltip = (value: number | string, name: string) => {
    if (name === "anomalies") {
      return [`${value} anomalies`, "Detected Anomalies"];
    }
    return [value, name];
  };

  return (
    <Card className="border-0 bg-white/70 backdrop-blur-md shadow-lg rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-slate-900/5 to-blue-800/5 backdrop-blur-sm border-b border-slate-200/60">
        <div>
          <CardTitle className="text-xl font-bold text-slate-900 mb-3">
            Anomalies by Hour of Day
          </CardTitle>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-700">
                Peak Hour:
              </span>
              <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-xl font-bold shadow-md">
                {peakHour.hour}:00
              </div>
            </div>
            <div className="flex items-center gap-2 text-amber-600">
              <div className="p-1 bg-amber-100/80 rounded-lg">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <span className="text-sm font-semibold">
                {peakHour.anomalies} anomalies
              </span>
            </div>
          </div>
        </div>
        <div className="text-right p-4 bg-white/60 backdrop-blur-sm rounded-2xl shadow-sm">
          <div className="text-sm font-semibold text-slate-600">
            Total Anomalies
          </div>
          <div className="text-2xl font-bold text-red-600">
            {totalAnomalies}
          </div>
          <div className="text-sm text-slate-500 font-medium">
            Avg: {averageAnomalies.toFixed(1)} per hour
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-8">
        <ResponsiveContainer width="100%" height={320}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
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
                style: { fontSize: "12px", fontWeight: 600 },
              }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#475569", fontSize: 12, fontWeight: 500 }}
              label={{
                value: "Number of Anomalies",
                angle: -90,
                position: "insideLeft",
                style: { fontSize: "12px", fontWeight: 600 },
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
            <Bar
              dataKey="anomalies"
              fill="#DC2626"
              radius={[4, 4, 0, 0]}
              stroke="#B91C1C"
              strokeWidth={1}
            />
          </BarChart>
        </ResponsiveContainer>

        {/* Time Period Analysis */}
        <div className="mt-8 grid grid-cols-4 gap-6 pt-6 border-t border-slate-200/60">
          <div className="text-center p-4 bg-red-50/80 backdrop-blur-sm rounded-2xl shadow-sm">
            <div className="text-sm font-semibold text-red-700">
              Total Anomalies
            </div>
            <div className="text-2xl font-bold text-red-600">
              {totalAnomalies}
            </div>
          </div>
          <div className="text-center p-4 bg-amber-50/80 backdrop-blur-sm rounded-2xl shadow-sm">
            <div className="text-sm font-semibold text-amber-700">
              Peak Hour
            </div>
            <div className="text-2xl font-bold text-amber-600">
              {peakHour.hour}:00
            </div>
          </div>
          <div className="text-center p-4 bg-blue-50/80 backdrop-blur-sm rounded-2xl shadow-sm">
            <div className="text-sm font-semibold text-blue-800">
              Avg per Hour
            </div>
            <div className="text-2xl font-bold text-blue-800">
              {averageAnomalies.toFixed(1)}
            </div>
          </div>
          <div className="text-center p-4 bg-purple-50/80 backdrop-blur-sm rounded-2xl shadow-sm">
            <div className="text-sm font-semibold text-purple-700">
              Busy Hours
            </div>
            <div className="text-2xl font-bold text-purple-600">
              {busyHours.length}
            </div>
          </div>
        </div>

        {/* Time Period Insights */}
        <div className="mt-8 space-y-4">
          <div className="flex items-center justify-between p-4 bg-red-50/80 backdrop-blur-sm rounded-2xl border border-red-200/60">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100/80 rounded-xl">
                <Clock className="w-5 h-5 text-red-600" />
              </div>
              <span className="text-sm font-bold text-red-800">
                High Activity Period
              </span>
            </div>
            <div className="text-sm text-red-700 font-semibold bg-white/80 backdrop-blur-sm px-3 py-2 rounded-xl">
              {busyHours.length > 0
                ? `${Math.min(...busyHours.map((h) => h.hour))}:00 - ${Math.max(
                    ...busyHours.map((h) => h.hour)
                  )}:00`
                : "No high activity periods"}
            </div>
          </div>

          {peakHour.anomalies > 0 && (
            <div className="flex items-center justify-between p-4 bg-amber-50/80 backdrop-blur-sm rounded-2xl border border-amber-200/60">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100/80 rounded-xl">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                </div>
                <span className="text-sm font-bold text-amber-800">
                  Most Critical Hour
                </span>
              </div>
              <div className="text-sm text-amber-700 font-semibold bg-white/80 backdrop-blur-sm px-3 py-2 rounded-xl">
                {peakHour.hour}:00 with {peakHour.anomalies} anomalies
              </div>
            </div>
          )}

          <div className="flex items-center justify-between p-4 bg-blue-50/80 backdrop-blur-sm rounded-2xl border border-blue-200/60">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100/80 rounded-xl">
                <TrendingUp className="w-5 h-5 text-blue-800" />
              </div>
              <span className="text-sm font-bold text-blue-800">
                Detection Rate
              </span>
            </div>
            <div className="text-sm text-blue-800 font-semibold bg-white/80 backdrop-blur-sm px-3 py-2 rounded-xl">
              {(
                (data.filter((h) => h.anomalies > 0).length / data.length) *
                100
              ).toFixed(1)}
              % of hours have anomalies
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnomaliesByHourChart;
