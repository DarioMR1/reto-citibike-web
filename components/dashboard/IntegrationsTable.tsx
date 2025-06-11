"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  Database,
  Zap,
  Shield,
  BarChart3,
  Activity,
} from "lucide-react";

interface Integration {
  id: string;
  name: string;
  type: string;
  status: "active" | "inactive" | "training";
  rate: string;
  description: string;
  icon: React.ComponentType<any>;
}

interface IntegrationsTableProps {
  modelStatus?: {
    supervised_model: boolean;
    unsupervised_model: boolean;
    models_loaded: boolean;
    training_status: string;
  };
  loading?: boolean;
}

const IntegrationsTable = ({
  modelStatus,
  loading = false,
}: IntegrationsTableProps) => {
  const integrations: Integration[] = [
    {
      id: "revenue_prediction",
      name: "Revenue Prediction Model",
      type: "ML Model",
      status: modelStatus?.supervised_model ? "active" : "inactive",
      rate: modelStatus?.supervised_model ? "95%" : "0%",
      description: "Excess Minute Revenue",
      icon: Brain,
    },
    {
      id: "anomaly_detection",
      name: "Anomaly Detection System",
      type: "ML Model",
      status: modelStatus?.unsupervised_model ? "active" : "inactive",
      rate: modelStatus?.unsupervised_model ? "87%" : "0%",
      description: "Station Pattern Analysis",
      icon: Shield,
    },
    {
      id: "snowflake_db",
      name: "Snowflake Data Warehouse",
      type: "Database",
      status: "active",
      rate: "99%",
      description: "CitiBike Trip Data",
      icon: Database,
    },
    {
      id: "weather_api",
      name: "Weather Integration",
      type: "API",
      status: "active",
      rate: "98%",
      description: "Temperature & Humidity",
      icon: Activity,
    },
    {
      id: "station_balance",
      name: "Station Balance Monitor",
      type: "Analytics",
      status: "active",
      rate: "94%",
      description: "Bike Availability Tracking",
      icon: BarChart3,
    },
    {
      id: "desabasto_alerts",
      name: "Shortage Event System",
      type: "Monitoring",
      status: "active",
      rate: "91%",
      description: "Critical Event Detection",
      icon: Zap,
    },
  ];

  const getStatusBadge = (status: string, trainingStatus?: string) => {
    if (trainingStatus === "training") {
      return (
        <Badge className="bg-amber-100/80 text-amber-800 border-amber-200/60 font-semibold rounded-xl backdrop-blur-sm">
          Training
        </Badge>
      );
    }

    switch (status) {
      case "active":
        return (
          <Badge className="bg-emerald-100/80 text-emerald-800 border-emerald-200/60 font-semibold rounded-xl backdrop-blur-sm">
            Active
          </Badge>
        );
      case "inactive":
        return (
          <Badge className="bg-red-100/80 text-red-800 border-red-200/60 font-semibold rounded-xl backdrop-blur-sm">
            Inactive
          </Badge>
        );
      default:
        return (
          <Badge className="bg-slate-100/80 text-slate-800 border-slate-200/60 font-semibold rounded-xl backdrop-blur-sm">
            Unknown
          </Badge>
        );
    }
  };

  if (loading) {
    return (
      <Card className="border-0 bg-white/70 backdrop-blur-md shadow-lg rounded-3xl">
        <CardHeader className="bg-gradient-to-r from-slate-900/5 to-blue-800/5 backdrop-blur-sm rounded-t-3xl">
          <CardTitle className="text-xl font-bold text-slate-900">
            CitiBike System Integration
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between p-6 bg-slate-100/70 animate-pulse rounded-2xl backdrop-blur-sm"
              >
                <div className="h-4 bg-slate-200/80 rounded-xl w-32"></div>
                <div className="h-4 bg-slate-200/80 rounded-xl w-16"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 bg-white/70 backdrop-blur-md shadow-lg rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-slate-900/5 to-blue-800/5 backdrop-blur-sm border-b border-slate-200/60">
        <CardTitle className="text-xl font-bold text-slate-900">
          CitiBike System Integration
        </CardTitle>
        <span className="text-sm text-blue-800 cursor-pointer hover:text-blue-900 font-semibold transition-colors duration-200 bg-blue-50/80 backdrop-blur-sm px-4 py-2 rounded-xl">
          See All
        </span>
      </CardHeader>
      <CardContent className="p-8">
        <div className="space-y-1">
          {/* Header */}
          <div className="grid grid-cols-4 gap-6 pb-4 text-xs font-bold text-slate-600 uppercase tracking-wider bg-slate-50/70 backdrop-blur-sm rounded-xl p-4">
            <span>System</span>
            <span>Type</span>
            <span>Uptime</span>
            <span>Function</span>
          </div>

          {/* Rows */}
          {integrations.map((integration) => {
            const Icon = integration.icon;
            const isTraining =
              modelStatus?.training_status === "training" &&
              (integration.id === "revenue_prediction" ||
                integration.id === "anomaly_detection");

            return (
              <div
                key={integration.id}
                className="grid grid-cols-4 gap-6 py-6 items-center border-b border-slate-200/60 last:border-b-0 hover:bg-slate-50/50 backdrop-blur-sm transition-colors duration-200 rounded-xl px-4"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-800/10 to-slate-900/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-blue-200/40 shadow-sm">
                    <Icon className="w-5 h-5 text-blue-800" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm">
                      {integration.name}
                    </div>
                    <div className="mt-2">
                      {getStatusBadge(
                        integration.status,
                        isTraining ? "training" : undefined
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-slate-700 font-semibold bg-slate-100/70 backdrop-blur-sm px-3 py-2 rounded-xl">
                  {integration.type}
                </div>
                <div className="text-sm font-bold text-slate-900 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-xl shadow-sm">
                  {integration.rate}
                </div>
                <div className="text-sm text-slate-700 font-semibold">
                  {integration.description}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default IntegrationsTable;
