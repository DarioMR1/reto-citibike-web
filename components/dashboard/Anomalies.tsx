"use client";

import React, { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2, Shield } from "lucide-react";
import AnomaliesScatterChart from "@/components/charts/AnomaliesScatterChart";
import AnomaliesByHourChart from "@/components/charts/AnomaliesByHourChart";
import type { AnomaliesProps } from "@/types";
import * as apiService from "@/services/api";

const Anomalies: React.FC<AnomaliesProps> = ({
  status,
  anomaliesData,
  anomaliesScatterData,
  chartsLoading,
  trainingUnsupervised,
  onTrainUnsupervised,
  onNavigateToTraining, // New prop for navigation
}) => {
  // Load cached anomaly data on component mount
  useEffect(() => {
    // Only load from cache if we don't have current data and models are trained
    if (
      status?.unsupervised_model &&
      !anomaliesScatterData.normal_points.length &&
      !anomaliesScatterData.anomaly_points.length
    ) {
      const cachedAnomalyScatterData = apiService.getCachedTrainingResult(
        "analysis_anomaly_scatter_data"
      );
      if (cachedAnomalyScatterData) {
        console.log(
          "📦 Loaded anomaly scatter data from cache in Anomalies component"
        );
        // Note: We can't directly update the parent state from here,
        // but the parent component should handle this
      }
    }
  }, [status, anomaliesScatterData]);

  return (
    <div className="bg-gradient-to-br from-slate-50 via-white to-slate-100/50">
      <div className="space-y-8 max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="p-4 bg-gradient-to-br from-blue-800/90 to-slate-900/90 backdrop-blur-sm rounded-2xl shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-slate-900 bg-clip-text text-transparent">
              Anomaly Detection
            </h1>
          </div>
          <p className="text-lg text-slate-700 max-w-3xl mx-auto leading-relaxed">
            Analyze unusual patterns in CitiBike station usage using advanced ML
            algorithms
          </p>
        </div>

        {status?.unsupervised_model ? (
          <>
            {/* Anomaly Scatter Plot */}
            <AnomaliesScatterChart
              normalPoints={anomaliesScatterData.normal_points}
              anomalyPoints={anomaliesScatterData.anomaly_points}
              loading={chartsLoading}
            />

            {/* Anomalies by Hour */}
            <AnomaliesByHourChart
              data={anomaliesData}
              loading={chartsLoading}
            />
          </>
        ) : (
          <Card className="border-0 bg-white/70 backdrop-blur-md shadow-xl rounded-3xl overflow-hidden">
            <CardHeader className="pb-6 bg-gradient-to-r from-slate-900/5 to-blue-800/5 backdrop-blur-sm">
              <CardTitle className="flex items-center gap-3 text-2xl text-slate-900">
                <div className="p-2 bg-blue-800/10 rounded-xl">
                  <Shield className="w-5 h-5 text-blue-800" />
                </div>
                Anomaly Detection Analysis
              </CardTitle>
              <CardDescription className="text-slate-700 text-base font-medium">
                Advanced ML-based anomaly detection for CitiBike station usage
                patterns
              </CardDescription>
            </CardHeader>
            <CardContent className="p-12">
              <div className="text-center">
                <div className="p-6 bg-amber-100/80 backdrop-blur-sm rounded-3xl w-fit mx-auto mb-8 shadow-lg">
                  <AlertTriangle className="w-16 h-16 text-amber-600" />
                </div>
                <p className="text-slate-800 font-bold text-xl mb-6">
                  Train the anomaly detection model first to see detailed
                  analysis
                </p>
                <p className="text-slate-600 font-medium text-lg mb-8 max-w-2xl mx-auto">
                  Our unsupervised learning model will identify unusual patterns
                  and outliers in station usage data to help optimize bike
                  distribution and predict maintenance needs.
                </p>
                <Button
                  onClick={onNavigateToTraining || onTrainUnsupervised}
                  disabled={trainingUnsupervised}
                  className="h-16 px-12 bg-gradient-to-r from-blue-800 via-slate-900 to-blue-800 hover:from-blue-900 hover:via-slate-800 hover:to-blue-900 text-white font-bold text-xl shadow-2xl transition-all duration-300 transform hover:scale-[1.02] rounded-2xl backdrop-blur-sm"
                >
                  {trainingUnsupervised ? (
                    <>
                      <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                      Training Model...
                    </>
                  ) : (
                    <>
                      <Shield className="w-6 h-6 mr-3" />
                      {onNavigateToTraining
                        ? "Go to Training"
                        : "Train Anomaly Detection"}
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Anomalies;
