import React, { useState, useMemo, useEffect } from "react";
import {
  ChevronUp,
  ChevronDown,
  Download,
  Search,
  Filter,
  MapPin,
  Bus,
} from "lucide-react";
import {
  StatusPill,
  formatCurrency,
  formatDate,
  formatTime,
} from "../utils/formatter.jsx";
import { SOURCE_OPTIONS, COLORS, TIME_WINDOWS } from "../utils/constants.jsx";
import { CSVLink } from "react-csv";

const EmptyState = () => (
  <div className="text-center py-20 bg-white rounded-xl shadow-lg border border-gray-100">
    <Filter className="w-12 h-12 mx-auto text-gray-400" />
    <h3 className="mt-2 text-lg font-medium text-gray-900">
      No Bookings Found
    </h3>
    <p className="mt-1 text-sm text-gray-500">
      Try adjusting your search query or filters.
    </p>
  </div>
);

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  totalBookings,
  bookingsPerPage,
}) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-between items-center py-4 px-2 sm:px-0">
      <span className="text-sm text-gray-600 hidden sm:block">
        Showing{" "}
        {Math.min((currentPage - 1) * bookingsPerPage + 1, totalBookings)} to{" "}
        {Math.min(currentPage * bookingsPerPage, totalBookings)} of{" "}
        {totalBookings} results
      </span>
      <nav className="flex items-center space-x-1" aria-label="Pagination">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
        >
          Previous
        </button>
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`p-2 w-10 text-sm rounded-lg font-medium transition-colors ${
              currentPage === page
                ? "bg-indigo-600 text-white shadow-md"
                : "text-gray-700 bg-white hover:bg-indigo-50"
            }`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
        >
          Next
        </button>{" "}
      </nav>
    </div>
  );
};

const BookingItem = ({ booking, onViewDetail }) => {
  const sourceDetails = SOURCE_OPTIONS.find((s) => s.id === booking.source);
  const sourceName = sourceDetails ? sourceDetails.name : "Unknown";
  const sourceColor = COLORS[booking.source] || "#6B7280";

  return (
    // Mobile Card View
    <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200 md:hidden flex flex-col space-y-3">
      <div className="flex justify-between items-start">
        <h4 className="font-semibold text-lg text-gray-900">
          <MapPin className="inline w-4 h-4 mr-1 text-indigo-500" />
          {booking.origin} → {booking.destination}
        </h4>
        <StatusPill status={booking.status} />
      </div>
      <div className="text-sm space-y-1">
        <p className="flex justify-between">
          <span className="text-gray-500 font-medium">ID/Name:</span>
          <span>
            {booking.id} / {booking.passengerName}
          </span>
        </p>
        <p className="flex justify-between">
          <span className="text-gray-500 font-medium">Source:</span>
          <span className="font-semibold" style={{ color: sourceColor }}>
            {sourceName}
          </span>
        </p>
        <p className="flex justify-between">
          <span className="text-gray-500 font-medium">Date/Time:</span>
          <span>
            {formatDate(booking.date)} at {formatTime(booking.time)}
          </span>
        </p>
        <p className="flex justify-between">
          <span className="text-gray-500 font-medium">Fare / Seats:</span>
          <span className="font-bold text-emerald-600">
            {formatCurrency(booking.fare)} / {booking.seats}
          </span>
        </p>
      </div>
      <button
        onClick={() => onViewDetail(booking)}
        className="w-full mt-3 py-2 text-sm font-semibold text-indigo-700 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition"
      >
        View Details
      </button>
    </div>
  );
};

const FiltersComponent = ({ filters, onFilterChange, onClear }) => (
  <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 space-y-4">
    <div className="flex items-center text-lg font-bold text-gray-700">
      <Filter className="w-5 h-5 mr-2 text-indigo-500" />
      Booking Filters
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <div className="col-span-1 lg:col-span-2 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by ID or Passenger Name"
          value={filters.search}
          onChange={(e) => onFilterChange("search", e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm"
        />
      </div>
      <select
        value={filters.source}
        onChange={(e) => onFilterChange("source", e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm"
      >
        {SOURCE_OPTIONS.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.name}
          </option>
        ))}
      </select>
      <select
        value={filters.timeWindow}
        onChange={(e) => onFilterChange("timeWindow", e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm"
      >
        {TIME_WINDOWS.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.name}
          </option>
        ))}
      </select>
      <button
        onClick={onClear}
        className="w-full px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition duration-150 text-sm"
      >
        Clear Filters
      </button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
      <label className="text-sm font-medium text-gray-600 flex items-center">
        Start Date:
        <input
          type="date"
          value={filters.startDate}
          onChange={(e) => onFilterChange("startDate", e.target.value)}
          className="ml-2 px-3 py-2 border border-gray-300 rounded-lg text-sm"
        />
      </label>
      <label className="text-sm font-medium text-gray-600 flex items-center">
        End Date:
        <input
          type="date"
          value={filters.endDate}
          onChange={(e) => onFilterChange("endDate", e.target.value)}
          className="ml-2 px-3 py-2 border border-gray-300 rounded-lg text-sm"
        />
      </label>
    </div>
  </div>
);

const BookingsListView = ({
  filteredBookings,
  filters,
  csvData,
  onFilterChange,
  onClear,
  sortConfig,
  requestSort,
  handleViewDetail,
  exportToCSV,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 15;
  const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);

  const paginatedBookings = useMemo(() => {
    const startIndex = (currentPage - 1) * bookingsPerPage;
    return filteredBookings.slice(startIndex, startIndex + bookingsPerPage);
  }, [filteredBookings, currentPage, bookingsPerPage]);

  // resetting pagination on filter/sort change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sortConfig]);

  const TableHeader = ({ columnKey, label }) => {
    const direction =
      sortConfig.key === columnKey ? sortConfig.direction : "none";
    const Icon = direction === "ascending" ? ChevronUp : ChevronDown;

    return (
      <th
        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-800 transition-colors"
        onClick={() => requestSort(columnKey)}
      >
        <div className="flex items-center">
          {label}
          {direction !== "none" && (
            <Icon className="ml-1 w-3 h-3 text-indigo-500" />
          )}
        </div>
      </th>
    );
  };

  const headers = [
    { label: "Booking ID", key: "Booking ID" },
    { label: "Passenger Name", key: "Passenger Name" },
    { label: "Source", key: "Source" },
    { label: "Origin", key: "Origin" },
    { label: "Destination", key: "Destination" },
    { label: "Date", key: "Date" },
    { label: "Time", key: "Time" },
    { label: "Seats", key: "Seats" },
    { label: "Fare", key: "Fare" },
    { label: "Status", key: "Status" },
  ];

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h2 className="text-3xl font-extrabold text-gray-900">Bookings List</h2>
        <CSVLink
          data={csvData}
          headers={headers}
          filename={"bus_bookings_export.csv"}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            csvData.length === 0
              ? "bg-gray-400 text-gray-600 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
          target="_blank"
          onClick={(event) => {
            if (csvData.length === 0) {
              event.preventDefault();
            }
          }}
        >
          Export to CSV ({csvData.length} Records)
        </CSVLink>
      </div>

      <FiltersComponent
        filters={filters}
        onFilterChange={onFilterChange}
        onClear={onClear}
      />
      {/* Bookings List Display */}
      {filteredBookings.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <TableHeader columnKey="id" label="ID" />
                  <TableHeader columnKey="passengerName" label="Passenger" />
                  <TableHeader columnKey="source" label="Source" />
                  <TableHeader columnKey="origin" label="Origin/Dest" />
                  <TableHeader columnKey="date" label="Date" />
                  <TableHeader columnKey="time" label="Time" />
                  <TableHeader columnKey="seats" label="Seats" />
                  <TableHeader columnKey="fare" label="Fare" />
                  <TableHeader columnKey="status" label="Status" />
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedBookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="hover:bg-indigo-50 transition-colors"
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      {booking.id}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                      {booking.passengerName}
                    </td>
                    <td
                      className="px-4 py-3 whitespace-nowrap text-sm font-semibold"
                      style={{ color: COLORS[booking.source] }}
                    >
                      {
                        SOURCE_OPTIONS.find((s) => s.id === booking.source)
                          ?.name
                      }
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                      {booking.origin} → {booking.destination}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                      {formatDate(booking.date)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                      {formatTime(booking.time)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                      {booking.seats}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-emerald-600">
                      {formatCurrency(booking.fare)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <StatusPill status={booking.status} />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleViewDetail(booking)}
                        className="text-indigo-600 hover:text-indigo-900 transition-colors p-1 rounded-md hover:bg-indigo-100"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View */}
          <div className="md:hidden space-y-4">
            {paginatedBookings.map((booking) => (
              <BookingItem
                key={booking.id}
                booking={booking}
                onViewDetail={handleViewDetail}
              />
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalBookings={filteredBookings.length}
            bookingsPerPage={bookingsPerPage}
          />
        </>
      )}
    </div>
  );
};

export default BookingsListView;
