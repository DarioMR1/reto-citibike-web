import type {
  SystemStatus,
  KPIs,
  PredictionRequest,
  PredictionResult,
  DatasetRecord,
  DatasetFilters,
  DatasetSummary,
  DatasetResponse,
  CacheEntry,
} from "@/types";

// API Base URL
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Cache configuration
export const CACHE_DURATION = {
  STATUS: 30 * 1000, // 30 seconds
  DASHBOARD: 2 * 60 * 1000, // 2 minutes
  CHARTS: 5 * 60 * 1000, // 5 minutes
  ANOMALIES: 10 * 60 * 1000, // 10 minutes
};

// Cache manager class
export class CacheManager {
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

// Create a singleton cache manager instance
export const cacheManager = new CacheManager();

// Cache-aware fetch function
export const fetchWithCache = async (
  url: string,
  cacheKey: string,
  cacheDuration: number,
  forceRefresh = false
): Promise<any | null> => {
  // Check cache first (unless force refresh)
  if (!forceRefresh) {
    const cachedData = cacheManager.get(cacheKey);
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
    cacheManager.set(cacheKey, data, cacheDuration);

    return data;
  } catch (err) {
    console.error(`❌ Error fetching ${cacheKey}:`, err);
    return null;
  }
};

// API Service Functions

export const fetchStatus = async (forceRefresh = false): Promise<SystemStatus | null> => {
  const data = await fetchWithCache(
    `${API_BASE_URL}/api/status`,
    "system_status",
    CACHE_DURATION.STATUS,
    forceRefresh
  );

  return data;
};

export const fetchDashboard = async (forceRefresh = false) => {
  const data = await fetchWithCache(
    `${API_BASE_URL}/api/dashboard`,
    "dashboard_kpis",
    CACHE_DURATION.DASHBOARD,
    forceRefresh
  );

  return data?.success ? data.kpis : null;
};

export const fetchChartData = async (forceRefresh = false) => {
  try {
    // Fetch all chart data with caching
    const chartEndpoints = [
      {
        url: `${API_BASE_URL}/api/visualizations/revenue_analysis`,
        key: "chart_revenue",
      },
      {
        url: `${API_BASE_URL}/api/visualizations/station_balance`,
        key: "chart_station",
      },
      {
        url: `${API_BASE_URL}/api/visualizations/user_distribution`,
        key: "chart_user",
      },
      {
        url: `${API_BASE_URL}/api/visualizations/anomalies_by_hour`,
        key: "chart_anomalies",
      },
      {
        url: `${API_BASE_URL}/api/visualizations/weather_impact`,
        key: "chart_weather",
      },
    ];

    // Fetch all charts in parallel with caching
    const promises = chartEndpoints.map(async ({ url, key }) => {
      const data = await fetchWithCache(
        url,
        key,
        CACHE_DURATION.CHARTS,
        forceRefresh
      );

      return {
        key,
        data: data?.success ? data.chart_data || [] : [],
      };
    });

    const results = await Promise.all(promises);
    
    // Convert array to object with chart data
    const chartData: Record<string, any[]> = {};
    results.forEach(({ key, data }) => {
      chartData[key] = data;
    });

    return chartData;
  } catch (err) {
    console.error("Error fetching chart data:", err);
    throw new Error("Failed to fetch chart data");
  }
};

export const fetchAnomalyData = async (forceRefresh = false) => {
  const data = await fetchWithCache(
    `${API_BASE_URL}/api/visualizations/anomalies_scatter`,
    "anomalies_scatter",
    CACHE_DURATION.ANOMALIES,
    forceRefresh
  );

  if (data?.success) {
    return {
      normal_points: data.normal_points || [],
      anomaly_points: data.anomaly_points || [],
    };
  }

  return {
    normal_points: [],
    anomaly_points: [],
  };
};

export const fetchDatasetRecords = async (
  page: number = 1,
  filters: DatasetFilters,
  forceRefresh = false
): Promise<{
  records: DatasetRecord[];
  totalPages: number;
  totalRecords: number;
  summary: DatasetSummary | null;
  currentPage: number;
} | null> => {
  try {
    const cacheKey = `dataset_${page}_${JSON.stringify(filters)}`;

    const requestBody = {
      page,
      limit: 10,
      ...filters,
    };

    let data;
    if (forceRefresh) {
      cacheManager.invalidatePattern("dataset_");
    }

    const cachedData = cacheManager.get(cacheKey);
    if (cachedData && !forceRefresh) {
      console.log(`📦 Cache hit for ${cacheKey}`);
      data = cachedData;
    } else {
      console.log(`🌐 Fetching dataset records: page ${page}`);
      const response = await fetch(`${API_BASE_URL}/api/dataset/records`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      data = await response.json();

      // Cache the response
      cacheManager.set(cacheKey, data, CACHE_DURATION.DASHBOARD);
    }

    if (data?.success) {
      return {
        records: data.records,
        totalPages: data.total_pages,
        totalRecords: data.total_records,
        summary: data.summary,
        currentPage: data.current_page,
      };
    } else {
      throw new Error("Failed to fetch dataset records");
    }
  } catch (err) {
    console.error("Error fetching dataset records:", err);
    throw new Error("Failed to fetch dataset records");
  }
};

// Training API Functions
export const trainUnsupervisedModel = async (): Promise<{ success: boolean; message?: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/train/unsupervised`, {
      method: "POST",
    });
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to start training");
    }

    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to start unsupervised model training";
    return { success: false, message };
  }
};

export const trainSupervisedModel = async (): Promise<{ success: boolean; message?: string; results?: any }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/train/supervised`, {
      method: "POST",
    });
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to start supervised training");
    }

    return { 
      success: true, 
      results: data.results,
      message: data.message 
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to start supervised model training";
    return { success: false, message };
  }
};



// Get counterfactual analysis
export const fetchCounterfactualAnalysis = async (): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/counterfactual/analysis`);
    const data = await response.json();
    return data.success ? data : null;
  } catch (err) {
    console.error("Error fetching counterfactual analysis:", err);
    return null;
  }
};

// Get anomaly analysis details
export const fetchAnomalyAnalysis = async (): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/anomalies/analysis`);
    const data = await response.json();
    return data.success ? data : null;
  } catch (err) {
    console.error("Error fetching anomaly analysis:", err);
    return null;
  }
};

// Prediction API Functions
export const makePrediction = async (predictionForm: PredictionRequest): Promise<PredictionResult> => {
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
      return {
        prediction: data.prediction,
        theoretical_revenue: data.theoretical_revenue,
        model_difference: data.model_difference,
      };
    } else {
      throw new Error(data.detail || "Prediction failed");
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to make prediction";
    throw new Error(message);
  }
};

// Cache management utilities
export const invalidateCache = (key: string): void => {
  cacheManager.invalidate(key);
};

export const invalidateCachePattern = (pattern: string): void => {
  cacheManager.invalidatePattern(pattern);
};

export const clearAllCache = (): void => {
  cacheManager.clear();
};

export const getCacheStats = (): { size: number; keys: string[] } => {
  return cacheManager.getStats();
}; 