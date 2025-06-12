"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import KPICards from "@/components/dashboard/KPICards";
import RevenueByHourChart from "@/components/charts/RevenueByHourChart";
import StationBalanceChart from "@/components/charts/StationBalanceChart";
import UserTypeDistributionChart from "@/components/charts/UserTypeDistributionChart";
import AnomaliesByHourChart from "@/components/charts/AnomaliesByHourChart";
import WeatherImpactChart from "@/components/charts/WeatherImpactChart";
import type { DashboardProps } from "@/types";

const Dashboard: React.FC<DashboardProps> = ({
  kpis,
  loading,
  chartsLoading,
  revenueByHourData,
  stationBalanceData,
  userTypeData,
  anomaliesData,
  weatherImpactData,
  onRefreshData,
}) => {
  return (
    <div className="bg-gradient-to-br from-slate-50 via-white to-slate-100/50">
      <div className="space-y-8 max-w-7xl mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-slate-900 bg-clip-text text-transparent">
              CitiBike Analytics Dashboard
            </h1>
            <p className="text-slate-700 mt-2 text-lg font-medium">
              Real-time insights from Snowflake data warehouse
            </p>
          </div>
          <Button
            onClick={onRefreshData}
            variant="outline"
            size="sm"
            disabled={chartsLoading}
            className="border-2 border-slate-200/60 hover:border-blue-800/40 focus:border-blue-800 focus:ring-4 focus:ring-blue-800/10 bg-white/80 backdrop-blur-sm text-slate-900 font-medium rounded-xl transition-all duration-200 px-6 py-3"
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${chartsLoading ? "animate-spin" : ""}`}
            />
            Refresh Data
          </Button>
        </div>

        {/* KPIs */}
        <KPICards data={kpis} loading={loading} />

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Revenue by Hour - takes 2 columns */}
          <div className="lg:col-span-2">
            <RevenueByHourChart
              data={revenueByHourData}
              loading={chartsLoading}
            />
          </div>

          {/* User Type Distribution */}
          <UserTypeDistributionChart
            data={userTypeData}
            loading={chartsLoading}
          />
        </div>

        {/* Second row of charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Station Balance */}
          <StationBalanceChart
            data={stationBalanceData}
            loading={chartsLoading}
          />

          {/* Weather Impact */}
          <WeatherImpactChart
            data={weatherImpactData}
            loading={chartsLoading}
          />
        </div>

        {/* Anomalies Chart */}
        <AnomaliesByHourChart data={anomaliesData} loading={chartsLoading} />
      </div>
    </div>
  );
};

export default Dashboard;
