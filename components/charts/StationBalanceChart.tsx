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
      <Card className="border-0 bg-white/70 backdrop-blur-md shadow-lg rounded-3xl">
        <CardHeader className="bg-gradient-to-r from-slate-900/5 to-blue-800/5 backdrop-blur-sm rounded-t-3xl">
          <CardTitle className="text-xl font-bold text-slate-900">
            Station Balance Analysis
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
            Station Balance Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="text-center py-12">
            <div className="p-4 bg-blue-800/10 rounded-2xl w-fit mx-auto mb-6">
              <MapPin className="w-12 h-12 text-blue-800" />
            </div>
            <p className="text-slate-700 font-medium">
              No station data available
            </p>
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
    return "#64748b"; // Gray for balanced
  };

  return (
    <Card className="border-0 bg-white/70 backdrop-blur-md shadow-lg rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-slate-900/5 to-blue-800/5 backdrop-blur-sm border-b border-slate-200/60">
        <div className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-slate-900 mb-3">
              Station Balance Analysis
            </CardTitle>
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <div className="p-1 bg-emerald-100/70 rounded-lg mr-2">
                  <TrendingUp className="w-3 h-3 text-emerald-600" />
                </div>
                <span className="text-sm font-semibold text-slate-700">
                  Excess: {excessStations}
                </span>
              </div>
              <div className="flex items-center">
                <div className="p-1 bg-red-100/70 rounded-lg mr-2">
                  <TrendingDown className="w-3 h-3 text-red-600" />
                </div>
                <span className="text-sm font-semibold text-slate-700">
                  Deficit: {deficitStations}
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold text-slate-600">
              Total Stations
            </div>
            <div className="text-2xl font-bold text-slate-900">
              {totalStations}
            </div>
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
              dataKey="station_id"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#475569", fontSize: 10, fontWeight: 500 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#475569", fontSize: 12, fontWeight: 500 }}
              label={{
                value: "Balance (bikes)",
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
              labelFormatter={(label) => `Station: ${label}`}
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
            <ReferenceLine y={0} stroke="#475569" strokeDasharray="2 2" />
            <Bar dataKey="balance" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.balance)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Summary Statistics */}
        <div className="mt-8 grid grid-cols-4 gap-6 pt-6 border-t border-slate-200/60">
          <div className="text-center p-4 bg-slate-50/70 backdrop-blur-sm rounded-xl">
            <div className="text-sm font-semibold text-emerald-700">
              Excess Stations
            </div>
            <div className="text-lg font-bold text-emerald-600">
              {excessStations}
            </div>
            <div className="text-xs text-emerald-600 font-medium">
              Max: +{maxExcess}
            </div>
          </div>
          <div className="text-center p-4 bg-slate-50/70 backdrop-blur-sm rounded-xl">
            <div className="text-sm font-semibold text-red-700">
              Deficit Stations
            </div>
            <div className="text-lg font-bold text-red-600">
              {deficitStations}
            </div>
            <div className="text-xs text-red-600 font-medium">
              Max: {maxDeficit}
            </div>
          </div>
          <div className="text-center p-4 bg-slate-50/70 backdrop-blur-sm rounded-xl">
            <div className="text-sm font-semibold text-slate-700">Balanced</div>
            <div className="text-lg font-bold text-slate-600">
              {balancedStations}
            </div>
            <div className="text-xs text-slate-500 font-medium">
              Perfect balance
            </div>
          </div>
          <div className="text-center p-4 bg-slate-50/70 backdrop-blur-sm rounded-xl">
            <div className="text-sm font-semibold text-blue-800">
              Balance Rate
            </div>
            <div className="text-lg font-bold text-blue-800">
              {((balancedStations / totalStations) * 100).toFixed(1)}%
            </div>
            <div className="text-xs text-blue-800/70 font-medium">
              Well balanced
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 flex justify-center space-x-8 text-sm">
          <div className="flex items-center p-3 bg-slate-50/70 backdrop-blur-sm rounded-xl">
            <div className="w-3 h-3 bg-emerald-600 rounded mr-3"></div>
            <span className="text-slate-700 font-medium">
              Excess (more arrivals)
            </span>
          </div>
          <div className="flex items-center p-3 bg-slate-50/70 backdrop-blur-sm rounded-xl">
            <div className="w-3 h-3 bg-red-600 rounded mr-3"></div>
            <span className="text-slate-700 font-medium">
              Deficit (more departures)
            </span>
          </div>
          <div className="flex items-center p-3 bg-slate-50/70 backdrop-blur-sm rounded-xl">
            <div className="w-3 h-3 bg-slate-600 rounded mr-3"></div>
            <span className="text-slate-700 font-medium">Balanced</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StationBalanceChart;
