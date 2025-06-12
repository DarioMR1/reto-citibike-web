"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingDown, MapPin, AlertTriangle } from "lucide-react";

interface CounterfactualStats {
  total_loss: number;
  lost_trips: number;
  loss_per_trip: number;
  affected_stations: number;
  events_analyzed: number;
}

interface EventSample {
  STATION_ID?: string;
  HOUR?: number;
  VIAJES_PERDIDOS_ESTIMADOS?: number;
  TEMPERATURE_2M?: number;
  IS_WEEKEND?: boolean;
}

interface AnalysisMetadata {
  events_processed: number;
}

interface CounterfactualData {
  stats: CounterfactualStats;
  events_sample?: EventSample[];
  analysis_metadata?: AnalysisMetadata;
}

interface CounterfactualAnalysisChartProps {
  data?: CounterfactualData;
  loading?: boolean;
}

const CounterfactualAnalysisChart = ({
  data,
  loading = false,
}: CounterfactualAnalysisChartProps) => {
  if (loading) {
    return (
      <Card className="border-0 bg-white/70 backdrop-blur-md shadow-lg rounded-3xl">
        <CardHeader className="bg-gradient-to-r from-slate-900/5 to-red-800/5 backdrop-blur-sm rounded-t-3xl">
          <CardTitle className="text-xl font-bold text-slate-900">
            Counterfactual Revenue Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="h-80 bg-slate-100/70 animate-pulse rounded-2xl"></div>
        </CardContent>
      </Card>
    );
  }

  if (!data || !data.stats) {
    return (
      <Card className="border-0 bg-white/70 backdrop-blur-md shadow-lg rounded-3xl">
        <CardHeader className="bg-gradient-to-r from-slate-900/5 to-red-800/5 backdrop-blur-sm rounded-t-3xl">
          <CardTitle className="text-xl font-bold text-slate-900">
            Counterfactual Revenue Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="text-center py-12">
            <div className="p-4 bg-red-100/80 backdrop-blur-sm rounded-2xl w-fit mx-auto mb-6">
              <TrendingDown className="w-12 h-12 text-red-600" />
            </div>
            <p className="text-slate-700 font-medium">
              No counterfactual analysis data available
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { stats, events_sample, analysis_metadata } = data;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatLargeCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    }
    return formatCurrency(value);
  };

  return (
    <Card className="border-0 bg-white/70 backdrop-blur-md shadow-lg rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-slate-900/5 to-red-800/5 backdrop-blur-sm border-b border-slate-200/60">
        <div className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-slate-900 mb-3">
              Counterfactual Revenue Analysis
            </CardTitle>
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span className="text-sm font-semibold text-slate-700">
                Lost Revenue from Station Shortages
              </span>
              <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-xl font-bold shadow-md">
                {formatLargeCurrency(stats.total_loss)}
              </div>
            </div>
          </div>
          <div className="text-right p-4 bg-white/60 backdrop-blur-sm rounded-2xl shadow-sm">
            <div className="text-sm font-semibold text-slate-600">
              Revenue Impact
            </div>
            <div className="text-2xl font-bold text-red-600">
              {formatLargeCurrency(stats.total_loss)}
            </div>
            <div className="text-sm text-slate-500 font-medium">Total Lost</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="text-center p-6 bg-red-50/80 backdrop-blur-sm rounded-2xl shadow-sm">
            <div className="flex items-center justify-center mb-3">
              <div className="p-3 bg-red-100/80 rounded-xl">
                <DollarSign className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <div className="text-sm font-semibold text-red-700 mb-1">
              Total Revenue Loss
            </div>
            <div className="text-2xl font-bold text-red-600">
              {formatLargeCurrency(stats.total_loss)}
            </div>
            <div className="text-xs text-red-500 font-medium mt-1">
              Due to bike shortages
            </div>
          </div>

          <div className="text-center p-6 bg-orange-50/80 backdrop-blur-sm rounded-2xl shadow-sm">
            <div className="flex items-center justify-center mb-3">
              <div className="p-3 bg-orange-100/80 rounded-xl">
                <TrendingDown className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <div className="text-sm font-semibold text-orange-700 mb-1">
              Lost Trips
            </div>
            <div className="text-2xl font-bold text-orange-600">
              {stats.lost_trips.toLocaleString()}
            </div>
            <div className="text-xs text-orange-500 font-medium mt-1">
              Simulated journeys
            </div>
          </div>

          <div className="text-center p-6 bg-amber-50/80 backdrop-blur-sm rounded-2xl shadow-sm">
            <div className="flex items-center justify-center mb-3">
              <div className="p-3 bg-amber-100/80 rounded-xl">
                <DollarSign className="w-6 h-6 text-amber-600" />
              </div>
            </div>
            <div className="text-sm font-semibold text-amber-700 mb-1">
              Avg Loss per Trip
            </div>
            <div className="text-2xl font-bold text-amber-600">
              {formatCurrency(stats.loss_per_trip)}
            </div>
            <div className="text-xs text-amber-500 font-medium mt-1">
              Revenue potential
            </div>
          </div>

          <div className="text-center p-6 bg-blue-50/80 backdrop-blur-sm rounded-2xl shadow-sm">
            <div className="flex items-center justify-center mb-3">
              <div className="p-3 bg-blue-100/80 rounded-xl">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="text-sm font-semibold text-blue-700 mb-1">
              Affected Stations
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {stats.affected_stations}
            </div>
            <div className="text-xs text-blue-500 font-medium mt-1">
              With shortages
            </div>
          </div>
        </div>

        {/* Analysis Summary */}
        <div className="bg-gradient-to-r from-red-50/80 to-orange-50/80 backdrop-blur-sm border border-red-200/60 rounded-2xl p-6 mb-8">
          <h3 className="text-lg font-bold text-red-800 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Revenue Impact Analysis
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-red-700 mb-3">
                Financial Impact
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-red-600">Total Lost Revenue:</span>
                  <span className="font-bold text-red-800">
                    {formatLargeCurrency(stats.total_loss)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-600">Average per Trip:</span>
                  <span className="font-bold text-red-800">
                    {formatCurrency(stats.loss_per_trip)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-600">Events Analyzed:</span>
                  <span className="font-bold text-red-800">
                    {stats.events_analyzed}
                  </span>
                </div>
                {analysis_metadata && (
                  <div className="flex justify-between">
                    <span className="text-red-600">Sample Size:</span>
                    <span className="font-bold text-red-800">
                      {analysis_metadata.events_processed} events
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-red-700 mb-3">
                Operational Impact
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-red-600">Lost Trips:</span>
                  <span className="font-bold text-red-800">
                    {stats.lost_trips.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-600">Affected Stations:</span>
                  <span className="font-bold text-red-800">
                    {stats.affected_stations}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-600">Service Disruption:</span>
                  <span className="font-bold text-red-800">High Impact</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sample Events */}
        {events_sample && events_sample.length > 0 && (
          <div className="bg-slate-50/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Sample Shortage Events
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-2 px-3 font-semibold text-slate-700">
                      Station
                    </th>
                    <th className="text-left py-2 px-3 font-semibold text-slate-700">
                      Hour
                    </th>
                    <th className="text-left py-2 px-3 font-semibold text-slate-700">
                      Lost Trips
                    </th>
                    <th className="text-left py-2 px-3 font-semibold text-slate-700">
                      Temperature
                    </th>
                    <th className="text-left py-2 px-3 font-semibold text-slate-700">
                      Weekend
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {events_sample
                    .slice(0, 5)
                    .map((event: EventSample, index: number) => (
                      <tr key={index} className="border-b border-slate-100">
                        <td className="py-2 px-3 font-medium text-slate-800">
                          {event.STATION_ID || "N/A"}
                        </td>
                        <td className="py-2 px-3 text-slate-600">
                          {event.HOUR || "N/A"}:00
                        </td>
                        <td className="py-2 px-3 text-red-600 font-bold">
                          {event.VIAJES_PERDIDOS_ESTIMADOS || "N/A"}
                        </td>
                        <td className="py-2 px-3 text-slate-600">
                          {event.TEMPERATURE_2M
                            ? `${event.TEMPERATURE_2M.toFixed(1)}°C`
                            : "N/A"}
                        </td>
                        <td className="py-2 px-3">
                          <span
                            className={`px-2 py-1 rounded-lg text-xs font-medium ${
                              event.IS_WEEKEND
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {event.IS_WEEKEND ? "Weekend" : "Weekday"}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Recommendations */}
        <div className="mt-6 bg-blue-50/80 backdrop-blur-sm border border-blue-200/60 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-blue-800 mb-4">
            Recommendations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-blue-700">Revenue Recovery</h4>
              <ul className="text-sm text-blue-600 space-y-1">
                <li>• Improve bike redistribution during peak hours</li>
                <li>• Increase station capacity at high-demand locations</li>
                <li>• Implement predictive restocking algorithms</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-blue-700">
                Operational Efficiency
              </h4>
              <ul className="text-sm text-blue-600 space-y-1">
                <li>• Monitor shortage patterns in real-time</li>
                <li>• Deploy mobile restocking units</li>
                <li>• Optimize pricing to manage demand</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CounterfactualAnalysisChart;
