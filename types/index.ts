// Global types for CitiBike Analytics Application

export interface SystemStatus {
  supervised_model: boolean;
  unsupervised_model: boolean;
  models_loaded: boolean;
  training_status: string;
  is_training: boolean;
  current_stage: string;
  progress: number;
}

export interface KPIs {
  total_viajes: number;
  ingresos_totales: number;
  ingreso_promedio: number;
  estaciones_activas: number;
  viajes_con_ingresos: number;
  anomalias_detectadas?: number;
  porcentaje_anomalias?: number;
}

export interface PredictionRequest {
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

export interface PredictionResult {
  prediction: number;
  theoretical_revenue: number;
  model_difference: number;
}

export interface DatasetRecord {
  id: string;
  start_station_id: string;
  end_station_id: string;
  hour: number;
  day_name: string;
  is_weekend: boolean;
  month: number;
  temperature: number;
  humidity: number;
  bike_type: number;
  duration: number;
  member_type: string;
  revenue: number;
  included_minutes: number;
  excess_rate: number;
}

export interface DatasetFilters {
  station_filter?: string;
  member_type_filter?: string;
  month_filter?: number;
  min_revenue?: number;
  max_revenue?: number;
  sort_by: string;
  sort_order: string;
}

export interface DatasetSummary {
  total_revenue: number;
  avg_revenue: number;
  avg_duration: number;
  unique_stations: number;
  member_distribution: Record<string, number>;
}

export interface DatasetResponse {
  success: boolean;
  records: DatasetRecord[];
  total_records: number;
  total_pages: number;
  current_page: number;
  summary: DatasetSummary;
  filters_applied: DatasetFilters;
}

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

// Component Props Interfaces
export interface DashboardProps {
  kpis: KPIs | null;
  status: SystemStatus | null;
  loading: boolean;
  chartsLoading: boolean;
  revenueByHourData: any[];
  stationBalanceData: any[];
  userTypeData: any[];
  anomaliesData: any[];
  weatherImpactData: any[];
  onRefreshData: () => void;
}

export interface AnomaliesProps {
  status: SystemStatus | null;
  anomaliesData: any[];
  anomaliesScatterData: {
    normal_points: any[];
    anomaly_points: any[];
  };
  chartsLoading: boolean;
  trainingUnsupervised: boolean;
  onTrainUnsupervised: () => void;
  onNavigateToTraining?: () => void;
}

export interface PredictionsProps {
  status: SystemStatus | null;
  predictionForm: PredictionRequest;
  predictionResult: PredictionResult | null;
  predicting: boolean;
  onInputChange: (
    field: keyof PredictionRequest
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (field: keyof PredictionRequest) => (value: string) => void;
  onCheckboxChange: (checked: boolean) => void;
  onMakePrediction: () => void;
}

export interface IntegrationsTableProps {
  records: DatasetRecord[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  summary: DatasetSummary | null;
  filters: DatasetFilters;
  onPageChange: (page: number) => void;
  onFilterChange: (filters: Partial<DatasetFilters>) => void;
  onRefresh: () => void;
} 