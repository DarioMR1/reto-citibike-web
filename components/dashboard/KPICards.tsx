"use client";

import React from "react";
import { Eye, DollarSign, Target, Users } from "lucide-react";
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
      icon: Eye,
      bgColor: "bg-blue-800/10",
      iconColor: "text-blue-800",
      hoverColor: "hover:bg-blue-800/15",
    },
    {
      title: "Total Revenue",
      value: `$${(data?.ingresos_totales || 0).toLocaleString()}`,
      icon: DollarSign,
      bgColor: "bg-emerald-600/10",
      iconColor: "text-emerald-600",
      hoverColor: "hover:bg-emerald-600/15",
    },
    {
      title: "Average Revenue",
      value: `$${(data?.ingreso_promedio || 0).toFixed(2)}`,
      icon: Target,
      bgColor: "bg-slate-600/10",
      iconColor: "text-slate-700",
      hoverColor: "hover:bg-slate-600/15",
    },
    {
      title: "Active Stations",
      value: data?.estaciones_activas?.toLocaleString() || "0",
      icon: Users,
      bgColor: "bg-blue-800/10",
      iconColor: "text-blue-800",
      hoverColor: "hover:bg-blue-800/15",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[1, 2, 3, 4].map((i) => (
          <Card
            key={i}
            className="border-0 bg-white/70 backdrop-blur-sm shadow-lg rounded-2xl animate-pulse"
          >
            <CardContent className="p-8">
              <div className="h-4 bg-slate-200/70 rounded-xl mb-4"></div>
              <div className="h-8 bg-slate-200/70 rounded-xl mb-4"></div>
              <div className="h-4 bg-slate-200/70 rounded-xl w-16"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {kpiItems.map((item, index) => {
        const Icon = item.icon;

        return (
          <Card
            key={index}
            className="border-0 bg-white/70 backdrop-blur-md shadow-lg hover:shadow-xl rounded-2xl transition-all duration-300 hover:scale-[1.02]"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-sm font-semibold text-slate-700">
                {item.title}
              </CardTitle>
              <div
                className={`w-12 h-12 ${item.bgColor} ${item.hoverColor} rounded-xl flex items-center justify-center transition-colors duration-200`}
              >
                <Icon className={`w-6 h-6 ${item.iconColor}`} />
              </div>
            </CardHeader>
            <CardContent className="pb-6">
              <div className="text-3xl font-bold text-slate-900 mb-3">
                {item.value}
              </div>
              <div className="text-sm text-slate-600 font-medium">
                Current data from CitiBike system
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default KPICards;
