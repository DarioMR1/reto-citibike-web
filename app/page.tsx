"use client";

import { useState, useEffect, ChangeEvent, useCallback, useRef } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Dashboard from "@/components/dashboard/Dashboard";
import Training from "@/components/dashboard/Training";
import Predictions from "@/components/dashboard/Predictions";
import Anomalies from "@/components/dashboard/Anomalies";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

// API Base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Cache configuration
const CACHE_DURATION = {
  STATUS: 30 * 1000, // 30 seconds
  DASHBOARD: 2 * 60 * 1000, // 2 minutes
  CHARTS: 5 * 60 * 1000, // 5 minutes
  ANOMALIES: 10 * 60 * 1000, // 10 minutes
};

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

interface SystemStatus {
  supervised_model: boolean;
  unsupervised_model: boolean;
  models_loaded: boolean;
  training_status: string;
}

interface KPIs {
  total_viajes: number;
  ingresos_totales: number;
  ingreso_promedio: number;
  estaciones_activas: number;
  viajes_con_ingresos: number;
  anomalias_detectadas?: number;
  porcentaje_anomalias?: number;
}

interface PredictionRequest {
  station_id: string;
  hour: number;
  is_weekend: boolean;
  month: number;
  temperature: number;
  humidity: number;
  bike_type: number;
  duration: number;
  day_name: string;
}

interface PredictionResult {
  prediction: number;
  theoretical_revenue: number;
  model_difference: number;
}

// Cache manager class
class CacheManager {
  private cache = new Map<string, CacheEntry<any>>();

  set<T>(key: string, data: T, duration: number): void {
    const now = Date.now();
    this.cache.set(key, {
      data,
      timestamp: now,
      expiry: now + duration,
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (now > entry.expiry) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  invalidate(key: string): void {
    this.cache.delete(key);
  }

  invalidatePattern(pattern: string): void {
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }

  clear(): void {
    this.cache.clear();
  }

  getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

export default function CitiBikeAnalytics() {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [kpis, setKpis] = useState<KPIs | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] = useState("dashboard");

  // Chart data states
  const [revenueByHourData, setRevenueByHourData] = useState<any[]>([]);
  const [stationBalanceData, setStationBalanceData] = useState<any[]>([]);
  const [userTypeData, setUserTypeData] = useState<any[]>([]);
  const [anomaliesData, setAnomaliesData] = useState<any[]>([]);
  const [weatherImpactData, setWeatherImpactData] = useState<any[]>([]);
  const [anomaliesScatterData, setAnomaliesScatterData] = useState<{
    normal_points: any[];
    anomaly_points: any[];
  }>({ normal_points: [], anomaly_points: [] });
  const [chartsLoading, setChartsLoading] = useState(false);

  // Training states
  const [trainingSupervised, setTrainingSupervised] = useState(false);
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

  // Cache manager instance
  const cacheManager = useRef(new CacheManager());

  // Cache-aware fetch function
  const fetchWithCache = useCallback(
    async (
      url: string,
      cacheKey: string,
      cacheDuration: number,
      forceRefresh = false
    ): Promise<any | null> => {
      // Check cache first (unless force refresh)
      if (!forceRefresh) {
        const cachedData = cacheManager.current.get(cacheKey);
        if (cachedData) {
          console.log(`📦 Cache hit for ${cacheKey}`);
          return cachedData;
        }
      }

      try {
        console.log(`🌐 Fetching from API: ${cacheKey}`);
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Cache the successful response
        cacheManager.current.set(cacheKey, data, cacheDuration);

        return data;
      } catch (err) {
        console.error(`❌ Error fetching ${cacheKey}:`, err);
        return null;
      }
    },
    []
  );

  const fetchStatus = useCallback(
    async (forceRefresh = false) => {
      const data = await fetchWithCache(
        `${API_BASE_URL}/api/status`,
        "system_status",
        CACHE_DURATION.STATUS,
        forceRefresh
      );

      if (data) {
        setStatus(data);
      } else {
        setError("Failed to fetch system status");
      }
    },
    [fetchWithCache]
  );

  const fetchDashboard = useCallback(
    async (forceRefresh = false) => {
      setLoading(true);
      try {
        const data = await fetchWithCache(
          `${API_BASE_URL}/api/dashboard`,
          "dashboard_kpis",
          CACHE_DURATION.DASHBOARD,
          forceRefresh
        );

        if (data?.success) {
          setKpis(data.kpis);
        } else {
          setError("Failed to fetch dashboard data");
        }
      } finally {
        setLoading(false);
      }
    },
    [fetchWithCache]
  );

  const fetchChartData = useCallback(
    async (forceRefresh = false) => {
      setChartsLoading(true);
      try {
        // Fetch all chart data with caching
        const chartEndpoints = [
          {
            url: `${API_BASE_URL}/api/visualizations/revenue_analysis`,
            key: "chart_revenue",
            setter: setRevenueByHourData,
          },
          {
            url: `${API_BASE_URL}/api/visualizations/station_balance`,
            key: "chart_station",
            setter: setStationBalanceData,
          },
          {
            url: `${API_BASE_URL}/api/visualizations/user_distribution`,
            key: "chart_user",
            setter: setUserTypeData,
          },
          {
            url: `${API_BASE_URL}/api/visualizations/anomalies_by_hour`,
            key: "chart_anomalies",
            setter: setAnomaliesData,
          },
          {
            url: `${API_BASE_URL}/api/visualizations/weather_impact`,
            key: "chart_weather",
            setter: setWeatherImpactData,
          },
        ];

        // Fetch all charts in parallel with caching
        const promises = chartEndpoints.map(async ({ url, key, setter }) => {
          const data = await fetchWithCache(
            url,
            key,
            CACHE_DURATION.CHARTS,
            forceRefresh
          );

          if (data?.success) {
            setter(data.chart_data || []);
          }
        });

        await Promise.all(promises);
      } catch (err) {
        console.error("Error fetching chart data:", err);
        setError("Failed to fetch chart data");
      } finally {
        setChartsLoading(false);
      }
    },
    [fetchWithCache]
  );

  const fetchAnomalyData = useCallback(
    async (forceRefresh = false) => {
      const data = await fetchWithCache(
        `${API_BASE_URL}/api/visualizations/anomalies_scatter`,
        "anomalies_scatter",
        CACHE_DURATION.ANOMALIES,
        forceRefresh
      );

      if (data?.success) {
        setAnomaliesScatterData({
          normal_points: data.normal_points || [],
          anomaly_points: data.anomaly_points || [],
        });
      }
    },
    [fetchWithCache]
  );

  // Initial data loading
  useEffect(() => {
    fetchStatus();
    fetchDashboard();

    if (activeSection === "dashboard") {
      fetchChartData();
    } else if (activeSection === "anomalies") {
      fetchAnomalyData();
    }
  }, [
    activeSection,
    fetchStatus,
    fetchDashboard,
    fetchChartData,
    fetchAnomalyData,
  ]);

  const trainSupervisedModel = async () => {
    setTrainingSupervised(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE_URL}/api/train/supervised`, {
        method: "POST",
      });
      const data = await response.json();
      if (data.success) {
        // Invalidate relevant caches after training
        cacheManager.current.invalidate("system_status");
        cacheManager.current.invalidate("dashboard_kpis");
        cacheManager.current.invalidatePattern("chart_");

        // Force refresh data
        await fetchStatus(true);
        await fetchDashboard(true);
        setError("");
      } else {
        setError(data.message || "Training failed");
      }
    } catch (err) {
      setError("Failed to train supervised model");
    } finally {
      setTrainingSupervised(false);
    }
  };

  const trainUnsupervisedModel = async () => {
    setTrainingUnsupervised(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE_URL}/api/train/unsupervised`, {
        method: "POST",
      });
      const data = await response.json();
      if (data.success) {
        // Invalidate relevant caches after training
        cacheManager.current.invalidate("system_status");
        cacheManager.current.invalidate("dashboard_kpis");
        cacheManager.current.invalidatePattern("chart_");
        cacheManager.current.invalidate("anomalies_scatter");

        // Force refresh data
        await fetchStatus(true);
        await fetchDashboard(true);
        await fetchChartData(true);
        setError("");
      } else {
        setError(data.message || "Training failed");
      }
    } catch (err) {
      setError("Failed to train unsupervised model");
    } finally {
      setTrainingUnsupervised(false);
    }
  };

  const makePrediction = async () => {
    setPredicting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/predict/single`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(predictionForm),
      });
      const data = await response.json();
      if (data.success) {
        setPredictionResult(data);
        setError("");
      } else {
        setError(data.detail || "Prediction failed");
      }
    } catch (err) {
      setError("Failed to make prediction");
    } finally {
      setPredicting(false);
    }
  };

  // Force refresh function for manual cache invalidation
  const handleRefreshData = useCallback(() => {
    console.log("🔄 Force refreshing all data...");
    cacheManager.current.clear();

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
      case "training":
        return (
          <Training
            status={status}
            trainingSupervised={trainingSupervised}
            trainingUnsupervised={trainingUnsupervised}
            onTrainSupervised={trainSupervisedModel}
            onTrainUnsupervised={trainUnsupervisedModel}
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
        onSectionChange={setActiveSection}
      />

      <div className="flex-1 ml-64">
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
              <strong>Cache Stats:</strong>{" "}
              {cacheManager.current.getStats().size} entries |{" "}
              <button
                onClick={() => {
                  cacheManager.current.clear();
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
