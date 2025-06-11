"use client";

import React, { ChangeEvent, useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Loader2,
  Info,
  Calculator,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  MapPin,
  Clock,
  Calendar,
  Thermometer,
  Droplets,
  Timer,
  Bike,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SystemStatus {
  supervised_model: boolean;
  unsupervised_model: boolean;
  models_loaded: boolean;
  training_status: string;
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

interface PredictionsProps {
  status: SystemStatus | null;
  predictionForm: PredictionRequest;
  predictionResult: PredictionResult | null;
  predicting: boolean;
  onInputChange: (
    field: keyof PredictionRequest
  ) => (e: ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (field: keyof PredictionRequest) => (value: string) => void;
  onCheckboxChange: (checked: boolean) => void;
  onMakePrediction: () => void;
}

const Predictions: React.FC<PredictionsProps> = ({
  status,
  predictionForm,
  predictionResult,
  predicting,
  onInputChange,
  onSelectChange,
  onCheckboxChange,
  onMakePrediction,
}) => {
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const resultsRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to results when prediction is completed
  useEffect(() => {
    if (predictionResult && resultsRef.current) {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 100);
    }
  }, [predictionResult]);

  // Validation function
  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (predictionForm.hour < 0 || predictionForm.hour > 23) {
      errors.hour = "Hour must be between 0-23";
    }
    if (predictionForm.month < 1 || predictionForm.month > 12) {
      errors.month = "Month must be between 1-12";
    }
    if (predictionForm.temperature < -10 || predictionForm.temperature > 40) {
      errors.temperature = "Temperature must be between -10°C and 40°C";
    }
    if (predictionForm.humidity < 0 || predictionForm.humidity > 100) {
      errors.humidity = "Humidity must be between 0-100%";
    }
    if (predictionForm.duration < 5 || predictionForm.duration > 120) {
      errors.duration = "Duration must be between 5-120 minutes";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePredictionClick = () => {
    if (validateForm()) {
      onMakePrediction();
    }
  };

  const getMonthName = (month: number) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return months[month - 1] || "Unknown";
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getRevenueColor = (amount: number) => {
    if (amount > 5) return "text-emerald-600 font-semibold";
    if (amount > 2) return "text-blue-800 font-semibold";
    if (amount > 0) return "text-slate-700 font-semibold";
    return "text-slate-600 font-medium";
  };

  const FormField = ({
    label,
    icon: Icon,
    tooltip,
    error,
    children,
  }: {
    label: string;
    icon: React.ElementType;
    tooltip: string;
    error?: string;
    children: React.ReactNode;
  }) => (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-slate-700" />
        <Label className="text-sm font-semibold text-slate-900">{label}</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="w-3 h-3 text-slate-500 cursor-help hover:text-blue-800 transition-colors duration-200" />
            </TooltipTrigger>
            <TooltipContent className="bg-slate-900/95 backdrop-blur-sm text-white border-slate-700/50 rounded-xl">
              <p className="text-xs max-w-xs">{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      {children}
      {error && (
        <div className="flex items-center gap-2 mt-2 p-3 bg-red-50/80 backdrop-blur-sm border border-red-200/60 rounded-xl">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <span className="text-sm text-red-700 font-medium">{error}</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100/50">
      <div className="space-y-8 max-w-6xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="p-4 bg-gradient-to-br from-blue-800/90 to-blue-900/90 backdrop-blur-sm rounded-2xl shadow-lg">
              <Calculator className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-slate-900 bg-clip-text text-transparent">
              Revenue Predictions
            </h1>
          </div>
          <p className="text-lg text-slate-700 max-w-3xl mx-auto leading-relaxed">
            Predict excess minute revenue for CitiBike trips using advanced
            machine learning models trained on real Snowflake data.
          </p>
        </div>

        {/* Model Status Banner */}
        <Card className="border-0 bg-white/60 backdrop-blur-sm shadow-lg rounded-2xl">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {status?.supervised_model ? (
                  <div className="p-2 bg-emerald-100/80 rounded-xl">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  </div>
                ) : (
                  <div className="p-2 bg-amber-100/80 rounded-xl">
                    <AlertCircle className="w-5 h-5 text-amber-600" />
                  </div>
                )}
                <div>
                  <p className="font-bold text-slate-900 text-lg">
                    ML Model Status
                  </p>
                  <p className="text-slate-700 font-medium">
                    {status?.supervised_model
                      ? "Supervised model trained and ready for predictions"
                      : "Model needs training before making predictions"}
                  </p>
                </div>
              </div>
              <Badge
                className={`px-4 py-2 font-semibold rounded-xl ${
                  status?.supervised_model
                    ? "bg-emerald-100/80 text-emerald-800 border-emerald-200/60"
                    : "bg-amber-100/80 text-amber-800 border-amber-200/60"
                } backdrop-blur-sm`}
              >
                {status?.supervised_model ? "Ready" : "Training Required"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Prediction Form */}
        <Card className="border-0 bg-white/70 backdrop-blur-md shadow-xl rounded-3xl overflow-hidden">
          <CardHeader className="pb-6 bg-gradient-to-r from-slate-900/5 to-blue-800/5 backdrop-blur-sm">
            <CardTitle className="flex items-center gap-3 text-2xl text-slate-900">
              <div className="p-2 bg-blue-800/10 rounded-xl">
                <TrendingUp className="w-5 h-5 text-blue-800" />
              </div>
              Trip Revenue Prediction
            </CardTitle>
            <CardDescription className="text-slate-700 text-base font-medium">
              Configure the trip parameters below to get an accurate revenue
              prediction
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-12 p-8">
            {/* Location & Time Section */}
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-3 pb-4 border-b border-slate-200/60">
                <div className="p-2 bg-blue-800/10 rounded-xl">
                  <MapPin className="w-4 h-4 text-blue-800" />
                </div>
                Location & Time
              </h3>
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                <FormField
                  label="Station"
                  icon={MapPin}
                  tooltip="Select the starting station for the trip"
                  error={validationErrors.station_id}
                >
                  <Select
                    value={predictionForm.station_id}
                    onValueChange={onSelectChange("station_id")}
                  >
                    <SelectTrigger className="h-12 border-2 border-slate-200/60 hover:border-blue-800/40 focus:border-blue-800 focus:ring-4 focus:ring-blue-800/10 bg-white/80 backdrop-blur-sm text-slate-900 font-medium rounded-xl transition-all duration-200">
                      <SelectValue
                        placeholder="Choose a station"
                        className="text-slate-900"
                      />
                    </SelectTrigger>
                    <SelectContent className="bg-white/95 backdrop-blur-md border-2 border-slate-200/60 shadow-2xl rounded-xl">
                      <SelectItem
                        value="HB101"
                        className="text-slate-900 hover:bg-blue-800/5 focus:bg-blue-800/10 py-3 px-4 rounded-lg mx-1 my-1"
                      >
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-900">
                            Hoboken - HB101
                          </span>
                          <span className="text-slate-600 text-sm">
                            Main Terminal
                          </span>
                        </div>
                      </SelectItem>
                      <SelectItem
                        value="HB102"
                        className="text-slate-900 hover:bg-blue-800/5 focus:bg-blue-800/10 py-3 px-4 rounded-lg mx-1 my-1"
                      >
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-900">
                            Hoboken - HB102
                          </span>
                          <span className="text-slate-600 text-sm">
                            Waterfront
                          </span>
                        </div>
                      </SelectItem>
                      <SelectItem
                        value="HB103"
                        className="text-slate-900 hover:bg-blue-800/5 focus:bg-blue-800/10 py-3 px-4 rounded-lg mx-1 my-1"
                      >
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-900">
                            Hoboken - HB103
                          </span>
                          <span className="text-slate-600 text-sm">
                            Downtown
                          </span>
                        </div>
                      </SelectItem>
                      <SelectItem
                        value="JC001"
                        className="text-slate-900 hover:bg-blue-800/5 focus:bg-blue-800/10 py-3 px-4 rounded-lg mx-1 my-1"
                      >
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-900">
                            Jersey City - JC001
                          </span>
                          <span className="text-slate-600 text-sm">
                            Exchange Place
                          </span>
                        </div>
                      </SelectItem>
                      <SelectItem
                        value="JC002"
                        className="text-slate-900 hover:bg-blue-800/5 focus:bg-blue-800/10 py-3 px-4 rounded-lg mx-1 my-1"
                      >
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-900">
                            Jersey City - JC002
                          </span>
                          <span className="text-slate-600 text-sm">
                            Grove Street
                          </span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>

                <FormField
                  label="Hour"
                  icon={Clock}
                  tooltip="Hour of the day (0-23) when the trip starts"
                  error={validationErrors.hour}
                >
                  <Input
                    type="number"
                    min="0"
                    max="23"
                    value={predictionForm.hour}
                    onChange={onInputChange("hour")}
                    className="h-12 border-2 border-slate-200/60 hover:border-blue-800/40 focus:border-blue-800 focus:ring-4 focus:ring-blue-800/10 text-slate-900 font-medium bg-white/80 backdrop-blur-sm placeholder:text-slate-500 rounded-xl transition-all duration-200"
                    placeholder="e.g., 17"
                  />
                </FormField>

                <FormField
                  label="Month"
                  icon={Calendar}
                  tooltip="Month of the year (1-12) when the trip occurs"
                  error={validationErrors.month}
                >
                  <div className="space-y-3">
                    <Input
                      type="number"
                      min="1"
                      max="12"
                      value={predictionForm.month}
                      onChange={onInputChange("month")}
                      className="h-12 border-2 border-slate-200/60 hover:border-blue-800/40 focus:border-blue-800 focus:ring-4 focus:ring-blue-800/10 text-slate-900 font-medium bg-white/80 backdrop-blur-sm placeholder:text-slate-500 rounded-xl transition-all duration-200"
                      placeholder="e.g., 6"
                    />
                    {predictionForm.month >= 1 &&
                      predictionForm.month <= 12 && (
                        <p className="text-sm text-slate-700 font-medium bg-slate-100/70 backdrop-blur-sm px-3 py-2 rounded-xl">
                          {getMonthName(predictionForm.month)}
                        </p>
                      )}
                  </div>
                </FormField>

                <FormField
                  label="Weekend"
                  icon={Calendar}
                  tooltip="Check if this trip occurs on a weekend (Saturday or Sunday)"
                >
                  <div className="flex items-center space-x-3 pt-3 p-4 bg-slate-50/70 backdrop-blur-sm rounded-xl border border-slate-200/60">
                    <Checkbox
                      id="weekend"
                      checked={predictionForm.is_weekend}
                      onCheckedChange={onCheckboxChange}
                      className="border-2 border-slate-400 w-5 h-5 rounded-md data-[state=checked]:bg-blue-800 data-[state=checked]:border-blue-800"
                    />
                    <Label
                      htmlFor="weekend"
                      className="text-sm text-slate-800 font-semibold cursor-pointer"
                    >
                      This is a weekend trip
                    </Label>
                  </div>
                </FormField>
              </div>
            </div>

            <Separator className="bg-slate-200/60" />

            {/* Weather Section */}
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-3 pb-4 border-b border-slate-200/60">
                <div className="p-2 bg-blue-800/10 rounded-xl">
                  <Thermometer className="w-4 h-4 text-blue-800" />
                </div>
                Weather Conditions
              </h3>
              <div className="grid gap-8 sm:grid-cols-2">
                <FormField
                  label="Temperature (°C)"
                  icon={Thermometer}
                  tooltip="Ambient temperature in Celsius (-10°C to 40°C)"
                  error={validationErrors.temperature}
                >
                  <Input
                    type="number"
                    min="-10"
                    max="40"
                    step="0.5"
                    value={predictionForm.temperature}
                    onChange={onInputChange("temperature")}
                    className="h-12 border-2 border-slate-200/60 hover:border-blue-800/40 focus:border-blue-800 focus:ring-4 focus:ring-blue-800/10 text-slate-900 font-medium bg-white/80 backdrop-blur-sm placeholder:text-slate-500 rounded-xl transition-all duration-200"
                    placeholder="e.g., 22.5"
                  />
                </FormField>

                <FormField
                  label="Humidity (%)"
                  icon={Droplets}
                  tooltip="Relative humidity percentage (0-100%)"
                  error={validationErrors.humidity}
                >
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={predictionForm.humidity}
                    onChange={onInputChange("humidity")}
                    className="h-12 border-2 border-slate-200/60 hover:border-blue-800/40 focus:border-blue-800 focus:ring-4 focus:ring-blue-800/10 text-slate-900 font-medium bg-white/80 backdrop-blur-sm placeholder:text-slate-500 rounded-xl transition-all duration-200"
                    placeholder="e.g., 65"
                  />
                </FormField>
              </div>
            </div>

            <Separator className="bg-slate-200/60" />

            {/* Trip Details Section */}
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-3 pb-4 border-b border-slate-200/60">
                <div className="p-2 bg-blue-800/10 rounded-xl">
                  <Bike className="w-4 h-4 text-blue-800" />
                </div>
                Trip Details
              </h3>
              <div className="grid gap-8 sm:grid-cols-2">
                <FormField
                  label="Duration (minutes)"
                  icon={Timer}
                  tooltip="Expected trip duration in minutes (5-120 min). Trips over 30 minutes incur excess charges."
                  error={validationErrors.duration}
                >
                  <div className="space-y-3">
                    <Input
                      type="number"
                      min="5"
                      max="120"
                      value={predictionForm.duration}
                      onChange={onInputChange("duration")}
                      className="h-12 border-2 border-slate-200/60 hover:border-blue-800/40 focus:border-blue-800 focus:ring-4 focus:ring-blue-800/10 text-slate-900 font-medium bg-white/80 backdrop-blur-sm placeholder:text-slate-500 rounded-xl transition-all duration-200"
                      placeholder="e.g., 45"
                    />
                    {predictionForm.duration > 30 && (
                      <div className="p-4 bg-amber-50/80 backdrop-blur-sm border border-amber-200/60 rounded-xl">
                        <p className="text-sm text-amber-800 font-semibold">
                          ⚠️ Excess minutes: {predictionForm.duration - 30} min
                          (charges apply at $0.39/min)
                        </p>
                      </div>
                    )}
                  </div>
                </FormField>

                <FormField
                  label="Bike Type"
                  icon={Bike}
                  tooltip="Type of bike used for the trip (1: Classic, 2: Electric)"
                >
                  <Select
                    value={predictionForm.bike_type.toString()}
                    onValueChange={(value) =>
                      onSelectChange("bike_type")(value)
                    }
                  >
                    <SelectTrigger className="h-12 border-2 border-slate-200/60 hover:border-blue-800/40 focus:border-blue-800 focus:ring-4 focus:ring-blue-800/10 bg-white/80 backdrop-blur-sm text-slate-900 font-medium rounded-xl transition-all duration-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white/95 backdrop-blur-md border-2 border-slate-200/60 shadow-2xl rounded-xl">
                      <SelectItem
                        value="1"
                        className="text-slate-900 hover:bg-blue-800/5 focus:bg-blue-800/10 py-3 px-4 rounded-lg mx-1 my-1"
                      >
                        <div className="flex items-center gap-3">
                          <Bike className="w-4 h-4 text-slate-600" />
                          <span className="font-semibold text-slate-900">
                            Classic Bike
                          </span>
                        </div>
                      </SelectItem>
                      <SelectItem
                        value="2"
                        className="text-slate-900 hover:bg-blue-800/5 focus:bg-blue-800/10 py-3 px-4 rounded-lg mx-1 my-1"
                      >
                        <div className="flex items-center gap-3">
                          <Bike className="w-4 h-4 text-blue-800" />
                          <span className="font-semibold text-slate-900">
                            Electric Bike
                          </span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
              </div>
            </div>

            {/* Prediction Button */}
            <div className="pt-8">
              <Button
                onClick={handlePredictionClick}
                disabled={predicting || !status?.supervised_model}
                className="w-full h-16 bg-gradient-to-r from-blue-800 via-slate-900 to-blue-800 hover:from-blue-900 hover:via-slate-800 hover:to-blue-900 text-white font-bold text-xl shadow-2xl transition-all duration-300 transform hover:scale-[1.02] rounded-2xl backdrop-blur-sm"
              >
                {predicting ? (
                  <>
                    <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                    Calculating Prediction...
                  </>
                ) : (
                  <>
                    <Calculator className="w-6 h-6 mr-3" />
                    Generate Revenue Prediction
                  </>
                )}
              </Button>
            </div>

            {/* Training Required Notice */}
            {!status?.supervised_model && (
              <div className="mt-8 p-6 bg-amber-50/80 backdrop-blur-sm rounded-2xl border-2 border-amber-200/60">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-amber-100/80 rounded-xl">
                    <AlertCircle className="w-5 h-5 text-amber-700 flex-shrink-0" />
                  </div>
                  <div>
                    <p className="font-bold text-amber-900 text-lg">
                      Model Training Required
                    </p>
                    <p className="text-amber-800 font-medium mt-1">
                      Please train the supervised model first in the Training
                      section to enable predictions.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Section */}
        {predictionResult && (
          <Card
            ref={resultsRef}
            className="border-0 bg-white/70 backdrop-blur-md shadow-2xl rounded-3xl overflow-hidden"
          >
            <CardHeader className="bg-gradient-to-r from-emerald-50/80 to-blue-50/80 backdrop-blur-sm border-b border-slate-200/60">
              <CardTitle className="flex items-center gap-3 text-2xl text-slate-900">
                <div className="p-2 bg-emerald-600/10 rounded-xl">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                </div>
                Prediction Results
              </CardTitle>
              <CardDescription className="text-slate-700 font-medium text-base">
                Revenue prediction based on machine learning analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid gap-8 md:grid-cols-3">
                {/* Predicted Revenue */}
                <div className="text-center p-8 bg-white/60 backdrop-blur-sm rounded-2xl border border-slate-200/40 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-800/90 to-slate-900/90 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-3">
                    ML Predicted Revenue
                  </p>
                  <p
                    className={`text-4xl font-bold mt-3 ${getRevenueColor(
                      predictionResult.prediction
                    )}`}
                  >
                    {formatCurrency(predictionResult.prediction)}
                  </p>
                  <p className="text-sm text-slate-500 font-medium mt-4 bg-slate-100/70 backdrop-blur-sm px-4 py-2 rounded-xl">
                    Based on trained model
                  </p>
                </div>

                {/* Theoretical Revenue */}
                <div className="text-center p-8 bg-white/60 backdrop-blur-sm rounded-2xl border border-slate-200/40 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="w-16 h-16 bg-slate-600/90 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Calculator className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-3">
                    Theoretical Revenue
                  </p>
                  <p
                    className={`text-4xl font-bold mt-3 ${getRevenueColor(
                      predictionResult.theoretical_revenue
                    )}`}
                  >
                    {formatCurrency(predictionResult.theoretical_revenue)}
                  </p>
                  <p className="text-sm text-slate-500 font-medium mt-4 bg-slate-100/70 backdrop-blur-sm px-4 py-2 rounded-xl">
                    Standard rate calculation
                  </p>
                </div>

                {/* Model Difference */}
                <div className="text-center p-8 bg-white/60 backdrop-blur-sm rounded-2xl border border-slate-200/40 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div
                    className={`w-16 h-16 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg ${
                      predictionResult.model_difference >= 0
                        ? "bg-emerald-600/90"
                        : "bg-red-500/90"
                    }`}
                  >
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-3">
                    Model Insight
                  </p>
                  <p
                    className={`text-4xl font-bold mt-3 ${
                      predictionResult.model_difference >= 0
                        ? "text-emerald-600"
                        : "text-red-600"
                    }`}
                  >
                    {predictionResult.model_difference >= 0 ? "+" : ""}
                    {formatCurrency(predictionResult.model_difference)}
                  </p>
                  <p
                    className={`text-sm font-medium mt-4 px-4 py-2 rounded-xl backdrop-blur-sm ${
                      predictionResult.model_difference >= 0
                        ? "text-emerald-700 bg-emerald-100/70"
                        : "text-red-700 bg-red-100/70"
                    }`}
                  >
                    {predictionResult.model_difference >= 0
                      ? "Above standard"
                      : "Below standard"}
                  </p>
                </div>
              </div>

              {/* Insights */}
              <div className="mt-12 p-8 bg-slate-50/70 backdrop-blur-sm rounded-2xl border border-slate-200/40">
                <h4 className="font-bold text-slate-900 mb-6 text-lg flex items-center gap-3">
                  <div className="p-2 bg-blue-800/10 rounded-xl">💡</div>
                  Smart Insights
                </h4>
                <div className="space-y-4 text-slate-800">
                  {predictionResult.prediction >
                    predictionResult.theoretical_revenue && (
                    <div className="p-4 bg-emerald-50/80 backdrop-blur-sm border border-emerald-200/60 rounded-xl">
                      <p className="font-semibold text-emerald-800">
                        ✅ The ML model predicts higher revenue than standard
                        rates, indicating favorable conditions for this trip.
                      </p>
                    </div>
                  )}
                  {predictionResult.prediction <
                    predictionResult.theoretical_revenue && (
                    <div className="p-4 bg-amber-50/80 backdrop-blur-sm border border-amber-200/60 rounded-xl">
                      <p className="font-semibold text-amber-800">
                        ⚠️ The ML model predicts lower revenue than standard
                        rates, suggesting challenging conditions for this trip.
                      </p>
                    </div>
                  )}
                  {predictionForm.duration > 30 && (
                    <div className="p-4 bg-blue-50/80 backdrop-blur-sm border border-blue-200/60 rounded-xl">
                      <p className="font-semibold text-blue-800">
                        📊 This trip has {predictionForm.duration - 30} excess
                        minutes at $0.39/min standard rate.
                      </p>
                    </div>
                  )}
                  {predictionForm.is_weekend && (
                    <div className="p-4 bg-purple-50/80 backdrop-blur-sm border border-purple-200/60 rounded-xl">
                      <p className="font-semibold text-purple-800">
                        🎯 Weekend trips often have different usage patterns
                        affecting revenue potential.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Predictions;
