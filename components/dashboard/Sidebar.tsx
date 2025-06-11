"use client";

import React, { useState } from "react";
import { Home, Activity, Shield, Package, ChevronLeft } from "lucide-react";

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const Sidebar = ({ activeSection, onSectionChange }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "predictions", label: "Predictions", icon: Activity },
    { id: "anomalies", label: "Anomalies", icon: Shield },
    { id: "training", label: "Training", icon: Package },
  ];

  return (
    <div
      className={`${
        isCollapsed ? "w-16" : "w-64"
      } bg-white/80 backdrop-blur-md border-r border-slate-200/60 transition-all duration-300 flex flex-col h-screen fixed left-0 top-0 z-50 shadow-xl`}
    >
      {/* Header */}
      <div className="p-6 border-b border-slate-200/60 bg-gradient-to-r from-slate-900/5 to-blue-800/5 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-800 to-slate-900 rounded-2xl flex items-center justify-center shadow-lg backdrop-blur-sm">
                <span className="text-white font-bold text-lg">CB</span>
              </div>
              <span className="font-bold text-2xl bg-gradient-to-r from-slate-900 via-blue-800 to-slate-900 bg-clip-text text-transparent">
                CitiBike
              </span>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-slate-100/80 backdrop-blur-sm rounded-xl transition-all duration-200 hover:shadow-md"
          >
            <ChevronLeft
              className={`w-5 h-5 text-slate-700 transition-transform duration-300 ${
                isCollapsed ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Main Menu */}
      <div className="flex-1 py-8">
        {!isCollapsed && (
          <div className="px-6 mb-6">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              NAVIGATION
            </span>
          </div>
        )}
        <nav className="space-y-2 px-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`w-full flex items-center px-4 py-3.5 text-sm font-bold rounded-2xl transition-all duration-300 ${
                  activeSection === item.id
                    ? "bg-gradient-to-r from-blue-800 to-slate-900 text-white shadow-xl backdrop-blur-sm transform scale-[1.02]"
                    : "text-slate-700 hover:bg-slate-100/80 hover:text-slate-900 backdrop-blur-sm hover:shadow-md hover:transform hover:scale-[1.01]"
                }`}
              >
                <Icon
                  className={`w-5 h-5 mr-4 transition-colors duration-200 ${
                    activeSection === item.id ? "text-white" : "text-slate-600"
                  }`}
                />
                {!isCollapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-slate-200/60 bg-gradient-to-r from-slate-50/80 to-blue-50/80 backdrop-blur-sm">
        {!isCollapsed && (
          <div className="text-center">
            <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
              ML Analytics Platform
            </div>
            <div className="text-sm text-slate-800 font-bold">v2.1.0</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
