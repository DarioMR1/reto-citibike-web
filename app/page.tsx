"use client";

import { useState, useEffect, ChangeEvent, useCallback } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Dashboard from "@/components/dashboard/Dashboard";
import Predictions from "@/components/dashboard/Predictions";
import Anomalies from "@/components/dashboard/Anomalies";
import Training from "@/components/dashboard/Training";
import IntegrationsTable from "@/components/dashboard/IntegrationsTable";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import type {
  SystemStatus,
  KPIs,
  PredictionRequest,
  PredictionResult,
  DatasetRecord,
  DatasetFilters,
  DatasetSummary,
} from "@/types";
import * as apiService from "@/services/api";

interface ChartData {
  [key: string]: string | number;
}

interface AnomaliesScatterData {
  normal_points: Array<{ x: number; y: number; type: string }>;
  anomaly_points: Array<{ x: number; y: number; type: string }>;
}

export default function CitiBikeAnalytics() {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [kpis, setKpis] = useState<KPIs | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Chart data states
  const [revenueByHourData, setRevenueByHourData] = useState<ChartData[]>([]);
  const [stationBalanceData, setStationBalanceData] = useState<ChartData[]>([]);
  const [userTypeData, setUserTypeData] = useState<ChartData[]>([]);
  const [anomaliesData, setAnomaliesData] = useState<ChartData[]>([]);
  const [weatherImpactData, setWeatherImpactData] = useState<ChartData[]>([]);
  const [anomaliesScatterData, setAnomaliesScatterData] =
    useState<AnomaliesScatterData>({ normal_points: [], anomaly_points: [] });
  const [chartsLoading, setChartsLoading] = useState(false);

  // Unsupervised training state (for anomalies)
  const [trainingUnsupervised, setTrainingUnsupervised] = useState(false);

  // Prediction states
  const [predictionForm, setPredictionForm] = useState<PredictionRequest>({
    station_id: "HB101",
    hour: 17,
    is_weekend: false,
    month: 6,
    temperature: 20,
    humidity: 60,
    bike_type: 1,
    duration: 35,
    day_name: "Monday",
  });
  const [predictionResult, setPredictionResult] =
    useState<PredictionResult | null>(null);
  const [predicting, setPredicting] = useState(false);

  // Dataset states
  const [datasetRecords, setDatasetRecords] = useState<DatasetRecord[]>([]);
  const [datasetLoading, setDatasetLoading] = useState(false);
  const [datasetPage, setDatasetPage] = useState(1);
  const [datasetTotalPages, setDatasetTotalPages] = useState(0);
  const [datasetTotalRecords, setDatasetTotalRecords] = useState(0);
  const [datasetSummary, setDatasetSummary] = useState<DatasetSummary | null>(
    null
  );
  const [datasetFilters, setDatasetFilters] = useState<DatasetFilters>({
    sort_by: "START_STATION_ID",
    sort_order: "asc",
  });

  // Load saved section from localStorage after component mounts (avoids hydration mismatch)
  useEffect(() => {
    const savedSection = localStorage.getItem("citibike-active-section");
    if (savedSection) {
      setActiveSection(savedSection);
    }
  }, []);

  // API service functions
  const fetchStatus = useCallback(async (forceRefresh = false) => {
    try {
      const data = await apiService.fetchStatus(forceRefresh);
      if (data) {
        setStatus(data);
      } else {
        setError("Failed to fetch system status");
      }
    } catch {
      setError("Failed to fetch system status");
    }
  }, []);

  const fetchDashboard = useCallback(async (forceRefresh = false) => {
    setLoading(true);
    try {
      const kipsData = await apiService.fetchDashboard(forceRefresh);
      if (kipsData) {
        setKpis(kipsData);
      } else {
        setError("Failed to fetch dashboard data");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchChartData = useCallback(async (forceRefresh = false) => {
    setChartsLoading(true);
    try {
      const chartData = await apiService.fetchChartData(forceRefresh);

      setRevenueByHourData(chartData.chart_revenue || []);
      setStationBalanceData(chartData.chart_station || []);
      setUserTypeData(chartData.chart_user || []);
      setAnomaliesData(chartData.chart_anomalies || []);
      setWeatherImpactData(chartData.chart_weather || []);
    } catch {
      console.error("Error fetching chart data");
      setError("Failed to fetch chart data");
    } finally {
      setChartsLoading(false);
    }
  }, []);

  const fetchAnomalyData = useCallback(async (forceRefresh = false) => {
    try {
      const data = await apiService.fetchAnomalyData(forceRefresh);
      setAnomaliesScatterData(data);
    } catch {
      console.error("Error fetching anomaly data");
      setError("Failed to fetch anomaly data");
    }
  }, []);

  const fetchDatasetRecords = useCallback(
    async (
      page: number = 1,
      filters: DatasetFilters = datasetFilters,
      forceRefresh = false
    ) => {
      setDatasetLoading(true);
      try {
        const data = await apiService.fetchDatasetRecords(
          page,
          filters,
          forceRefresh
        );

        if (data) {
          setDatasetRecords(data.records);
          setDatasetTotalPages(data.totalPages);
          setDatasetTotalRecords(data.totalRecords);
          setDatasetSummary(data.summary);
          setDatasetPage(data.currentPage);
        } else {
          setError("Failed to fetch dataset records");
        }
      } catch {
        console.error("Error fetching dataset records");
        setError("Failed to fetch dataset records");
      } finally {
        setDatasetLoading(false);
      }
    },
    [datasetFilters]
  );

  // Initial data loading
  useEffect(() => {
    fetchStatus();
    fetchDashboard();

    if (activeSection === "dashboard") {
      fetchChartData();
    } else if (activeSection === "anomalies") {
      fetchAnomalyData();
    } else if (activeSection === "integrations") {
      fetchDatasetRecords(1, datasetFilters);
    }
  }, [
    activeSection,
    fetchStatus,
    fetchDashboard,
    fetchChartData,
    fetchAnomalyData,
    fetchDatasetRecords,
    datasetFilters,
  ]);

  // Load cached anomaly data on mount for anomalies section
  useEffect(() => {
    if (activeSection === "anomalies") {
      const cachedAnomalyScatterData = apiService.getCachedTrainingResult(
        "analysis_anomaly_scatter_data"
      );
      if (cachedAnomalyScatterData) {
        setAnomaliesScatterData(cachedAnomalyScatterData);
        console.log("📦 Loaded anomaly scatter data from cache");
      }
    }
  }, [activeSection]);

  // Load cached dataset data on mount for integrations section
  useEffect(() => {
    if (activeSection === "integrations") {
      const cachedDatasetState = apiService.getCachedDatasetState();
      if (cachedDatasetState.hasCache) {
        console.log("📦 Loading dataset data from cache");

        // Set summary if available
        if (cachedDatasetState.summary) {
          setDatasetSummary(cachedDatasetState.summary);
        }

        // Set pagination info if available
        if (cachedDatasetState.totalRecords > 0) {
          setDatasetTotalRecords(cachedDatasetState.totalRecords);
          setDatasetTotalPages(cachedDatasetState.totalPages);
        }

        // Set filters if available
        if (cachedDatasetState.lastFilters) {
          setDatasetFilters(cachedDatasetState.lastFilters);
        }

        // Set page if available
        if (cachedDatasetState.lastPage > 0) {
          setDatasetPage(cachedDatasetState.lastPage);
        }

        console.log("📦 Dataset cache loaded successfully");
      }
    }
  }, [activeSection]);

  const trainUnsupervisedModel = async () => {
    setTrainingUnsupervised(true);
    setError("");

    try {
      const result = await apiService.trainUnsupervisedModel();
      if (!result.success) {
        setError(result.message || "Failed to start training");
      } else {
        // Refresh status after successful training
        setTimeout(() => {
          fetchStatus(true);
        }, 2000);
      }
    } catch {
      setError("Failed to start unsupervised model training");
    } finally {
      setTrainingUnsupervised(false);
    }
  };

  // Navigate to training section
  const navigateToTraining = () => {
    handleSectionChange("training");
  };

  const makePrediction = async () => {
    setPredicting(true);
    try {
      const result = await apiService.makePrediction(predictionForm);
      setPredictionResult(result);
      setError("");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to make prediction";
      setError(message);
    } finally {
      setPredicting(false);
    }
  };

  // Force refresh function for manual cache invalidation
  const handleRefreshData = useCallback(() => {
    console.log("🔄 Force refreshing all data...");
    apiService.clearAllCache();

    if (activeSection === "dashboard") {
      fetchStatus(true);
      fetchDashboard(true);
      fetchChartData(true);
    } else if (activeSection === "anomalies") {
      fetchStatus(true);
      fetchAnomalyData(true);
    }
  }, [
    activeSection,
    fetchStatus,
    fetchDashboard,
    fetchChartData,
    fetchAnomalyData,
  ]);

  const handleInputChange =
    (field: keyof PredictionRequest) => (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      let parsedValue: string | number | boolean = value;

      if (
        field === "hour" ||
        field === "month" ||
        field === "humidity" ||
        field === "bike_type" ||
        field === "duration"
      ) {
        parsedValue = parseInt(value);
      } else if (field === "temperature") {
        parsedValue = parseFloat(value);
      }

      setPredictionForm((prev) => ({
        ...prev,
        [field]: parsedValue,
      }));
    };

  const handleSelectChange =
    (field: keyof PredictionRequest) => (value: string) => {
      setPredictionForm((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

  const handleCheckboxChange = (checked: boolean) => {
    setPredictionForm((prev) => ({
      ...prev,
      is_weekend: checked,
    }));
  };

  // Dataset handlers
  const handleDatasetPageChange = (newPage: number) => {
    setDatasetPage(newPage);
    fetchDatasetRecords(newPage, datasetFilters);
  };

  const handleDatasetFilterChange = (newFilters: Partial<DatasetFilters>) => {
    const updatedFilters = { ...datasetFilters, ...newFilters };
    setDatasetFilters(updatedFilters);
    setDatasetPage(1); // Reset to first page when filters change
    fetchDatasetRecords(1, updatedFilters);
  };

  const handleDatasetRefresh = () => {
    console.log("🔄 Refreshing dataset data...");
    apiService.invalidateDatasetCache();
    fetchDatasetRecords(datasetPage, datasetFilters, true);
  };

  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Custom function to handle section changes with localStorage persistence
  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    if (typeof window !== "undefined") {
      localStorage.setItem("citibike-active-section", section);
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <Dashboard
            kpis={kpis}
            status={status}
            loading={loading}
            chartsLoading={chartsLoading}
            revenueByHourData={revenueByHourData}
            stationBalanceData={stationBalanceData}
            userTypeData={userTypeData}
            anomaliesData={anomaliesData}
            weatherImpactData={weatherImpactData}
            onRefreshData={handleRefreshData}
          />
        );

      case "predictions":
        return (
          <Predictions
            status={status}
            predictionForm={predictionForm}
            predictionResult={predictionResult}
            predicting={predicting}
            onInputChange={handleInputChange}
            onSelectChange={handleSelectChange}
            onCheckboxChange={handleCheckboxChange}
            onMakePrediction={makePrediction}
          />
        );
      case "anomalies":
        return (
          <Anomalies
            status={status}
            anomaliesData={anomaliesData}
            anomaliesScatterData={anomaliesScatterData}
            chartsLoading={chartsLoading}
            trainingUnsupervised={trainingUnsupervised}
            onTrainUnsupervised={trainUnsupervisedModel}
            onNavigateToTraining={navigateToTraining}
          />
        );
      case "training":
        return (
          <Training status={status} onStatusUpdate={() => fetchStatus(true)} />
        );
      case "integrations":
        return (
          <IntegrationsTable
            records={datasetRecords}
            loading={datasetLoading}
            currentPage={datasetPage}
            totalPages={datasetTotalPages}
            totalRecords={datasetTotalRecords}
            summary={datasetSummary}
            filters={datasetFilters}
            onPageChange={handleDatasetPageChange}
            onFilterChange={handleDatasetFilterChange}
            onRefresh={handleDatasetRefresh}
          />
        );
      default:
        return (
          <Dashboard
            kpis={kpis}
            status={status}
            loading={loading}
            chartsLoading={chartsLoading}
            revenueByHourData={revenueByHourData}
            stationBalanceData={stationBalanceData}
            userTypeData={userTypeData}
            anomaliesData={anomaliesData}
            weatherImpactData={weatherImpactData}
            onRefreshData={handleRefreshData}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100/50 flex">
      <Sidebar
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={handleToggleSidebar}
      />

      <div
        className={`flex-1 transition-all duration-300 ${
          sidebarCollapsed ? "ml-16" : "ml-64"
        }`}
      >
        <div className="p-6">
          {/* Error Alert */}
          {error && (
            <Alert className="mb-6 bg-red-50/80 backdrop-blur-sm border-red-200/60 rounded-2xl shadow-lg">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800 font-medium">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Cache Debug Info (only in development) */}
          {process.env.NODE_ENV === "development" && (
            <div className="mb-4 p-3 bg-blue-50/80 backdrop-blur-sm border border-blue-200/60 rounded-xl text-xs text-blue-800">
              <strong>Cache Stats:</strong> {apiService.getCacheStats().size}{" "}
              entries |{" "}
              <button
                onClick={() => {
                  apiService.clearAllCache();
                  console.log("🗑️ Cache cleared manually");
                }}
                className="underline hover:text-blue-900"
              >
                Clear Cache
              </button>
            </div>
          )}

          {/* Main Content */}
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
