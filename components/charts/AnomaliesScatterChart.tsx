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

interface AnomaliesScatterChartProps {
  normalPoints?: any[];
  anomalyPoints?: any[];
  loading?: boolean;
}

const AnomaliesScatterChart = ({
  normalPoints = [],
  anomalyPoints = [],
  loading = false,
}: AnomaliesScatterChartProps) => {
  if (loading) {
    return (
      <Card className="border border-gray-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900">
            Anomaly Detection Scatter Plot
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 bg-gray-100 animate-pulse rounded"></div>
        </CardContent>
      </Card>
    );
  }

  if (normalPoints.length === 0 && anomalyPoints.length === 0) {
    return (
      <Card className="border border-gray-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900">
            Anomaly Detection Scatter Plot
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <p className="text-gray-600">No anomaly detection data available</p>
            <p className="text-sm text-gray-500 mt-2">
              Train the unsupervised model first
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">
            {data.type === "normal" ? "Normal Point" : "Anomaly"}
          </p>
          <p className="text-blue-600">Revenue: ${data.x.toFixed(2)}</p>
          <p className="text-green-600">Trips: {data.y}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="border border-gray-200 bg-white shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Anomaly Detection: Revenue vs Trips
          </CardTitle>
          <div className="flex items-center mt-2 space-x-4">
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-600 mr-1" />
              <span className="text-sm text-gray-600">
                Normal: {normalPoints.length.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center">
              <AlertTriangle className="w-4 h-4 text-red-600 mr-1" />
              <span className="text-sm text-gray-600">
                Anomalies: {anomalyPoints.length.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600">Detection Rate</div>
          <div className="text-xl font-bold text-red-600">
            {(
              (anomalyPoints.length /
                (normalPoints.length + anomalyPoints.length)) *
              100
            ).toFixed(1)}
            %
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              type="number"
              dataKey="x"
              name="Revenue"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#374151", fontSize: 12, fontWeight: 500 }}
              label={{
                value: "Average Revenue ($)",
                position: "insideBottom",
                offset: -5,
              }}
            />
            <YAxis
              type="number"
              dataKey="y"
              name="Trips"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#374151", fontSize: 12, fontWeight: 500 }}
              label={{
                value: "Number of Trips",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              height={36}
              iconType="circle"
              wrapperStyle={{ paddingBottom: "20px" }}
            />
            <Scatter
              name="Normal Points"
              data={normalPoints}
              fill="#2563EB"
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
        <div className="mt-4 grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="text-sm text-blue-700 font-medium">
              Normal Points
            </div>
            <div className="text-lg font-bold text-blue-900">
              {normalPoints.length.toLocaleString()}
            </div>
            {normalPoints.length > 0 && (
              <div className="text-xs text-blue-600 mt-1">
                Avg Revenue: $
                {(
                  normalPoints.reduce((sum, p) => sum + p.x, 0) /
                  normalPoints.length
                ).toFixed(2)}
              </div>
            )}
          </div>
          <div className="bg-red-50 p-3 rounded-lg">
            <div className="text-sm text-red-700 font-medium">
              Anomalies Detected
            </div>
            <div className="text-lg font-bold text-red-900">
              {anomalyPoints.length.toLocaleString()}
            </div>
            {anomalyPoints.length > 0 && (
              <div className="text-xs text-red-600 mt-1">
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
