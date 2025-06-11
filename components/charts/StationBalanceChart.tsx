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
  Cell,
  ReferenceLine,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, MapPin } from "lucide-react";

interface StationBalanceChartProps {
  data?: any[];
  loading?: boolean;
}

const StationBalanceChart = ({
  data,
  loading = false,
}: StationBalanceChartProps) => {
  const formatTooltip = (value: any, name: any) => {
    if (name === "balance") {
      const label = value > 0 ? "Excess" : "Deficit";
      return [`${Math.abs(value)} bikes`, label];
    }
    if (name === "departures") {
      return [value.toLocaleString(), "Departures"];
    }
    if (name === "arrivals") {
      return [value.toLocaleString(), "Arrivals"];
    }
    return [value, name];
  };

  if (loading) {
    return (
      <Card className="border border-gray-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900">
            Station Balance Analysis
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
            Station Balance Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No station data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate statistics
  const totalStations = data.length;
  const deficitStations = data.filter((station) => station.balance < 0).length;
  const excessStations = data.filter((station) => station.balance > 0).length;
  const balancedStations = data.filter(
    (station) => station.balance === 0
  ).length;

  const maxDeficit = Math.min(...data.map((station) => station.balance));
  const maxExcess = Math.max(...data.map((station) => station.balance));

  // Color function for bars
  const getBarColor = (balance: number) => {
    if (balance > 0) return "#059669"; // Green for excess
    if (balance < 0) return "#DC2626"; // Red for deficit
    return "#6B7280"; // Gray for balanced
  };

  return (
    <Card className="border border-gray-200 bg-white shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Station Balance Analysis
          </CardTitle>
          <div className="flex items-center mt-2 space-x-4">
            <div className="flex items-center">
              <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
              <span className="text-sm text-gray-600">
                Excess: {excessStations}
              </span>
            </div>
            <div className="flex items-center">
              <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
              <span className="text-sm text-gray-600">
                Deficit: {deficitStations}
              </span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600">Total Stations</div>
          <div className="text-xl font-bold text-gray-900">{totalStations}</div>
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
              dataKey="station_id"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#374151", fontSize: 10, fontWeight: 500 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#374151", fontSize: 12, fontWeight: 500 }}
              label={{
                value: "Balance (bikes)",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip
              formatter={formatTooltip}
              labelFormatter={(label) => `Station: ${label}`}
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
            <ReferenceLine y={0} stroke="#374151" strokeDasharray="2 2" />
            <Bar dataKey="balance" radius={[2, 2, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.balance)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Summary Statistics */}
        <div className="mt-4 grid grid-cols-4 gap-4 pt-4 border-t border-gray-200">
          <div className="text-center">
            <div className="text-sm text-green-700 font-medium">
              Excess Stations
            </div>
            <div className="text-lg font-bold text-green-600">
              {excessStations}
            </div>
            <div className="text-xs text-green-600">Max: +{maxExcess}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-red-700 font-medium">
              Deficit Stations
            </div>
            <div className="text-lg font-bold text-red-600">
              {deficitStations}
            </div>
            <div className="text-xs text-red-600">Max: {maxDeficit}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-700 font-medium">Balanced</div>
            <div className="text-lg font-bold text-gray-600">
              {balancedStations}
            </div>
            <div className="text-xs text-gray-500">Perfect balance</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-blue-700 font-medium">
              Balance Rate
            </div>
            <div className="text-lg font-bold text-blue-600">
              {((balancedStations / totalStations) * 100).toFixed(1)}%
            </div>
            <div className="text-xs text-blue-500">Well balanced</div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex justify-center space-x-6 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-600 rounded mr-2"></div>
            <span className="text-gray-700">Excess (more arrivals)</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-600 rounded mr-2"></div>
            <span className="text-gray-700">Deficit (more departures)</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gray-600 rounded mr-2"></div>
            <span className="text-gray-700">Balanced</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StationBalanceChart;
