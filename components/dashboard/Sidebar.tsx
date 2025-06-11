"use client";

import React, { useState } from "react";
import {
  Home,
  CreditCard,
  Users,
  MessageSquare,
  Package,
  FileText,
  BarChart3,
  Settings,
  Shield,
  HelpCircle,
  ChevronLeft,
  Brain,
  Activity,
} from "lucide-react";

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const Sidebar = ({ activeSection, onSectionChange }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "models", label: "Models", icon: Brain },
    { id: "predictions", label: "Predictions", icon: Activity },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "anomalies", label: "Anomalies", icon: Shield },
    { id: "training", label: "Training", icon: Package },
  ];

  const supportItems = [
    { id: "settings", label: "Settings", icon: Settings },
    { id: "help", label: "Help", icon: HelpCircle },
  ];

  return (
    <div
      className={`${
        isCollapsed ? "w-16" : "w-64"
      } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col h-screen fixed left-0 top-0 z-50 shadow-sm`}
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-sm">CB</span>
              </div>
              <span className="font-bold text-xl text-gray-900">CitiBike</span>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft
              className={`w-5 h-5 text-gray-600 transition-transform ${
                isCollapsed ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* User Profile */}
      {!isCollapsed && (
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center shadow-sm">
              <span className="text-white font-semibold">DA</span>
            </div>
            <div>
              <div className="font-semibold text-gray-900">Data Analyst</div>
              <div className="text-sm text-gray-600">Analytics Team</div>
            </div>
          </div>
        </div>
      )}

      {/* General Menu */}
      <div className="flex-1 py-6">
        {!isCollapsed && (
          <div className="px-6 mb-4">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              GENERAL
            </span>
          </div>
        )}
        <nav className="space-y-1 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`w-full flex items-center px-3 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                  activeSection === item.id
                    ? "bg-blue-600 text-white shadow-sm border-2 border-blue-700"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <Icon
                  className={`w-5 h-5 mr-3 ${
                    activeSection === item.id ? "text-white" : "text-gray-600"
                  }`}
                />
                {!isCollapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Support Menu */}
      <div className="py-6 border-t border-gray-200">
        {!isCollapsed && (
          <div className="px-6 mb-4">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              SUPPORT
            </span>
          </div>
        )}
        <nav className="space-y-1 px-3">
          {supportItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`w-full flex items-center px-3 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                  activeSection === item.id
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <Icon
                  className={`w-5 h-5 mr-3 ${
                    activeSection === item.id ? "text-white" : "text-gray-600"
                  }`}
                />
                {!isCollapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
