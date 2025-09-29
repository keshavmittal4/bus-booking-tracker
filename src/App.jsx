import React, { useState, useMemo, useCallback } from "react";
import { Menu, X } from "lucide-react";
import data from "./mockData.js";
import { SOURCE_OPTIONS, TIME_WINDOWS, COLORS } from "./utils/constants.jsx";
import { formatDate, formatTime } from "./utils/formatter.jsx";
import Sidebar from "./components/Sidebar.jsx";
import DashboardView from "./pages/Dashboard.jsx";
import BookingsListView from "./components/BookingsListView.jsx";
import BookingDetailModal from "./components/BookingDetailModal.jsx";

const App = () => {
  const [bookings, setBookings] = useState(data);
  const [filters, setFilters] = useState({
    source: "all",
    startDate: "",
    endDate: "",
    timeWindow: "all",
    search: "",
  });
  const [currentView, setCurrentView] = useState("dashboard");
  const [sortConfig, setSortConfig] = useState({
    key: "timestamp",
    direction: "descending",
  });
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const getBookingsToday = useCallback(() => {
    const today = new Date().toISOString().split("T")[0];
    // console.log(today);
    return bookings.filter((b) => b.date === today);
  }, [bookings]);

  const filteredBookings = useMemo(() => {
    let filtered = [...bookings];

    // source Filter
    if (filters.source !== "all") {
      filtered = filtered.filter((b) => b.source === filters.source);
    }

    // date Range Filter
    if (filters.startDate) {
      const start = new Date(filters.startDate).getTime();
      filtered = filtered.filter((b) => new Date(b.date).getTime() >= start);
    }
    if (filters.endDate) {
      const end = new Date(filters.endDate);
      end.setHours(23, 59, 59, 999);
      const endTime = end.getTime();
      filtered = filtered.filter((b) => b.timestamp <= endTime);
    }

    // time Window Filter
    if (filters.timeWindow !== "all") {
      const window = TIME_WINDOWS.find((w) => w.id === filters.timeWindow);
      if (window) {
        filtered = filtered.filter((b) => {
          const hour = b.timeHour;
          if (window.start < window.end) {
            return hour >= window.start && hour < window.end;
          } else {
            return hour >= window.start || hour < window.end;
          }
        });
      }
    }

    // search Filter
    if (filters.search) {
      const query = filters.search.toLowerCase();
      filtered = filtered.filter(
        (b) =>
          b.passengerName.toLowerCase().includes(query) ||
          b.id.toLowerCase().includes(query)
      );
    }

    // sorting
    filtered.sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      if (typeof aValue === "number") {
        return sortConfig.direction === "ascending"
          ? aValue - bValue
          : bValue - aValue;
      }
      if (aValue < bValue) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });

    return filtered;
  }, [bookings, filters, sortConfig]);

  // --- Filter Handlers ---
  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      source: "all",
      startDate: "",
      endDate: "",
      timeWindow: "all",
      search: "",
    });
  };

  // --- Sorting Handler ---
  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // --- Detail Modal Handlers ---
  const handleViewDetail = (booking) => {
    setSelectedBooking(booking);
  };

  const handleCloseDetail = () => {
    setSelectedBooking(null);
  };

  const analyticsData = useMemo(() => {
    const totalBookings = filteredBookings.length;
    const totalFare = filteredBookings.reduce((sum, b) => sum + b.fare, 0);
    const bookingsTodayCount = getBookingsToday().length;
    // console.log(bookingsTodayCount);

    // Source Chart
    const sourceMap = filteredBookings.reduce((acc, b) => {
      acc[b.source] = acc[b.source] ? acc[b.source] + 1 : 1;
      return acc;
    }, {});

    const bookingsBySource = Object.keys(sourceMap).map((sourceId) => {
      const sourceName =
        SOURCE_OPTIONS.find((s) => s.id === sourceId)?.name || "Unknown";
      return {
        name: sourceName,
        value: sourceMap[sourceId],
        color: sourceId in COLORS ? COLORS[sourceId] : "#6B7280",
      };
    });

    //  Trend Chart
    const dailyMap = filteredBookings.reduce((acc, b) => {
      const dateKey = formatDate(b.date);
      acc[dateKey] = acc[dateKey] ? acc[dateKey] + 1 : 1;
      return acc;
    }, {});

    const bookingTrend = Object.keys(dailyMap)
      .map((date) => ({
        date: date,
        count: dailyMap[date],
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    const timeMap = filteredBookings.reduce((acc, b) => {
      let windowId = "other";
      for (const window of TIME_WINDOWS.slice(1)) {
        const hour = b.timeHour;
        if (window.start < window.end) {
          if (hour >= window.start && hour < window.end) {
            windowId = window.id;
            break;
          }
        } else {
          if (hour >= window.start || hour < window.end) {
            windowId = window.id;
            break;
          }
        }
      }
      acc[windowId] = acc[windowId] ? acc[windowId] + 1 : 1;
      return acc;
    }, {});

    const timeDistribution = TIME_WINDOWS.slice(1).map((window) => ({
      name: window.name.split("(")[0].trim(),
      count: timeMap[window.id] || 0,
    }));

    return {
      totalBookings,
      totalFare,
      bookingsTodayCount,
      bookingsBySource,
      bookingTrend,
      timeDistribution,
    };
  }, [filteredBookings, getBookingsToday]);

  // ------------- Data for CSVLink (NEW) ------------
  const csvData = useMemo(() => {
    if (filteredBookings.length === 0) {
      return [];
    }

    return filteredBookings.map((b) => ({
      "Booking ID": b.id,
      "Passenger Name": b.passengerName,
      Source: SOURCE_OPTIONS.find((s) => s.id === b.source)?.name || "Unknown",
      Origin: b.origin,
      Destination: b.destination,
      Date: formatDate(b.date),
      Time: formatTime(b.time),
      Seats: b.seats,
      Fare: b.fare,
      Status: b.status,
    }));
  }, [filteredBookings]);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header/Nav */}
        <header className="bg-white shadow-md md:hidden p-4 flex justify-between items-center z-30">
          <div className="text-xl font-bold text-gray-900">
            {currentView === "dashboard" ? "Dashboard" : "Bookings List"}
          </div>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 text-gray-600 hover:text-indigo-600"
          >
            {isSidebarOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          {currentView === "dashboard" && (
            <DashboardView analyticsData={analyticsData} />
          )}
          {currentView === "list" && (
            <BookingsListView
              filteredBookings={filteredBookings}
              csvData={csvData} 
              filters={filters}
              onFilterChange={handleFilterChange}
              onClear={clearFilters}
              sortConfig={sortConfig}
              requestSort={requestSort}
              handleViewDetail={handleViewDetail}
            />
          )}
        </main>
      </div>

      {/* Booking Detail Modal */}
      <BookingDetailModal
        booking={selectedBooking}
        onClose={handleCloseDetail}
      />
    </div>
  );
};

export default App;
