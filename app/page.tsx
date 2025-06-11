"use client";

import { useState, useEffect, ChangeEvent } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Dashboard from "@/components/dashboard/Dashboard";
import Training from "@/components/dashboard/Training";
import Predictions from "@/components/dashboard/Predictions";
import Anomalies from "@/components/dashboard/Anomalies";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

// API Base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

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

  useEffect(() => {
    fetchStatus();
    fetchDashboard();
    if (activeSection === "dashboard") {
      fetchChartData();
    } else if (activeSection === "anomalies") {
      fetchAnomalyData();
    }
  }, [activeSection]);

  const fetchStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/status`);
      const data = await response.json();
      setStatus(data);
    } catch (err) {
      setError("Failed to fetch system status");
    }
  };

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/dashboard`);
      const data = await response.json();
      if (data.success) {
        setKpis(data.kpis);
      }
    } catch (err) {
      setError("Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const fetchChartData = async () => {
    setChartsLoading(true);
    try {
      // Fetch all chart data in parallel
      const [
        revenueResponse,
        stationResponse,
        userResponse,
        anomaliesResponse,
        weatherResponse,
      ] = await Promise.all([
        fetch(`${API_BASE_URL}/api/visualizations/revenue_analysis`),
        fetch(`${API_BASE_URL}/api/visualizations/station_balance`),
        fetch(`${API_BASE_URL}/api/visualizations/user_distribution`),
        fetch(`${API_BASE_URL}/api/visualizations/anomalies_by_hour`),
        fetch(`${API_BASE_URL}/api/visualizations/weather_impact`),
      ]);

      if (revenueResponse.ok) {
        const revenueData = await revenueResponse.json();
        if (revenueData.success) {
          setRevenueByHourData(revenueData.chart_data || []);
        }
      }

      if (stationResponse.ok) {
        const stationData = await stationResponse.json();
        if (stationData.success) {
          setStationBalanceData(stationData.chart_data || []);
        }
      }

      if (userResponse.ok) {
        const userData = await userResponse.json();
        if (userData.success) {
          setUserTypeData(userData.chart_data || []);
        }
      }

      if (anomaliesResponse.ok) {
        const anomaliesHourData = await anomaliesResponse.json();
        if (anomaliesHourData.success) {
          setAnomaliesData(anomaliesHourData.chart_data || []);
        }
      }

      if (weatherResponse.ok) {
        const weatherData = await weatherResponse.json();
        if (weatherData.success) {
          setWeatherImpactData(weatherData.chart_data || []);
        }
      }
    } catch (err) {
      console.error("Error fetching chart data:", err);
      setError("Failed to fetch chart data");
    } finally {
      setChartsLoading(false);
    }
  };

  const fetchAnomalyData = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/visualizations/anomalies_scatter`
      );
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setAnomaliesScatterData({
            normal_points: data.normal_points || [],
            anomaly_points: data.anomaly_points || [],
          });
        }
      }
    } catch (err) {
      console.error("Error fetching anomaly scatter data:", err);
    }
  };

  const trainSupervisedModel = async () => {
    setTrainingSupervised(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE_URL}/api/train/supervised`, {
        method: "POST",
      });
      const data = await response.json();
      if (data.success) {
        await fetchStatus();
        await fetchDashboard(); // Refresh KPIs
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
        await fetchStatus();
        await fetchDashboard(); // Refresh KPIs
        await fetchChartData(); // Refresh anomaly charts
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
            onRefreshData={fetchChartData}
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
            onRefreshData={fetchChartData}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      <div className="flex-1 ml-64">
        <div className="p-6">
          {/* Error Alert */}
          {error && (
            <Alert className="mb-6 bg-red-50 border-red-200">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Main Content */}
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
