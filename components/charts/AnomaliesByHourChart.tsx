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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AnomaliesByHourChartProps {
  data?: any[];
  loading?: boolean;
}

const AnomaliesByHourChart = ({
  data,
  loading = false,
}: AnomaliesByHourChartProps) => {
  if (loading) {
    return (
      <Card className="border border-gray-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900">Anomalies by Hour</CardTitle>
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
          <CardTitle className="text-gray-900">Anomalies by Hour</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <p className="text-gray-600">No anomaly data available</p>
            <p className="text-sm text-gray-500 mt-2">
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

  const formatTooltip = (value: any, name: any) => {
    if (name === "anomalies") {
      return [`${value} anomalies`, "Detected Anomalies"];
    }
    return [value, name];
  };

  return (
    <Card className="border border-gray-200 bg-white shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Anomalies by Hour of Day
          </CardTitle>
          <div className="flex items-center mt-2">
            <span className="text-sm text-gray-600">Peak Hour:</span>
            <span className="text-lg font-bold text-red-600 ml-2">
              {peakHour.hour}:00
            </span>
            <div className="flex items-center ml-4 text-orange-600">
              <AlertTriangle className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">
                {peakHour.anomalies} anomalies
              </span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600">Total Anomalies</div>
          <div className="text-xl font-bold text-red-600">{totalAnomalies}</div>
          <div className="text-sm text-gray-500">
            Avg: {averageAnomalies.toFixed(1)} per hour
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
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
                value: "Number of Anomalies",
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
        <div className="mt-6 grid grid-cols-4 gap-4 pt-4 border-t border-gray-200">
          <div className="text-center">
            <div className="text-sm text-gray-600">Total Anomalies</div>
            <div className="text-lg font-bold text-red-600">
              {totalAnomalies}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600">Peak Hour</div>
            <div className="text-lg font-bold text-orange-600">
              {peakHour.hour}:00
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600">Avg per Hour</div>
            <div className="text-lg font-bold text-blue-600">
              {averageAnomalies.toFixed(1)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600">Busy Hours</div>
            <div className="text-lg font-bold text-purple-600">
              {busyHours.length}
            </div>
          </div>
        </div>

        {/* Time Period Insights */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
            <div className="flex items-center">
              <Clock className="w-5 h-5 text-red-600 mr-2" />
              <span className="text-sm font-medium text-red-800">
                High Activity Period
              </span>
            </div>
            <div className="text-sm text-red-700">
              {busyHours.length > 0
                ? `${Math.min(...busyHours.map((h) => h.hour))}:00 - ${Math.max(
                    ...busyHours.map((h) => h.hour)
                  )}:00`
                : "No high activity periods"}
            </div>
          </div>

          {peakHour.anomalies > 0 && (
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-orange-600 mr-2" />
                <span className="text-sm font-medium text-orange-800">
                  Most Critical Hour
                </span>
              </div>
              <div className="text-sm text-orange-700">
                {peakHour.hour}:00 with {peakHour.anomalies} anomalies
              </div>
            </div>
          )}

          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center">
              <TrendingUp className="w-5 h-5 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-blue-800">
                Detection Rate
              </span>
            </div>
            <div className="text-sm text-blue-700">
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
