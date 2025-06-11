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
        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 font-medium">
          Training
        </Badge>
      );
    }

    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200 font-medium">
            Active
          </Badge>
        );
      case "inactive":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200 font-medium">
            Inactive
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-200 font-medium">
            Unknown
          </Badge>
        );
    }
  };

  if (loading) {
    return (
      <Card className="border border-gray-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900">
            CitiBike System Integration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 bg-gray-100 animate-pulse rounded"
              >
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-gray-200 bg-white shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold text-gray-900">
          CitiBike System Integration
        </CardTitle>
        <span className="text-sm text-blue-600 cursor-pointer hover:underline font-medium">
          See All
        </span>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {/* Header */}
          <div className="grid grid-cols-4 gap-4 pb-2 text-xs font-semibold text-gray-600 uppercase tracking-wide">
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
                className="grid grid-cols-4 gap-4 py-3 items-center border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center border border-blue-100">
                    <Icon className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {integration.name}
                    </div>
                    {getStatusBadge(
                      integration.status,
                      isTraining ? "training" : undefined
                    )}
                  </div>
                </div>
                <div className="text-sm text-gray-700 font-medium">
                  {integration.type}
                </div>
                <div className="text-sm font-bold text-gray-900">
                  {integration.rate}
                </div>
                <div className="text-sm text-gray-700 font-medium">
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
