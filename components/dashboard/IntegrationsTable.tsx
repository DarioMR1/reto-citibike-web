"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Database,
  Filter,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
  Calendar,
  MapPin,
  DollarSign,
  Clock,
  Thermometer,
  Bike,
  Users,
} from "lucide-react";
import type { IntegrationsTableProps, DatasetFilters } from "@/types";

const IntegrationsTable = ({
  records,
  loading,
  currentPage,
  totalPages,
  totalRecords,
  summary,
  filters,
  onPageChange,
  onFilterChange,
  onRefresh,
}: IntegrationsTableProps) => {
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState({
    station_filter: filters.station_filter || "",
    member_type_filter: filters.member_type_filter || "all",
    month_filter: filters.month_filter
      ? filters.month_filter.toString()
      : "all",
    min_revenue: filters.min_revenue || "",
    max_revenue: filters.max_revenue || "",
  });

  const handleSort = (column: string) => {
    const newOrder =
      filters.sort_by === column && filters.sort_order === "asc"
        ? "desc"
        : "asc";
    onFilterChange({ sort_by: column, sort_order: newOrder });
  };

  const getSortIcon = (column: string) => {
    if (filters.sort_by !== column) return <ArrowUpDown className="w-4 h-4" />;
    return filters.sort_order === "asc" ? (
      <ArrowUp className="w-4 h-4" />
    ) : (
      <ArrowDown className="w-4 h-4" />
    );
  };

  const applyFilters = () => {
    const filtersToApply: Partial<DatasetFilters> = {};

    if (localFilters.station_filter)
      filtersToApply.station_filter = localFilters.station_filter;
    if (
      localFilters.member_type_filter &&
      localFilters.member_type_filter !== "all"
    )
      filtersToApply.member_type_filter = localFilters.member_type_filter;
    if (localFilters.month_filter && localFilters.month_filter !== "all")
      filtersToApply.month_filter = parseInt(
        localFilters.month_filter.toString()
      );
    if (localFilters.min_revenue)
      filtersToApply.min_revenue = parseFloat(
        localFilters.min_revenue.toString()
      );
    if (localFilters.max_revenue)
      filtersToApply.max_revenue = parseFloat(
        localFilters.max_revenue.toString()
      );

    onFilterChange(filtersToApply);
  };

  const clearFilters = () => {
    setLocalFilters({
      station_filter: "",
      member_type_filter: "all",
      month_filter: "all",
      min_revenue: "",
      max_revenue: "",
    });
    onFilterChange({
      station_filter: undefined,
      member_type_filter: undefined,
      month_filter: undefined,
      min_revenue: undefined,
      max_revenue: undefined,
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getMonthName = (month: number) => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return months[month - 1] || month.toString();
  };

  const getBikeTypeLabel = (type: number) => {
    return type === 1 ? "Classic" : "Electric";
  };

  const getMemberTypeBadge = (type: string) => {
    return type === "member" ? (
      <Badge className="bg-blue-100/80 text-blue-800 border-blue-200/60 font-semibold rounded-xl backdrop-blur-sm">
        Member
      </Badge>
    ) : (
      <Badge className="bg-emerald-100/80 text-emerald-800 border-emerald-200/60 font-semibold rounded-xl backdrop-blur-sm">
        Casual
      </Badge>
    );
  };

  const getRevenueBadge = (revenue: number) => {
    if (revenue === 0) {
      return (
        <Badge className="bg-slate-100/80 text-slate-600 border-slate-200/60 font-semibold rounded-xl backdrop-blur-sm">
          No Excess
        </Badge>
      );
    } else if (revenue > 5) {
      return (
        <Badge className="bg-emerald-100/80 text-emerald-800 border-emerald-200/60 font-semibold rounded-xl backdrop-blur-sm">
          High Revenue
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-amber-100/80 text-amber-800 border-amber-200/60 font-semibold rounded-xl backdrop-blur-sm">
          Standard
        </Badge>
      );
    }
  };

  if (loading && records.length === 0) {
    return (
      <Card className="border-0 bg-white/70 backdrop-blur-md shadow-lg rounded-3xl">
        <CardHeader className="bg-gradient-to-r from-slate-900/5 to-blue-800/5 backdrop-blur-sm rounded-t-3xl">
          <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-900">
            <Database className="w-5 h-5 text-blue-800" />
            CitiBike Dataset Explorer
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between p-6 bg-slate-100/70 animate-pulse rounded-2xl backdrop-blur-sm"
              >
                <div className="h-4 bg-slate-200/80 rounded-xl w-32"></div>
                <div className="h-4 bg-slate-200/80 rounded-xl w-16"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 bg-white/70 backdrop-blur-md shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-800/10 rounded-xl">
                  <DollarSign className="w-6 h-6 text-blue-800" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
                    Total Revenue
                  </p>
                  <p className="text-2xl font-bold text-slate-900">
                    {formatCurrency(summary.total_revenue)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/70 backdrop-blur-md shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-600/10 rounded-xl">
                  <Clock className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
                    Avg Duration
                  </p>
                  <p className="text-2xl font-bold text-slate-900">
                    {summary.avg_duration.toFixed(1)} min
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/70 backdrop-blur-md shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-600/10 rounded-xl">
                  <MapPin className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
                    Unique Stations
                  </p>
                  <p className="text-2xl font-bold text-slate-900">
                    {summary.unique_stations}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/70 backdrop-blur-md shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-600/10 rounded-xl">
                  <Users className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
                    Total Records
                  </p>
                  <p className="text-2xl font-bold text-slate-900">
                    {totalRecords.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Data Table */}
      <Card className="border-0 bg-white/70 backdrop-blur-md shadow-lg rounded-3xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-slate-900/5 to-blue-800/5 backdrop-blur-sm border-b border-slate-200/60">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-900">
              <Database className="w-5 h-5 text-blue-800" />
              CitiBike Dataset Explorer
            </CardTitle>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="bg-white/80 backdrop-blur-sm border-slate-200/60 hover:bg-slate-50/80 text-slate-700 font-semibold rounded-xl"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                disabled={loading}
                className="bg-white/80 backdrop-blur-sm border-slate-200/60 hover:bg-slate-50/80 text-slate-700 font-semibold rounded-xl"
              >
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* Filters Panel */}
        {showFilters && (
          <div className="p-6 bg-gradient-to-r from-slate-100/90 to-blue-50/90 backdrop-blur-sm border-b border-slate-200/60">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label className="text-sm font-bold text-slate-800 mb-2 block">
                  Station ID
                </Label>
                <Input
                  placeholder="Search station..."
                  value={localFilters.station_filter}
                  onChange={(e) =>
                    setLocalFilters((prev) => ({
                      ...prev,
                      station_filter: e.target.value,
                    }))
                  }
                  className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-500 rounded-xl focus:border-blue-800 focus:ring-2 focus:ring-blue-800/20"
                />
              </div>

              <div>
                <Label className="text-sm font-bold text-slate-800 mb-2 block">
                  Member Type
                </Label>
                <Select
                  value={localFilters.member_type_filter}
                  onValueChange={(value) =>
                    setLocalFilters((prev) => ({
                      ...prev,
                      member_type_filter: value,
                    }))
                  }
                >
                  <SelectTrigger className="bg-white border-slate-300 text-slate-900 rounded-xl focus:border-blue-800 focus:ring-2 focus:ring-blue-800/20">
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-slate-300 shadow-xl rounded-xl">
                    <SelectItem
                      value="all"
                      className="text-slate-900 hover:bg-blue-50 focus:bg-blue-100"
                    >
                      All Types
                    </SelectItem>
                    <SelectItem
                      value="member"
                      className="text-slate-900 hover:bg-blue-50 focus:bg-blue-100"
                    >
                      Member
                    </SelectItem>
                    <SelectItem
                      value="casual"
                      className="text-slate-900 hover:bg-blue-50 focus:bg-blue-100"
                    >
                      Casual
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-bold text-slate-800 mb-2 block">
                  Month
                </Label>
                <Select
                  value={localFilters.month_filter.toString()}
                  onValueChange={(value) =>
                    setLocalFilters((prev) => ({
                      ...prev,
                      month_filter: value,
                    }))
                  }
                >
                  <SelectTrigger className="bg-white border-slate-300 text-slate-900 rounded-xl focus:border-blue-800 focus:ring-2 focus:ring-blue-800/20">
                    <SelectValue placeholder="All months" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-slate-300 shadow-xl rounded-xl">
                    <SelectItem
                      value="all"
                      className="text-slate-900 hover:bg-blue-50 focus:bg-blue-100"
                    >
                      All Months
                    </SelectItem>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(
                      (month) => (
                        <SelectItem
                          key={month}
                          value={month.toString()}
                          className="text-slate-900 hover:bg-blue-50 focus:bg-blue-100"
                        >
                          {getMonthName(month)}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-bold text-slate-800 mb-2 block">
                  Min Revenue ($)
                </Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={localFilters.min_revenue}
                  onChange={(e) =>
                    setLocalFilters((prev) => ({
                      ...prev,
                      min_revenue: e.target.value,
                    }))
                  }
                  className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-500 rounded-xl focus:border-blue-800 focus:ring-2 focus:ring-blue-800/20"
                />
              </div>

              <div>
                <Label className="text-sm font-bold text-slate-800 mb-2 block">
                  Max Revenue ($)
                </Label>
                <Input
                  type="number"
                  placeholder="100.00"
                  value={localFilters.max_revenue}
                  onChange={(e) =>
                    setLocalFilters((prev) => ({
                      ...prev,
                      max_revenue: e.target.value,
                    }))
                  }
                  className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-500 rounded-xl focus:border-blue-800 focus:ring-2 focus:ring-blue-800/20"
                />
              </div>

              <div className="flex items-end gap-2">
                <Button
                  onClick={applyFilters}
                  className="bg-blue-800 hover:bg-blue-900 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Apply
                </Button>
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="bg-white border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
                >
                  Clear
                </Button>
              </div>
            </div>
          </div>
        )}

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/70 backdrop-blur-sm border-b border-slate-200/60">
                  <TableHead
                    className="cursor-pointer hover:bg-slate-100/70 transition-colors duration-200 font-bold text-slate-700"
                    onClick={() => handleSort("START_STATION_ID")}
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Start Station
                      {getSortIcon("START_STATION_ID")}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-slate-100/70 transition-colors duration-200 font-bold text-slate-700"
                    onClick={() => handleSort("HOUR")}
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Time
                      {getSortIcon("HOUR")}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-slate-100/70 transition-colors duration-200 font-bold text-slate-700"
                    onClick={() => handleSort("MONTH")}
                  >
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Date
                      {getSortIcon("MONTH")}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-slate-100/70 transition-colors duration-200 font-bold text-slate-700"
                    onClick={() => handleSort("TEMPERATURE_2M")}
                  >
                    <div className="flex items-center gap-2">
                      <Thermometer className="w-4 h-4" />
                      Weather
                      {getSortIcon("TEMPERATURE_2M")}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-slate-100/70 transition-colors duration-200 font-bold text-slate-700"
                    onClick={() => handleSort("BIKE_TYPE_ID")}
                  >
                    <div className="flex items-center gap-2">
                      <Bike className="w-4 h-4" />
                      Bike
                      {getSortIcon("BIKE_TYPE_ID")}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-slate-100/70 transition-colors duration-200 font-bold text-slate-700"
                    onClick={() => handleSort("DURACION_MINUTOS")}
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Duration
                      {getSortIcon("DURACION_MINUTOS")}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-slate-100/70 transition-colors duration-200 font-bold text-slate-700"
                    onClick={() => handleSort("MEMBER_CASUAL")}
                  >
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Member
                      {getSortIcon("MEMBER_CASUAL")}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-slate-100/70 transition-colors duration-200 font-bold text-slate-700"
                    onClick={() => handleSort("INGRESO_MIN_EXCEDENTE")}
                  >
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Revenue
                      {getSortIcon("INGRESO_MIN_EXCEDENTE")}
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 10 }).map((_, i) => (
                    <TableRow key={i} className="border-b border-slate-200/60">
                      {Array.from({ length: 8 }).map((_, j) => (
                        <TableCell key={j} className="py-4">
                          <div className="h-4 bg-slate-200/80 rounded-xl animate-pulse"></div>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : records.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12">
                      <div className="flex flex-col items-center gap-4">
                        <Database className="w-12 h-12 text-slate-400" />
                        <p className="text-slate-600 font-medium">
                          No records found
                        </p>
                        <p className="text-slate-500 text-sm">
                          Try adjusting your filters
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  records.map((record) => (
                    <TableRow
                      key={record.id}
                      className="border-b border-slate-200/60 hover:bg-slate-50/50 transition-colors duration-200"
                    >
                      <TableCell className="font-semibold text-slate-900">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-800 rounded-full"></div>
                          {record.start_station_id}
                        </div>
                        {record.end_station_id && (
                          <div className="text-xs text-slate-500 mt-1">
                            → {record.end_station_id}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold text-slate-900">
                          {record.hour.toString().padStart(2, "0")}:00
                        </div>
                        <div className="text-xs text-slate-500">
                          {record.day_name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold text-slate-900">
                          {getMonthName(record.month)}
                        </div>
                        {record.is_weekend && (
                          <Badge className="bg-purple-100/80 text-purple-800 border-purple-200/60 text-xs font-semibold rounded-lg backdrop-blur-sm mt-1">
                            Weekend
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold text-slate-900">
                          {record.temperature}°C
                        </div>
                        <div className="text-xs text-slate-500">
                          {record.humidity}% humidity
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`font-semibold rounded-xl backdrop-blur-sm ${
                            record.bike_type === 1
                              ? "bg-slate-100/80 text-slate-800 border-slate-200/60"
                              : "bg-blue-100/80 text-blue-800 border-blue-200/60"
                          }`}
                        >
                          {getBikeTypeLabel(record.bike_type)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold text-slate-900">
                          {record.duration} min
                        </div>
                        {record.duration > record.included_minutes && (
                          <div className="text-xs text-amber-600 font-medium">
                            +{record.duration - record.included_minutes} excess
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {getMemberTypeBadge(record.member_type)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">
                            {formatCurrency(record.revenue)}
                          </span>
                          {getRevenueBadge(record.revenue)}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-6 bg-slate-50/70 backdrop-blur-sm border-t border-slate-200/60">
              <div className="text-sm text-slate-600 font-medium">
                Showing {(currentPage - 1) * 10 + 1} to{" "}
                {Math.min(currentPage * 10, totalRecords)} of{" "}
                {totalRecords.toLocaleString()} records
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage === 1 || loading}
                  className="bg-white/80 backdrop-blur-sm border-slate-200/60 hover:bg-slate-50/80 text-slate-700 font-semibold rounded-xl"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum =
                      Math.max(1, Math.min(totalPages - 4, currentPage - 2)) +
                      i;
                    return (
                      <Button
                        key={pageNum}
                        variant={
                          pageNum === currentPage ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => onPageChange(pageNum)}
                        disabled={loading}
                        className={`w-10 h-10 rounded-xl font-semibold ${
                          pageNum === currentPage
                            ? "bg-blue-800 hover:bg-blue-900 text-white"
                            : "bg-white/80 backdrop-blur-sm border-slate-200/60 hover:bg-slate-50/80 text-slate-700"
                        }`}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || loading}
                  className="bg-white/80 backdrop-blur-sm border-slate-200/60 hover:bg-slate-50/80 text-slate-700 font-semibold rounded-xl"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default IntegrationsTable;
