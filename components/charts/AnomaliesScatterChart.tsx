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
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckCircle } from "lucide-react";

interface DataPoint {
  x: number;
  y: number;
  type: string;
}

interface AnomaliesScatterChartProps {
  normalPoints?: DataPoint[];
  anomalyPoints?: DataPoint[];
  loading?: boolean;
}

const AnomaliesScatterChart = ({
  normalPoints = [],
  anomalyPoints = [],
  loading = false,
}: AnomaliesScatterChartProps) => {
  if (loading) {
    return (
      <Card className="border-0 bg-white/70 backdrop-blur-md shadow-lg rounded-3xl">
        <CardHeader className="bg-gradient-to-r from-slate-900/5 to-blue-800/5 backdrop-blur-sm rounded-t-3xl">
          <CardTitle className="text-xl font-bold text-slate-900">
            Anomaly Detection Scatter Plot
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="h-80 bg-slate-100/70 animate-pulse rounded-2xl"></div>
        </CardContent>
      </Card>
    );
  }

  if (normalPoints.length === 0 && anomalyPoints.length === 0) {
    return (
      <Card className="border-0 bg-white/70 backdrop-blur-md shadow-lg rounded-3xl">
        <CardHeader className="bg-gradient-to-r from-slate-900/5 to-blue-800/5 backdrop-blur-sm rounded-t-3xl">
          <CardTitle className="text-xl font-bold text-slate-900">
            Anomaly Detection Scatter Plot
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="text-center py-12">
            <div className="p-4 bg-amber-100/80 backdrop-blur-sm rounded-2xl w-fit mx-auto mb-6">
              <AlertTriangle className="w-12 h-12 text-amber-600" />
            </div>
            <p className="text-slate-700 font-semibold text-lg mb-2">
              No anomaly detection data available
            </p>
            <p className="text-slate-600 font-medium">
              Train the unsupervised model first
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: Array<{ payload: DataPoint }>;
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white/95 backdrop-blur-md p-4 border border-slate-200/60 rounded-2xl shadow-2xl">
          <p className="font-bold text-slate-900 mb-2">
            {data.type === "normal" ? "Normal Point" : "Anomaly"}
          </p>
          <p className="text-blue-800 font-semibold">
            Revenue: ${data.x.toFixed(2)}
          </p>
          <p className="text-emerald-600 font-semibold">Trips: {data.y}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="border-0 bg-white/70 backdrop-blur-md shadow-lg rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-slate-900/5 to-blue-800/5 backdrop-blur-sm border-b border-slate-200/60">
        <div>
          <CardTitle className="text-xl font-bold text-slate-900 mb-3">
            Anomaly Detection: Revenue vs Trips
          </CardTitle>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="p-1 bg-emerald-100/80 rounded-lg">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
              </div>
              <span className="text-sm font-semibold text-slate-700">
                Normal: {normalPoints.length.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-1 bg-red-100/80 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-red-600" />
              </div>
              <span className="text-sm font-semibold text-slate-700">
                Anomalies: {anomalyPoints.length.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
        <div className="text-right p-4 bg-white/60 backdrop-blur-sm rounded-2xl shadow-sm">
          <div className="text-sm font-semibold text-slate-600">
            Detection Rate
          </div>
          <div className="text-2xl font-bold text-red-600">
            {(
              (anomalyPoints.length /
                (normalPoints.length + anomalyPoints.length)) *
              100
            ).toFixed(1)}
            %
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-8">
        <ResponsiveContainer width="100%" height={350}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              type="number"
              dataKey="x"
              name="Revenue"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#475569", fontSize: 12, fontWeight: 500 }}
              label={{
                value: "Average Revenue ($)",
                position: "insideBottom",
                offset: -5,
                style: { fontSize: "12px", fontWeight: 600 },
              }}
            />
            <YAxis
              type="number"
              dataKey="y"
              name="Trips"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#475569", fontSize: 12, fontWeight: 500 }}
              label={{
                value: "Number of Trips",
                angle: -90,
                position: "insideLeft",
                style: { fontSize: "12px", fontWeight: 600 },
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              height={36}
              iconType="circle"
              wrapperStyle={{ paddingBottom: "20px", fontWeight: 500 }}
            />
            <Scatter
              name="Normal Points"
              data={normalPoints}
              fill="#1e40af"
              fillOpacity={0.6}
              r={3}
            />
            <Scatter
              name="Anomalies"
              data={anomalyPoints}
              fill="#DC2626"
              fillOpacity={0.8}
              r={5}
            />
          </ScatterChart>
        </ResponsiveContainer>

        {/* Summary Statistics */}
        <div className="mt-8 grid grid-cols-2 gap-6 pt-6 border-t border-slate-200/60">
          <div className="bg-blue-50/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-blue-200/60">
            <div className="text-sm font-bold text-blue-800">Normal Points</div>
            <div className="text-2xl font-bold text-blue-800">
              {normalPoints.length.toLocaleString()}
            </div>
            {normalPoints.length > 0 && (
              <div className="text-xs text-blue-700 font-semibold mt-2 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-lg">
                Avg Revenue: $
                {(
                  normalPoints.reduce((sum, p) => sum + p.x, 0) /
                  normalPoints.length
                ).toFixed(2)}
              </div>
            )}
          </div>
          <div className="bg-red-50/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-red-200/60">
            <div className="text-sm font-bold text-red-800">
              Anomalies Detected
            </div>
            <div className="text-2xl font-bold text-red-800">
              {anomalyPoints.length.toLocaleString()}
            </div>
            {anomalyPoints.length > 0 && (
              <div className="text-xs text-red-700 font-semibold mt-2 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-lg">
                Avg Revenue: $
                {(
                  anomalyPoints.reduce((sum, p) => sum + p.x, 0) /
                  anomalyPoints.length
                ).toFixed(2)}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnomaliesScatterChart;
