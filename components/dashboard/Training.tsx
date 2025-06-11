"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface SystemStatus {
  supervised_model: boolean;
  unsupervised_model: boolean;
  models_loaded: boolean;
  training_status: string;
}

interface TrainingProps {
  status: SystemStatus | null;
  trainingSupervised: boolean;
  trainingUnsupervised: boolean;
  onTrainSupervised: () => void;
  onTrainUnsupervised: () => void;
}

const Training: React.FC<TrainingProps> = ({
  status,
  trainingSupervised,
  trainingUnsupervised,
  onTrainSupervised,
  onTrainUnsupervised,
}) => {
  return (
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
              onClick={onTrainSupervised}
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
              onClick={onTrainUnsupervised}
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
};

export default Training;
