"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  Cpu,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Loader2,
  BarChart3,
  Activity,
} from "lucide-react";
import type { SystemStatus } from "@/types";
import * as apiService from "@/services/api";

import CounterfactualAnalysisChart from "@/components/charts/CounterfactualAnalysisChart";
import AnomalyAnalysisChart from "@/components/charts/AnomalyAnalysisChart";

interface TrainingProps {
  status: SystemStatus | null;
}

interface TrainingResult {
  success: boolean;
  message?: string;
  results?: {
    num_anomalias_iso?: number;
    num_anomalias_lof?: number;
    num_consenso?: number;
  };
  model_type?: string;
  metrics?: {
    r2?: number;
    rmse?: number;
    mae?: number;
  };
}

interface CounterfactualData {
  stats: {
    total_loss: number;
    lost_trips: number;
    loss_per_trip: number;
    affected_stations: number;
    events_analyzed: number;
  };
  events_sample?: Array<{
    STATION_ID?: string;
    HOUR?: number;
    VIAJES_PERDIDOS_ESTIMADOS?: number;
    TEMPERATURE_2M?: number;
    IS_WEEKEND?: boolean;
  }>;
  analysis_metadata?: {
    events_processed: number;
  };
}

interface AnomalyAnalysisData {
  stats: {
    num_anomalies: number;
    total_records: number;
    anomaly_rate: number;
  };
  top_anomalies?: Array<{
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
  }>;
  scatter_data?: {
    normal_points: Array<{ x: number; y: number; type: string }>;
    anomaly_points: Array<{ x: number; y: number; type: string }>;
  };
}

interface ScatterData {
  normal_points: Array<{ x: number; y: number; type: string }>;
  anomaly_points: Array<{ x: number; y: number; type: string }>;
}

const Training: React.FC<TrainingProps> = ({ status }) => {
  const [supervisedTraining, setSupervisedTraining] = useState(false);
  const [unsupervisedTraining, setUnsupervisedTraining] = useState(false);
  const [supervisedResult, setSupervisedResult] =
    useState<TrainingResult | null>(null);
  const [unsupervisedResult, setUnsupervisedResult] =
    useState<TrainingResult | null>(null);
  const [error, setError] = useState("");

  // Chart data states
  const [counterfactualData, setCounterfactualData] =
    useState<CounterfactualData | null>(null);
  const [anomalyAnalysisData, setAnomalyAnalysisData] =
    useState<AnomalyAnalysisData | null>(null);
  const [anomalyScatterData, setAnomalyScatterData] =
    useState<ScatterData | null>(null);
  const [chartsLoading, setChartsLoading] = useState(false);
  const [counterfactualLoading, setCounterfactualLoading] = useState(false);
  const [counterfactualProgress, setCounterfactualProgress] = useState(0);
  const [activeTab, setActiveTab] = useState<
    "training" | "supervised" | "unsupervised"
  >("training");

  const handleSupervisedTraining = async () => {
    setSupervisedTraining(true);
    setSupervisedResult(null);
    setError("");

    try {
      const result = await apiService.trainSupervisedModel();
      setSupervisedResult(result);

      if (result.success) {
        // Fetch additional data for charts
        await fetchCounterfactualAnalysis();
        // Auto-switch to supervised analysis tab
        setTimeout(() => setActiveTab("supervised"), 1000);
      } else {
        setError(result.message || "Failed to train supervised model");
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to train supervised model";
      setError(message);
      setSupervisedResult({ success: false, message });
    } finally {
      setSupervisedTraining(false);
    }
  };

  const handleUnsupervisedTraining = async () => {
    setUnsupervisedTraining(true);
    setUnsupervisedResult(null);
    setError("");

    try {
      const result = await apiService.trainUnsupervisedModel();
      setUnsupervisedResult(result);

      if (result.success) {
        // Fetch additional data for charts
        setChartsLoading(true);
        await Promise.all([fetchAnomalyAnalysis(), fetchAnomalyScatterData()]);
        setChartsLoading(false);
        // Auto-switch to unsupervised analysis tab
        setTimeout(() => setActiveTab("unsupervised"), 1000);
      } else {
        setError(result.message || "Failed to train unsupervised model");
      }
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to train unsupervised model";
      setError(message);
      setUnsupervisedResult({ success: false, message });
    } finally {
      setUnsupervisedTraining(false);
    }
  };

  const fetchCounterfactualAnalysis = async () => {
    setCounterfactualLoading(true);
    setCounterfactualProgress(0);

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setCounterfactualProgress((prev) => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 15;
        });
      }, 500);

      const data = await apiService.fetchCounterfactualAnalysis();

      clearInterval(progressInterval);
      setCounterfactualProgress(100);

      if (data) {
        setCounterfactualData(data);
      }
    } catch (err) {
      console.error("Error fetching counterfactual analysis:", err);
      setError("Failed to perform counterfactual analysis");
    } finally {
      setTimeout(() => {
        setCounterfactualLoading(false);
        setCounterfactualProgress(0);
      }, 500);
    }
  };

  const fetchAnomalyAnalysis = async () => {
    try {
      const data = await apiService.fetchAnomalyAnalysis();
      if (data) {
        setAnomalyAnalysisData(data);
      }
    } catch (err) {
      console.error("Error fetching anomaly analysis:", err);
    }
  };

  const fetchAnomalyScatterData = async () => {
    try {
      const data = await apiService.fetchAnomalyData();
      if (data) {
        setAnomalyScatterData(data);
      }
    } catch (err) {
      console.error("Error fetching anomaly scatter data:", err);
    }
  };

  const renderTrainingResult = (
    result: TrainingResult | null,
    type: "supervised" | "unsupervised"
  ) => {
    if (!result) return null;

    const isSupervisedModel = type === "supervised";

    return (
      <Card className="mt-4 bg-white/80 backdrop-blur-sm border-2 border-slate-200/60 rounded-2xl shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            {result.success ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600" />
            )}
            <CardTitle className="text-lg">
              {isSupervisedModel ? "Supervised" : "Unsupervised"} Training
              Result
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant={result.success ? "default" : "destructive"}>
                {result.success ? "Success" : "Failed"}
              </Badge>
              {result.message && (
                <span className="text-sm text-slate-600">{result.message}</span>
              )}
            </div>

            {result.success && isSupervisedModel && result.model_type && (
              <div className="bg-blue-50/80 backdrop-blur-sm border border-blue-200/60 rounded-xl p-3">
                <div className="text-sm font-medium text-blue-800 mb-2">
                  Best Model
                </div>
                <div className="text-lg font-bold text-blue-900">
                  {result.model_type}
                </div>
              </div>
            )}

            {result.success && result.metrics && (
              <div className="bg-green-50/80 backdrop-blur-sm border border-green-200/60 rounded-xl p-3">
                <div className="text-sm font-medium text-green-800 mb-2">
                  Performance Metrics
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {result.metrics.r2 && (
                    <div>
                      <div className="text-xs text-green-600 uppercase tracking-wide">
                        R² Score
                      </div>
                      <div className="text-lg font-bold text-green-800">
                        {(result.metrics.r2 * 100).toFixed(2)}%
                      </div>
                    </div>
                  )}
                  {result.metrics.rmse && (
                    <div>
                      <div className="text-xs text-green-600 uppercase tracking-wide">
                        RMSE
                      </div>
                      <div className="text-lg font-bold text-green-800">
                        ${result.metrics.rmse.toFixed(2)}
                      </div>
                    </div>
                  )}
                  {result.metrics.mae && (
                    <div>
                      <div className="text-xs text-green-600 uppercase tracking-wide">
                        MAE
                      </div>
                      <div className="text-lg font-bold text-green-800">
                        ${result.metrics.mae.toFixed(2)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {result.success && !isSupervisedModel && result.results && (
              <div className="bg-purple-50/80 backdrop-blur-sm border border-purple-200/60 rounded-xl p-3">
                <div className="text-sm font-medium text-purple-800 mb-2">
                  Anomaly Detection Results
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {result.results.num_anomalias_iso && (
                    <div>
                      <div className="text-xs text-purple-600 uppercase tracking-wide">
                        Isolation Forest
                      </div>
                      <div className="text-lg font-bold text-purple-800">
                        {result.results.num_anomalias_iso} anomalies
                      </div>
                    </div>
                  )}
                  {result.results.num_anomalias_lof && (
                    <div>
                      <div className="text-xs text-purple-600 uppercase tracking-wide">
                        LOF
                      </div>
                      <div className="text-lg font-bold text-purple-800">
                        {result.results.num_anomalias_lof} anomalies
                      </div>
                    </div>
                  )}
                  {result.results.num_consenso && (
                    <div>
                      <div className="text-xs text-purple-600 uppercase tracking-wide">
                        Consensus
                      </div>
                      <div className="text-lg font-bold text-purple-800">
                        {result.results.num_consenso} anomalies
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const TabButton = ({
    label,
    icon: Icon,
    isActive,
    onClick,
    hasData = false,
  }: {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    isActive: boolean;
    onClick: () => void;
    hasData?: boolean;
  }) => (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
        isActive
          ? "bg-blue-600 text-white shadow-lg"
          : "bg-white/80 text-slate-700 hover:bg-blue-50 border border-slate-200/60"
      }`}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
      {hasData && <div className="w-2 h-2 bg-green-500 rounded-full"></div>}
    </button>
  );

  return (
    <div className="bg-gradient-to-br from-slate-50 via-white to-slate-100/50">
      <div className="space-y-8 max-w-7xl mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-slate-900 bg-clip-text text-transparent">
            Model Training
          </h1>
          <p className="text-slate-700 mt-2 text-lg font-medium">
            Train machine learning models with real Snowflake data
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-4 mb-8">
          <TabButton
            label="Training Controls"
            icon={Brain}
            isActive={activeTab === "training"}
            onClick={() => setActiveTab("training")}
          />
          <TabButton
            label="Supervised Analysis"
            icon={BarChart3}
            isActive={activeTab === "supervised"}
            onClick={() => setActiveTab("supervised")}
            hasData={!!supervisedResult?.success && !!counterfactualData}
          />
          <TabButton
            label="Unsupervised Analysis"
            icon={Activity}
            isActive={activeTab === "unsupervised"}
            onClick={() => setActiveTab("unsupervised")}
            hasData={!!unsupervisedResult?.success && !!anomalyAnalysisData}
          />
        </div>

        {/* Error Alert */}
        {error && (
          <Alert className="mb-6 bg-red-50/80 backdrop-blur-sm border-red-200/60 rounded-2xl shadow-lg">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800 font-medium">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Tab Content */}
        {activeTab === "training" && (
          <div className="space-y-8">
            {/* System Status */}
            {status && (
              <Card className="bg-white/90 backdrop-blur-sm border-2 border-slate-200/60 rounded-2xl shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl text-slate-800">
                    System Status
                  </CardTitle>
                  <CardDescription className="text-slate-600">
                    Current state of trained models
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <Brain className="h-5 w-5 text-blue-600" />
                      <span className="font-medium text-slate-700">
                        Supervised Model:
                      </span>
                      <Badge
                        variant={
                          status.supervised_model ? "default" : "secondary"
                        }
                      >
                        {status.supervised_model ? "Trained" : "Not Trained"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <Cpu className="h-5 w-5 text-purple-600" />
                      <span className="font-medium text-slate-700">
                        Unsupervised Model:
                      </span>
                      <Badge
                        variant={
                          status.unsupervised_model ? "default" : "secondary"
                        }
                      >
                        {status.unsupervised_model ? "Trained" : "Not Trained"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Training Controls */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Supervised Model Training */}
              <Card className="bg-white/90 backdrop-blur-sm border-2 border-slate-200/60 rounded-2xl shadow-lg">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Brain className="h-6 w-6 text-blue-600" />
                    <div>
                      <CardTitle className="text-xl text-slate-800">
                        Supervised Model
                      </CardTitle>
                      <CardDescription className="text-slate-600">
                        Train Random Forest and Gradient Boosting models for
                        revenue prediction
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-sm text-slate-600">
                      <ul className="list-disc list-inside space-y-1">
                        <li>Predicts revenue based on trip characteristics</li>
                        <li>
                          Uses Random Forest and Gradient Boosting algorithms
                        </li>
                        <li>Selects best performing model automatically</li>
                        <li>
                          Automatically runs counterfactual revenue analysis
                        </li>
                      </ul>
                    </div>

                    {supervisedTraining && (
                      <div className="bg-blue-50/80 backdrop-blur-sm border border-blue-200/60 rounded-xl p-3">
                        <div className="text-sm text-blue-800">
                          <div className="flex items-center gap-2 mb-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span className="font-medium">
                              Training in progress...
                            </span>
                          </div>
                          <div className="text-xs text-blue-600">
                            After model training completes, counterfactual
                            analysis will run automatically to calculate revenue
                            impact from bike shortages.
                          </div>
                        </div>
                      </div>
                    )}
                    <Button
                      onClick={handleSupervisedTraining}
                      disabled={supervisedTraining || status?.is_training}
                      className="w-full bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-600/20 text-white font-medium rounded-xl py-3 transition-all duration-200"
                    >
                      {supervisedTraining ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Training Model...
                        </>
                      ) : (
                        <>
                          <Brain className="w-4 h-4 mr-2" />
                          Train Supervised Model
                        </>
                      )}
                    </Button>
                  </div>
                  {renderTrainingResult(supervisedResult, "supervised")}
                </CardContent>
              </Card>

              {/* Unsupervised Model Training */}
              <Card className="bg-white/90 backdrop-blur-sm border-2 border-slate-200/60 rounded-2xl shadow-lg">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Cpu className="h-6 w-6 text-purple-600" />
                    <div>
                      <CardTitle className="text-xl text-slate-800">
                        Unsupervised Model
                      </CardTitle>
                      <CardDescription className="text-slate-600">
                        Train Isolation Forest and LOF models for anomaly
                        detection
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-sm text-slate-600">
                      <ul className="list-disc list-inside space-y-1">
                        <li>Detects unusual patterns in trip data</li>
                        <li>Uses Isolation Forest and Local Outlier Factor</li>
                        <li>
                          Identifies consensus anomalies across both methods
                        </li>
                        <li>Provides detailed anomaly analysis</li>
                      </ul>
                    </div>
                    <Button
                      onClick={handleUnsupervisedTraining}
                      disabled={unsupervisedTraining || status?.is_training}
                      className="w-full bg-purple-600 hover:bg-purple-700 focus:ring-4 focus:ring-purple-600/20 text-white font-medium rounded-xl py-3 transition-all duration-200"
                    >
                      {unsupervisedTraining ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Training Model...
                        </>
                      ) : (
                        <>
                          <Cpu className="w-4 h-4 mr-2" />
                          Train Unsupervised Model
                        </>
                      )}
                    </Button>
                  </div>
                  {renderTrainingResult(unsupervisedResult, "unsupervised")}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Supervised Model Analysis Tab */}
        {activeTab === "supervised" && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-800">
                Supervised Model Analysis
              </h2>
              {counterfactualLoading && (
                <div className="flex items-center gap-3 text-blue-600">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-sm font-medium">
                    Analyzing revenue impact...
                  </span>
                </div>
              )}
            </div>

            {/* Progress Bar for Counterfactual Analysis */}
            {counterfactualLoading && (
              <Card className="bg-blue-50/80 backdrop-blur-sm border-2 border-blue-200/60 rounded-2xl shadow-lg">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-blue-800">
                        Counterfactual Analysis Progress
                      </span>
                      <span className="text-sm text-blue-600">
                        {Math.round(counterfactualProgress)}%
                      </span>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${counterfactualProgress}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-blue-700">
                      {counterfactualProgress < 30 &&
                        "🔍 Loading shortage events..."}
                      {counterfactualProgress >= 30 &&
                        counterfactualProgress < 70 &&
                        "🧮 Simulating lost revenue scenarios..."}
                      {counterfactualProgress >= 70 &&
                        counterfactualProgress < 100 &&
                        "📊 Calculating financial impact..."}
                      {counterfactualProgress >= 100 && "✅ Analysis complete!"}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Model Dependency Warning */}
            {!status?.supervised_model && (
              <Alert className="bg-amber-50/80 backdrop-blur-sm border-amber-200/60 rounded-2xl shadow-lg">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-800 font-medium">
                  <strong>Note:</strong> Counterfactual analysis requires a
                  trained supervised model. Train the supervised model first to
                  see revenue impact analysis.
                </AlertDescription>
              </Alert>
            )}

            {/* Counterfactual Analysis */}
            {!counterfactualLoading && counterfactualData && (
              <CounterfactualAnalysisChart
                data={counterfactualData}
                loading={false}
              />
            )}

            {/* Empty State */}
            {!counterfactualLoading &&
              !counterfactualData &&
              status?.supervised_model && (
                <Card className="bg-slate-50/80 backdrop-blur-sm border-2 border-slate-200/60 rounded-2xl shadow-lg">
                  <CardContent className="p-8 text-center">
                    <div className="space-y-4">
                      <Brain className="w-12 h-12 text-slate-400 mx-auto" />
                      <div>
                        <h3 className="text-lg font-semibold text-slate-700">
                          Ready for Analysis
                        </h3>
                        <p className="text-slate-600 mt-2">
                          Supervised model is trained. Counterfactual analysis
                          will appear here after training completes.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

            {/* No Model Trained State */}
            {!supervisedResult?.success && (
              <Card className="bg-blue-50/80 backdrop-blur-sm border-2 border-blue-200/60 rounded-2xl shadow-lg">
                <CardContent className="p-8 text-center">
                  <div className="space-y-4">
                    <BarChart3 className="w-12 h-12 text-blue-400 mx-auto" />
                    <div>
                      <h3 className="text-lg font-semibold text-slate-700">
                        No Supervised Model Trained
                      </h3>
                      <p className="text-slate-600 mt-2">
                        Train a supervised model first to see revenue impact
                        analysis and counterfactual scenarios.
                      </p>
                      <Button
                        onClick={() => setActiveTab("training")}
                        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Go to Training
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Unsupervised Model Analysis Tab */}
        {activeTab === "unsupervised" && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-slate-800">
              Unsupervised Model Analysis
            </h2>

            {/* Model Dependency Info */}
            {!status?.unsupervised_model && (
              <Alert className="bg-purple-50/80 backdrop-blur-sm border-purple-200/60 rounded-2xl shadow-lg">
                <AlertTriangle className="h-4 w-4 text-purple-600" />
                <AlertDescription className="text-purple-800 font-medium">
                  <strong>Note:</strong> Anomaly analysis requires a trained
                  unsupervised model. Train the unsupervised model first to see
                  anomaly detection results.
                </AlertDescription>
              </Alert>
            )}

            {/* Anomaly Analysis */}
            {anomalyAnalysisData && anomalyScatterData && (
              <AnomalyAnalysisChart
                stats={anomalyAnalysisData?.stats}
                topAnomalies={anomalyAnalysisData?.top_anomalies}
                scatterData={anomalyScatterData}
                loading={chartsLoading}
              />
            )}

            {/* Empty State */}
            {!anomalyAnalysisData && status?.unsupervised_model && (
              <Card className="bg-slate-50/80 backdrop-blur-sm border-2 border-slate-200/60 rounded-2xl shadow-lg">
                <CardContent className="p-8 text-center">
                  <div className="space-y-4">
                    <Cpu className="w-12 h-12 text-slate-400 mx-auto" />
                    <div>
                      <h3 className="text-lg font-semibold text-slate-700">
                        Ready for Analysis
                      </h3>
                      <p className="text-slate-600 mt-2">
                        Unsupervised model is trained. Anomaly analysis will
                        appear here after training completes.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* No Model Trained State */}
            {!unsupervisedResult?.success && (
              <Card className="bg-purple-50/80 backdrop-blur-sm border-2 border-purple-200/60 rounded-2xl shadow-lg">
                <CardContent className="p-8 text-center">
                  <div className="space-y-4">
                    <Activity className="w-12 h-12 text-purple-400 mx-auto" />
                    <div>
                      <h3 className="text-lg font-semibold text-slate-700">
                        No Unsupervised Model Trained
                      </h3>
                      <p className="text-slate-600 mt-2">
                        Train an unsupervised model first to see anomaly
                        detection analysis and pattern insights.
                      </p>
                      <Button
                        onClick={() => setActiveTab("training")}
                        className="mt-4 bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        Go to Training
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Training;
