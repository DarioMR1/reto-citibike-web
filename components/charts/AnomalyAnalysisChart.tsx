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
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Eye, Target, Zap } from "lucide-react";

interface AnomalyStats {
  num_anomalies: number;
  total_records: number;
  anomaly_rate: number;
}

interface AnomalyRecord {
  STATION_ID?: string;
  station_id?: string;
  HOUR?: number;
  hour?: number;
  INGRESO_PROMEDIO?: number;
  ingreso_promedio?: number;
  VIAJES_COUNT?: number;
  viajes_count?: number;
  IS_WEEKEND?: boolean;
  is_weekend?: boolean;
}

interface ScatterDataPoint {
  x: number;
  y: number;
  type: string;
}

interface ScatterData {
  normal_points: ScatterDataPoint[];
  anomaly_points: ScatterDataPoint[];
}

interface AnomalyAnalysisChartProps {
  stats?: AnomalyStats;
  topAnomalies?: AnomalyRecord[];
  scatterData?: ScatterData;
  loading?: boolean;
}

const AnomalyAnalysisChart = ({
  stats,
  topAnomalies,
  scatterData,
  loading = false,
}: AnomalyAnalysisChartProps) => {
  if (loading) {
    return (
      <Card className="border-0 bg-white/70 backdrop-blur-md shadow-lg rounded-3xl">
        <CardHeader className="bg-gradient-to-r from-slate-900/5 to-purple-800/5 backdrop-blur-sm rounded-t-3xl">
          <CardTitle className="text-xl font-bold text-slate-900">
            Anomaly Detection Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="h-80 bg-slate-100/70 animate-pulse rounded-2xl"></div>
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card className="border-0 bg-white/70 backdrop-blur-md shadow-lg rounded-3xl">
        <CardHeader className="bg-gradient-to-r from-slate-900/5 to-purple-800/5 backdrop-blur-sm rounded-t-3xl">
          <CardTitle className="text-xl font-bold text-slate-900">
            Anomaly Detection Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="text-center py-12">
            <div className="p-4 bg-purple-100/80 backdrop-blur-sm rounded-2xl w-fit mx-auto mb-6">
              <AlertTriangle className="w-12 h-12 text-purple-600" />
            </div>
            <p className="text-slate-700 font-medium">
              No anomaly analysis data available
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatTooltip = (value: number | string, name: string) => {
    if (name === "y") {
      return [`${value} trips`, "Trip Count"];
    }
    if (name === "x") {
      return [`$${Number(value).toFixed(2)}`, "Average Revenue"];
    }
    return [value, name];
  };

  // Prepare scatter plot data
  const prepareScatterData = () => {
    if (!scatterData) return [];

    const normalData = scatterData.normal_points.map((point) => ({
      x: point.x,
      y: point.y,
      type: "normal",
    }));

    const anomalyData = scatterData.anomaly_points.map((point) => ({
      x: point.x,
      y: point.y,
      type: "anomaly",
    }));

    return [...normalData, ...anomalyData];
  };

  const scatterPlotData = prepareScatterData();

  return (
    <Card className="border-0 bg-white/70 backdrop-blur-md shadow-lg rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-slate-900/5 to-purple-800/5 backdrop-blur-sm border-b border-slate-200/60">
        <div className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-slate-900 mb-3">
              Anomaly Detection Analysis
            </CardTitle>
            <div className="flex items-center gap-3">
              <Target className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-semibold text-slate-700">
                Detection Rate: {stats.anomaly_rate.toFixed(1)}%
              </span>
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-3 py-1 rounded-xl font-bold shadow-md">
                {stats.num_anomalies} detected
              </div>
            </div>
          </div>
          <div className="text-right p-4 bg-white/60 backdrop-blur-sm rounded-2xl shadow-sm">
            <div className="text-sm font-semibold text-slate-600">
              Total Anomalies
            </div>
            <div className="text-2xl font-bold text-purple-600">
              {stats.num_anomalies}
            </div>
            <div className="text-sm text-slate-500 font-medium">
              Out of {stats.total_records}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="text-center p-6 bg-purple-50/80 backdrop-blur-sm rounded-2xl shadow-sm">
            <div className="flex items-center justify-center mb-3">
              <div className="p-3 bg-purple-100/80 rounded-xl">
                <AlertTriangle className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="text-sm font-semibold text-purple-700 mb-1">
              Anomalies Detected
            </div>
            <div className="text-2xl font-bold text-purple-600">
              {stats.num_anomalies}
            </div>
            <div className="text-xs text-purple-500 font-medium mt-1">
              Consensus anomalies
            </div>
          </div>

          <div className="text-center p-6 bg-blue-50/80 backdrop-blur-sm rounded-2xl shadow-sm">
            <div className="flex items-center justify-center mb-3">
              <div className="p-3 bg-blue-100/80 rounded-xl">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="text-sm font-semibold text-blue-700 mb-1">
              Detection Rate
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {stats.anomaly_rate.toFixed(1)}%
            </div>
            <div className="text-xs text-blue-500 font-medium mt-1">
              Of total records
            </div>
          </div>

          <div className="text-center p-6 bg-green-50/80 backdrop-blur-sm rounded-2xl shadow-sm">
            <div className="flex items-center justify-center mb-3">
              <div className="p-3 bg-green-100/80 rounded-xl">
                <Zap className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="text-sm font-semibold text-green-700 mb-1">
              Normal Patterns
            </div>
            <div className="text-2xl font-bold text-green-600">
              {stats.total_records - stats.num_anomalies}
            </div>
            <div className="text-xs text-green-500 font-medium mt-1">
              Expected behavior
            </div>
          </div>
        </div>

        {/* Scatter Plot */}
        {scatterPlotData.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5" />
              Revenue vs Trip Count Analysis
            </h3>
            <div className="bg-slate-50/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-6">
              <ResponsiveContainer width="100%" height={400}>
                <ScatterChart
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="Average Revenue"
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
                    name="Trip Count"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#475569", fontSize: 12, fontWeight: 500 }}
                    label={{
                      value: "Trip Count",
                      angle: -90,
                      position: "insideLeft",
                      style: { fontSize: "12px", fontWeight: 600 },
                    }}
                  />
                  <Tooltip
                    formatter={formatTooltip}
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
                  {/* Normal points */}
                  <Scatter
                    data={scatterData?.normal_points || []}
                    fill="#10B981"
                    fillOpacity={0.6}
                    stroke="#059669"
                    strokeWidth={1}
                  />
                  {/* Anomaly points */}
                  <Scatter
                    data={scatterData?.anomaly_points || []}
                    fill="#DC2626"
                    fillOpacity={0.8}
                    stroke="#B91C1C"
                    strokeWidth={2}
                  />
                </ScatterChart>
              </ResponsiveContainer>

              {/* Legend */}
              <div className="mt-4 flex justify-center space-x-8 text-sm">
                <div className="flex items-center p-3 bg-white/70 backdrop-blur-sm rounded-xl">
                  <div className="w-3 h-3 bg-green-600 rounded-full mr-3"></div>
                  <span className="text-slate-700 font-medium">
                    Normal Patterns ({scatterData?.normal_points?.length || 0})
                  </span>
                </div>
                <div className="flex items-center p-3 bg-white/70 backdrop-blur-sm rounded-xl">
                  <div className="w-3 h-3 bg-red-600 rounded-full mr-3"></div>
                  <span className="text-slate-700 font-medium">
                    Anomalies ({scatterData?.anomaly_points?.length || 0})
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Top Anomalies */}
        {topAnomalies && topAnomalies.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Top Anomalies
            </h3>
            <div className="bg-red-50/80 backdrop-blur-sm border border-red-200/60 rounded-2xl p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-red-200">
                      <th className="text-left py-2 px-3 font-semibold text-red-700">
                        Station
                      </th>
                      <th className="text-left py-2 px-3 font-semibold text-red-700">
                        Hour
                      </th>
                      <th className="text-left py-2 px-3 font-semibold text-red-700">
                        Avg Revenue
                      </th>
                      <th className="text-left py-2 px-3 font-semibold text-red-700">
                        Trip Count
                      </th>
                      <th className="text-left py-2 px-3 font-semibold text-red-700">
                        Weekend
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {topAnomalies
                      .slice(0, 5)
                      .map((anomaly: AnomalyRecord, index: number) => (
                        <tr key={index} className="border-b border-red-100">
                          <td className="py-2 px-3 font-medium text-red-800">
                            {anomaly.STATION_ID || anomaly.station_id || "N/A"}
                          </td>
                          <td className="py-2 px-3 text-red-600">
                            {anomaly.HOUR || anomaly.hour || "N/A"}:00
                          </td>
                          <td className="py-2 px-3 text-red-600 font-bold">
                            $
                            {(
                              anomaly.INGRESO_PROMEDIO ||
                              anomaly.ingreso_promedio ||
                              0
                            ).toFixed(2)}
                          </td>
                          <td className="py-2 px-3 text-red-600 font-bold">
                            {anomaly.VIAJES_COUNT ||
                              anomaly.viajes_count ||
                              "N/A"}
                          </td>
                          <td className="py-2 px-3">
                            <span
                              className={`px-2 py-1 rounded-lg text-xs font-medium ${
                                anomaly.IS_WEEKEND || anomaly.is_weekend
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {anomaly.IS_WEEKEND || anomaly.is_weekend
                                ? "Weekend"
                                : "Weekday"}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Analysis Summary */}
        <div className="bg-gradient-to-r from-purple-50/80 to-blue-50/80 backdrop-blur-sm border border-purple-200/60 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-purple-800 mb-4 flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Detection Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-purple-700 mb-3">
                Model Performance
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-600">Total Records:</span>
                  <span className="font-bold text-purple-800">
                    {stats.total_records.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-600">Anomalies Found:</span>
                  <span className="font-bold text-purple-800">
                    {stats.num_anomalies}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-600">Detection Rate:</span>
                  <span className="font-bold text-purple-800">
                    {stats.anomaly_rate.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-purple-700 mb-3">Insights</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-purple-600">
                    Anomalies represent unusual patterns in revenue-trip
                    relationships
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-purple-600">
                    High revenue with low trip count indicates premium usage
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-purple-600">
                    Low revenue with high trips suggests operational issues
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnomalyAnalysisChart;
