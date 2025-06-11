"use client";

import { useState, useEffect, ChangeEvent } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import KPICards from "@/components/dashboard/KPICards";
import IntegrationsTable from "@/components/dashboard/IntegrationsTable";
import RevenueByHourChart from "@/components/charts/RevenueByHourChart";
import StationBalanceChart from "@/components/charts/StationBalanceChart";
import UserTypeDistributionChart from "@/components/charts/UserTypeDistributionChart";
import AnomaliesByHourChart from "@/components/charts/AnomaliesByHourChart";
import WeatherImpactChart from "@/components/charts/WeatherImpactChart";
import AnomaliesScatterChart from "@/components/charts/AnomaliesScatterChart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, AlertTriangle, RefreshCw } from "lucide-react";

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

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            CitiBike Analytics Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Real-time insights from Snowflake data warehouse
          </p>
        </div>
        <Button
          onClick={fetchChartData}
          variant="outline"
          size="sm"
          disabled={chartsLoading}
        >
          <RefreshCw
            className={`w-4 h-4 mr-2 ${chartsLoading ? "animate-spin" : ""}`}
          />
          Refresh Data
        </Button>
      </div>

      {/* KPIs */}
      <KPICards data={kpis} loading={loading} />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue by Hour - takes 2 columns */}
        <div className="lg:col-span-2">
          <RevenueByHourChart
            data={revenueByHourData}
            loading={chartsLoading}
          />
        </div>

        {/* User Type Distribution */}
        <UserTypeDistributionChart
          data={userTypeData}
          loading={chartsLoading}
        />
      </div>

      {/* Second row of charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Station Balance */}
        <StationBalanceChart
          data={stationBalanceData}
          loading={chartsLoading}
        />

        {/* Weather Impact */}
        <WeatherImpactChart data={weatherImpactData} loading={chartsLoading} />
      </div>

      {/* Anomalies Chart */}
      <AnomaliesByHourChart data={anomaliesData} loading={chartsLoading} />

      {/* Integrations Table */}
      <IntegrationsTable modelStatus={status || undefined} loading={loading} />
    </div>
  );

  const renderTraining = () => (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Model Training</h1>
        <p className="text-gray-600 mt-2">
          Train and manage machine learning models with real CitiBike data
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border border-gray-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900">
              Supervised Model Training
            </CardTitle>
            <CardDescription className="text-gray-600">
              Train models to predict excess minute revenue from CitiBike trips
              using Snowflake data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={trainSupervisedModel}
              disabled={trainingSupervised}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {trainingSupervised && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Train Revenue Prediction Model
            </Button>
            {status?.supervised_model && (
              <div className="mt-3 p-2 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800">
                  ✅ Model trained and ready for predictions
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border border-gray-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900">
              Anomaly Detection Training
            </CardTitle>
            <CardDescription className="text-gray-600">
              Train models to detect unusual patterns in station usage using
              machine learning
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={trainUnsupervisedModel}
              disabled={trainingUnsupervised}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              variant="secondary"
            >
              {trainingUnsupervised && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Train Anomaly Detection
            </Button>
            {status?.unsupervised_model && (
              <div className="mt-3 p-2 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800">
                  ✅ Model trained and detecting anomalies
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderPredictions = () => (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Revenue Predictions
        </h1>
        <p className="text-gray-600 mt-2">
          Make single trip revenue predictions using trained ML models
        </p>
      </div>

      <Card className="border border-gray-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900">
            Single Trip Revenue Prediction
          </CardTitle>
          <CardDescription className="text-gray-600">
            Predict excess minute revenue for a specific CitiBike trip scenario
            using real-time ML models
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="station" className="text-gray-900 font-medium">
                Station
              </Label>
              <Select
                value={predictionForm.station_id}
                onValueChange={handleSelectChange("station_id")}
              >
                <SelectTrigger className="border-gray-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HB101">HB101</SelectItem>
                  <SelectItem value="HB102">HB102</SelectItem>
                  <SelectItem value="HB103">HB103</SelectItem>
                  <SelectItem value="JC001">JC001</SelectItem>
                  <SelectItem value="JC002">JC002</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hour" className="text-gray-900 font-medium">
                Hour
              </Label>
              <Input
                type="number"
                min="0"
                max="23"
                value={predictionForm.hour}
                onChange={handleInputChange("hour")}
                className="border-gray-300 text-gray-900"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="month" className="text-gray-900 font-medium">
                Month
              </Label>
              <Input
                type="number"
                min="1"
                max="12"
                value={predictionForm.month}
                onChange={handleInputChange("month")}
                className="border-gray-300 text-gray-900"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="temperature"
                className="text-gray-900 font-medium"
              >
                Temperature (°C)
              </Label>
              <Input
                type="number"
                min="-10"
                max="40"
                step="0.5"
                value={predictionForm.temperature}
                onChange={handleInputChange("temperature")}
                className="border-gray-300 text-gray-900"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="humidity" className="text-gray-900 font-medium">
                Humidity (%)
              </Label>
              <Input
                type="number"
                min="0"
                max="100"
                value={predictionForm.humidity}
                onChange={handleInputChange("humidity")}
                className="border-gray-300 text-gray-900"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration" className="text-gray-900 font-medium">
                Duration (minutes)
              </Label>
              <Input
                type="number"
                min="5"
                max="120"
                value={predictionForm.duration}
                onChange={handleInputChange("duration")}
                className="border-gray-300 text-gray-900"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="weekend"
                checked={predictionForm.is_weekend}
                onCheckedChange={handleCheckboxChange}
              />
              <Label htmlFor="weekend" className="text-gray-900 font-medium">
                Weekend
              </Label>
            </div>
          </div>

          <Button
            onClick={makePrediction}
            disabled={predicting || !status?.supervised_model}
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {predicting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Make Prediction
          </Button>

          {!status?.supervised_model && (
            <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
              <p className="text-sm text-yellow-800">
                ⚠️ Please train the supervised model first
              </p>
            </div>
          )}

          {predictionResult && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Prediction Results
              </h3>
              <div className="grid gap-2 md:grid-cols-3">
                <div>
                  <span className="text-gray-700 font-medium">
                    Predicted Revenue:
                  </span>
                  <span className="text-green-600 font-bold ml-2">
                    ${predictionResult.prediction.toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-700 font-medium">
                    Theoretical Revenue:
                  </span>
                  <span className="text-blue-600 font-bold ml-2">
                    ${predictionResult.theoretical_revenue.toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-700 font-medium">
                    Model Difference:
                  </span>
                  <span
                    className={`font-bold ml-2 ${
                      predictionResult.model_difference >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    ${predictionResult.model_difference.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderAnomalies = () => (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Anomaly Detection</h1>
        <p className="text-gray-600 mt-2">
          Analyze unusual patterns in CitiBike station usage using ML algorithms
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
          <AnomaliesByHourChart data={anomaliesData} loading={chartsLoading} />

          {/* Additional anomaly analysis can be added here */}
        </>
      ) : (
        <Card className="border border-gray-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900">
              Anomaly Detection Analysis
            </CardTitle>
            <CardDescription className="text-gray-600">
              Advanced ML-based anomaly detection for CitiBike station usage
              patterns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <p className="text-gray-700 font-medium mb-4">
                Train the anomaly detection model first to see detailed analysis
              </p>
              <Button
                onClick={trainUnsupervisedModel}
                disabled={trainingUnsupervised}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                {trainingUnsupervised && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                Train Anomaly Detection
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return renderDashboard();
      case "training":
        return renderTraining();
      case "predictions":
        return renderPredictions();
      case "anomalies":
        return renderAnomalies();
      default:
        return renderDashboard();
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
