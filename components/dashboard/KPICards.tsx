"use client";

import React from "react";
import {
  TrendingUp,
  TrendingDown,
  Eye,
  DollarSign,
  Target,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface KPIData {
  total_viajes: number;
  ingresos_totales: number;
  ingreso_promedio: number;
  estaciones_activas: number;
  viajes_con_ingresos?: number;
}

interface KPICardsProps {
  data: KPIData | null;
  loading?: boolean;
}

const KPICards = ({ data, loading = false }: KPICardsProps) => {
  const kpiItems = [
    {
      title: "Total Trips",
      value: data?.total_viajes?.toLocaleString() || "0",
      change: "+15.8%",
      changeType: "increase" as const,
      icon: Eye,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Total Revenue",
      value: `$${(data?.ingresos_totales || 0).toLocaleString()}`,
      change: "-34.0%",
      changeType: "decrease" as const,
      icon: DollarSign,
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      title: "Trips with Revenue",
      value: `${(data?.viajes_con_ingresos || 0).toFixed(1)}%`,
      change: "+24.2%",
      changeType: "increase" as const,
      icon: Target,
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
    },
    {
      title: "Active Stations",
      value: data?.estaciones_activas?.toLocaleString() || "0",
      change: "+8.3%",
      changeType: "increase" as const,
      icon: Users,
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {kpiItems.map((item, index) => {
        const Icon = item.icon;
        const TrendIcon =
          item.changeType === "increase" ? TrendingUp : TrendingDown;

        return (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {item.title}
              </CardTitle>
              <div
                className={`w-10 h-10 ${item.bgColor} rounded-lg flex items-center justify-center`}
              >
                <Icon className={`w-5 h-5 ${item.iconColor}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {item.value}
              </div>
              <div className="flex items-center text-sm">
                <TrendIcon
                  className={`w-4 h-4 mr-1 ${
                    item.changeType === "increase"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                />
                <span
                  className={`font-medium ${
                    item.changeType === "increase"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {item.change}
                </span>
                <span className="text-gray-500 ml-1">vs last month</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default KPICards;
