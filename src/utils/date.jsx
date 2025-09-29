import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Home, ListChecks, Calendar, Users, IndianRupeeIcon, Search, Filter, ChevronUp, ChevronDown, Download, Clock, MapPin, Bus, X, Menu } from 'lucide-react';

// --- MOCK DATA GENERATION ---

// Helper function to generate a random date and time around the current date
const generateRandomDateTime = (daysAgo = 30) => {
  const now = new Date();
  const date = new Date(now.getTime() - Math.random() * daysAgo * 24 * 60 * 60 * 1000);
  const hour = Math.floor(Math.random() * 24);
  const minute = Math.floor(Math.random() * 60);
  date.setHours(hour, minute, 0, 0);

  const formattedDate = date.toISOString().split('T')[0];
  const formattedTime = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
  const timestamp = date.getTime();

  return { formattedDate, formattedTime, timestamp, hour };
};

const generateMockBookings = (count = 60) => {
  const sources = [
    { id: 'mmt', name: 'MakeMyTrip', color: 'bg-emerald-500' },
    { id: 'goibibo', name: 'Goibibo', color: 'bg-amber-500' },
    { id: 'mybus', name: 'MyBus', color: 'bg-sky-500' },
    { id: 'personal', name: 'Personal Booking', color: 'bg-indigo-500' },
  ];
  const origins = ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Pune'];
  const destinations = ['Jaipur', 'Hyderabad', 'Kolkata', 'Goa', 'Ahmedabad'];
  const statuses = ['Confirmed', 'Cancelled', 'Pending'];

  return Array.from({ length: count }, (_, i) => {
    const { formattedDate, formattedTime, timestamp, hour } = generateRandomDateTime(30);
    const source = sources[Math.floor(Math.random() * sources.length)];
    const origin = origins[Math.floor(Math.random() * origins.length)];
    let destination = destinations[Math.floor(Math.random() * destinations.length)];
    while (destination === origin) {
      destination = destinations[Math.floor(Math.random() * destinations.length)];
    }

    const seats = Math.floor(Math.random() * 5) + 1; // 1 to 5 seats
    const baseFare = Math.floor(Math.random() * (2500 - 500 + 1)) + 500;
    const fare = baseFare * seats;
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    return {
      id: `BKG-${10000 + i}`,
      passengerName: `Traveller ${i + 1}`,
      source: source.id,
      sourceName: source.name,
      sourceColor: source.color,
      origin: origin,
      destination: destination,
      date: formattedDate,
      time: formattedTime,
      timestamp: timestamp,
      seats: seats,
      fare: fare,
      status: status,
      timeHour: hour,
      raw: JSON.stringify({ notes: `Trip from ${origin} to ${destination} booked via ${source.name}.` }),
    };
  });
};

const MOCK_BOOKINGS = generateMockBookings(75);

// --- UTILITIES ---

const formatCurrency = (value) => `$${value.toLocaleString()}`;
const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
const formatTime = (timeString) => {
    const [h, m] = timeString.split(':');
    const hours = parseInt(h, 10);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${m} ${ampm}`;
};

const SOURCE_OPTIONS = [
  { id: 'all', name: 'All Sources' },
  { id: 'mmt', name: 'MakeMyTrip' },
  { id: 'goibibo', name: 'Goibibo' },
  { id: 'mybus', name: 'MyBus' },
  { id: 'personal', name: 'Personal Booking' },
];

const TIME_WINDOWS = [
  { id: 'all', name: 'All Day' },
  { id: 'morning', name: 'Morning (5am - 12pm)', start: 5, end: 12 },
  { id: 'afternoon', name: 'Afternoon (12pm - 5pm)', start: 12, end: 17 },
  { id: 'evening', name: 'Evening (5pm - 9pm)', start: 17, end: 21 },
  { id: 'night', name: 'Night (9pm - 5am)', start: 21, end: 5 },
];

const COLORS = {
  mmt: '#10B981', // Emerald
  goibibo: '#F59E0B', // Amber
  mybus: '#0EA5E9', // Sky
  personal: '#6366F1', // Indigo
};

// --- COMPONENTS ---

// KPI Card Component
const KPICard = ({ title, value, icon: Icon, colorClass }) => (
  <div className="bg-white p-5 rounded-xl shadow-lg flex items-center justify-between transition-all duration-300 hover:shadow-xl border border-gray-100">
    <div className="space-y-1">
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
    <div className="p-3 rounded-full bg-opacity-20" style={{ backgroundColor: colorClass.replace('text-', '').replace('-500', '300') }}>
        <Icon className={`w-6 h-6 ${colorClass}`} aria-hidden="true" />
    </div>
  </div>
);

// Booking Detail Modal
const BookingDetailModal = ({ booking, onClose }) => {
  if (!booking) return null;

  const sourceDetails = SOURCE_OPTIONS.find(s => s.id === booking.source);
  const sourceName = sourceDetails ? sourceDetails.name : 'Unknown';

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl transform transition-all overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4 border-b pb-3">
            <h3 className="text-2xl font-bold text-gray-900">Booking ID: {booking.id}</h3>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition"
              aria-label="Close details"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-4">
            <DetailRow icon={Users} label="Passenger" value={booking.passengerName} />
            <DetailRow icon={Bus} label="Route" value={`${booking.origin} → ${booking.destination}`} />
            <DetailRow icon={MapPin} label="Seats Booked" value={booking.seats} />
            <DetailRow icon={IndianRupeeIcon} label="Total Fare" value={formatCurrency(booking.fare)} color="text-emerald-600" />
            <DetailRow icon={Calendar} label="Date" value={formatDate(booking.date)} />
            <DetailRow icon={Clock} label="Time" value={formatTime(booking.time)} />
            <DetailRow icon={ListChecks} label="Source" value={sourceName} color={`text-${COLORS[booking.source].split('-')[1]}-600`} />
            <DetailRow icon={ListChecks} label="Status" value={booking.status} color={booking.status === 'Confirmed' ? 'text-green-600' : booking.status === 'Cancelled' ? 'text-red-600' : 'text-yellow-600'} />

            <div className="pt-4 border-t mt-4">
                <p className="text-sm font-semibold text-gray-600 mb-1">Raw Data Notes:</p>
                <p className="text-sm text-gray-500 italic break-words">{JSON.parse(booking.raw).notes}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper for Detail Modal
const DetailRow = ({ icon: Icon, label, value, color = 'text-gray-700' }) => (
    <div className="flex items-start justify-between">
        <div className="flex items-center space-x-2">
            <Icon className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <span className="font-medium text-gray-600">{label}:</span>
        </div>
        <span className={`text-right font-semibold ${color}`}>{value}</span>
    </div>
);


// Booking Row/Card Component
const BookingItem = ({ booking, onViewDetail }) => {
  const sourceDetails = SOURCE_OPTIONS.find(s => s.id === booking.source);
  const sourceName = sourceDetails ? sourceDetails.name : 'Unknown';
  const sourceColor = COLORS[booking.source] || '#6B7280'; // Default Gray

  const StatusPill = ({ status }) => {
    let style = 'bg-gray-100 text-gray-800';
    if (status === 'Confirmed') style = 'bg-green-100 text-green-800';
    if (status === 'Cancelled') style = 'bg-red-100 text-red-800';
    if (status === 'Pending') style = 'bg-yellow-100 text-yellow-800';

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style}`}>
        {status}
      </span>
    );
  };

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
          <span>{booking.id} / {booking.passengerName}</span>
        </p>
        <p className="flex justify-between">
          <span className="text-gray-500 font-medium">Source:</span>
          <span className="font-semibold" style={{ color: sourceColor }}>{sourceName}</span>
        </p>
        <p className="flex justify-between">
          <span className="text-gray-500 font-medium">Date/Time:</span>
          <span>{formatDate(booking.date)} at {formatTime(booking.time)}</span>
        </p>
        <p className="flex justify-between">
          <span className="text-gray-500 font-medium">Fare / Seats:</span>
          <span className="font-bold text-emerald-600">{formatCurrency(booking.fare)} / {booking.seats}</span>
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


// Main App Component
const App = () => {
  const [bookings, setBookings] = useState(MOCK_BOOKINGS);
  const [filters, setFilters] = useState({
    source: 'all',
    startDate: '',
    endDate: '',
    timeWindow: 'all',
    search: '',
  });
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard' or 'list'
  const [sortConfig, setSortConfig] = useState({ key: 'timestamp', direction: 'descending' });
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // --- Filtering Logic ---

  const getBookingsToday = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    return bookings.filter(b => b.date === today);
  }, [bookings]);

  const filteredBookings = useMemo(() => {
    let filtered = [...bookings];

    // 1. Source Filter
    if (filters.source !== 'all') {
      filtered = filtered.filter(b => b.source === filters.source);
    }

    // 2. Date Range Filter
    if (filters.startDate) {
      const start = new Date(filters.startDate).getTime();
      filtered = filtered.filter(b => new Date(b.date).getTime() >= start);
    }
    if (filters.endDate) {
      const end = new Date(filters.endDate).getTime();
      filtered = filtered.filter(b => new Date(b.date).getTime() <= end);
    }

    // 3. Time Window Filter
    if (filters.timeWindow !== 'all') {
        const window = TIME_WINDOWS.find(w => w.id === filters.timeWindow);
        if (window) {
            filtered = filtered.filter(b => {
                const hour = b.timeHour;
                if (window.start < window.end) {
                    // Morning, Afternoon, Evening (e.g., 5 to 12)
                    return hour >= window.start && hour < window.end;
                } else {
                    // Night (e.g., 21 to 5) spans midnight
                    return hour >= window.start || hour < window.end;
                }
            });
        }
    }

    // 4. Search Filter (Passenger Name or Booking ID)
    if (filters.search) {
      const query = filters.search.toLowerCase();
      filtered = filtered.filter(b =>
        b.passengerName.toLowerCase().includes(query) ||
        b.id.toLowerCase().includes(query)
      );
    }

    // 5. Sorting
    filtered.sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      // Handle Fare (numeric) and Timestamp (numeric) sorting
      if (typeof aValue === 'number') {
        return sortConfig.direction === 'ascending' ? aValue - bValue : bValue - aValue;
      }
      // Default string comparison for others (e.g., date, name)
      if (aValue < bValue) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });

    return filtered;
  }, [bookings, filters, sortConfig]);

  // --- Filter Handlers ---

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
        source: 'all',
        startDate: '',
        endDate: '',
        timeWindow: 'all',
        search: '',
    });
  };

  // --- Sorting Handler ---

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
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

  // --- Analytics & Aggregation ---

  const analyticsData = useMemo(() => {
    const totalBookings = filteredBookings.length;
    const totalFare = filteredBookings.reduce((sum, b) => sum + b.fare, 0);
    const bookingsTodayCount = getBookingsToday().length;

    // Bookings by Source (Pie Chart Data)
    const sourceMap = filteredBookings.reduce((acc, b) => {
      acc[b.source] = acc[b.source] ? acc[b.source] + 1 : 1;
      return acc;
    }, {});

    const bookingsBySource = Object.keys(sourceMap).map(sourceId => {
      const sourceName = SOURCE_OPTIONS.find(s => s.id === sourceId)?.name || 'Unknown';
      return {
        name: sourceName,
        value: sourceMap[sourceId],
        color: COLORS[sourceId],
      };
    });

    // Daily Trend (Area Chart Data)
    const dailyMap = filteredBookings.reduce((acc, b) => {
      const dateKey = formatDate(b.date);
      acc[dateKey] = acc[dateKey] ? acc[dateKey] + 1 : 1;
      return acc;
    }, {});

    const bookingTrend = Object.keys(dailyMap).map(date => ({
      date: date,
      count: dailyMap[date],
    })).sort((a, b) => new Date(a.date) - new Date(b.date));


    // Time of Day Distribution (Bar Chart Data)
    const timeMap = filteredBookings.reduce((acc, b) => {
        // Group into the predefined windows for simplicity
        let windowId = 'other';
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

    const timeDistribution = TIME_WINDOWS.slice(1).map(window => ({
        name: window.name.split('(')[0].trim(),
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

  // --- Export to CSV ---

  const exportToCSV = () => {
    if (filteredBookings.length === 0) {
        // Use custom modal or notification for error/info, not alert()
        console.warn("No bookings to export.");
        return;
    }

    const headers = [
      "Booking ID", "Passenger Name", "Source", "Origin", "Destination",
      "Date", "Time", "Seats", "Fare", "Status"
    ];
    const csvRows = [];
    csvRows.push(headers.join(','));

    filteredBookings.forEach(b => {
      const row = [
        b.id,
        b.passengerName,
        SOURCE_OPTIONS.find(s => s.id === b.source)?.name || 'Unknown',
        b.origin,
        b.destination,
        formatDate(b.date),
        formatTime(b.time),
        b.seats,
        b.fare,
        b.status,
      ].map(field => {
        // Simple CSV escape for strings containing commas
        return typeof field === 'string' && field.includes(',') ? `"${field}"` : field;
      }).join(',');
      csvRows.push(row);
    });

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'bus_bookings_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  // --- Sub-Components for Views ---

  const Sidebar = () => (
    <div className={`fixed inset-y-0 left-0 w-64 bg-gray-900 text-white transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out z-40 md:z-auto flex flex-col pt-5`}>
      <div className="px-6 text-2xl font-bold mb-8 flex items-center">
        <Bus className="w-6 h-6 mr-2 text-indigo-400" />
        Booking Tracker
      </div>
      <nav className="flex-1 space-y-2 px-4">
        <SidebarItem
          icon={Home}
          label="Dashboard"
          isActive={currentView === 'dashboard'}
          onClick={() => { setCurrentView('dashboard'); setIsSidebarOpen(false); }}
        />
        <SidebarItem
          icon={ListChecks}
          label="Bookings List"
          isActive={currentView === 'list'}
          onClick={() => { setCurrentView('list'); setIsSidebarOpen(false); }}
        />
      </nav>
      <div className="p-4 border-t border-gray-800 text-sm text-gray-500">
        <p>Assignment Demo</p>
      </div>
    </div>
  );

  const SidebarItem = ({ icon: Icon, label, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center p-3 rounded-xl transition-colors duration-200 ${
        isActive
          ? 'bg-indigo-600 text-white shadow-lg'
          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
      }`}
    >
      <Icon className="w-5 h-5 mr-3" />
      <span>{label}</span>
    </button>
  );

  const DashboardView = () => {
    const { totalBookings, totalFare, bookingsTodayCount, bookingsBySource, bookingTrend, timeDistribution } = analyticsData;

    return (
      <div className="space-y-8 p-4 sm:p-6 lg:p-8">
        <h2 className="text-3xl font-extrabold text-gray-900 border-b pb-4">Dashboard Overview</h2>

        {/* --- KPI Section --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <KPICard
            title="Total Bookings (Filtered)"
            value={totalBookings}
            icon={ListChecks}
            colorClass="text-indigo-500"
          />
          <KPICard
            title="Total Fare Value (Filtered)"
            value={`₹ ${totalFare}`}
            icon={IndianRupeeIcon}
            colorClass="text-emerald-500"
          />
          <KPICard
            title="Bookings Today"
            value={bookingsTodayCount}
            icon={Calendar}
            colorClass="text-amber-500"
          />
        </div>

        {/* --- Analytics Charts Section --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Chart 1: Booking Trend */}
          {/* <ChartCard title="Daily Booking Trend">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={bookingTrend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="date" stroke="#6b7280" angle={-15} textAnchor="end" height={50} tick={{ fontSize: 10 }} />
                <YAxis stroke="#6b7280" />
                <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                <Area type="monotone" dataKey="count" stroke="#6366F1" fillOpacity={1} fill="url(#colorCount)" name="Bookings" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard> */}

          {/* Chart 2: Bookings by Source (Pie Chart) */}
          <ChartCard title="Bookings Distribution by Source">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={bookingsBySource}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {bookingsBySource.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                <Legend layout="vertical" verticalAlign="bottom" align="left" wrapperStyle={{ paddingLeft: '20px' }} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Chart 3: Time of Day Distribution */}
          <ChartCard title="Bookings by Time Window (Hourly Heatmap/Histogram)">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={timeDistribution} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                <Legend />
                <Bar dataKey="count" fill="#3B82F6" name="Total Bookings" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

      </div>
    );
  };

  const ChartCard = ({ title, children }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-3">{title}</h3>
      <div className="h-80">
        {children}
      </div>
    </div>
  );

  const BookingsListView = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const bookingsPerPage = 10;
    const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);

    const paginatedBookings = useMemo(() => {
        const startIndex = (currentPage - 1) * bookingsPerPage;
        return filteredBookings.slice(startIndex, startIndex + bookingsPerPage);
    }, [filteredBookings, currentPage, bookingsPerPage]);

    // Reset pagination on filter/sort change
    useEffect(() => {
        setCurrentPage(1);
    }, [filters, sortConfig]);

    const TableHeader = ({ columnKey, label }) => {
        const direction = sortConfig.key === columnKey ? sortConfig.direction : 'none';
        const Icon = direction === 'ascending' ? ChevronUp : ChevronDown;

        return (
            <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-800 transition-colors"
                onClick={() => requestSort(columnKey)}
            >
                <div className="flex items-center">
                    {label}
                    {direction !== 'none' && <Icon className="ml-1 w-3 h-3 text-indigo-500" />}
                </div>
            </th>
        );
    };

    return (
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        <div className="flex justify-between items-center flex-wrap gap-4">
            <h2 className="text-3xl font-extrabold text-gray-900">Bookings List</h2>
            <button
                onClick={exportToCSV}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-150 text-sm"
            >
                <Download className="w-4 h-4 mr-2" />
                Export CSV ({filteredBookings.length})
            </button>
        </div>


        <FiltersComponent filters={filters} onFilterChange={handleFilterChange} onClear={clearFilters} />

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
                  {paginatedBookings.map(booking => (
                    <tr key={booking.id} className="hover:bg-indigo-50 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{booking.id}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{booking.passengerName}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold" style={{ color: COLORS[booking.source] }}>
                        {SOURCE_OPTIONS.find(s => s.id === booking.source)?.name}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                        {booking.origin} → {booking.destination}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{formatDate(booking.date)}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{formatTime(booking.time)}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{booking.seats}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-emerald-600">{formatCurrency(booking.fare)}</td>
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
                {paginatedBookings.map(booking => (
                    <BookingItem key={booking.id} booking={booking} onViewDetail={handleViewDetail} />
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

  const StatusPill = ({ status }) => {
    let style = 'bg-gray-100 text-gray-800';
    if (status === 'Confirmed') style = 'bg-green-100 text-green-800';
    if (status === 'Cancelled') style = 'bg-red-100 text-red-800';
    if (status === 'Pending') style = 'bg-yellow-100 text-yellow-800';

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style}`}>
        {status}
      </span>
    );
  };

  const Pagination = ({ currentPage, totalPages, onPageChange, totalBookings, bookingsPerPage }) => {
      // FIX: Ensure bookingsPerPage is defined for use in display logic.
      if (totalPages <= 1) return null;

      const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

      return (
          <div className="flex justify-between items-center py-4 px-2 sm:px-0">
              <span className="text-sm text-gray-600 hidden sm:block">
                  Showing {Math.min((currentPage - 1) * bookingsPerPage + 1, totalBookings)} to {Math.min(currentPage * bookingsPerPage, totalBookings)} of {totalBookings} results
              </span>
              <nav className="flex items-center space-x-1" aria-label="Pagination">
                  <button
                      onClick={() => onPageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                      Previous
                  </button>
                  {pages.map(page => (
                      <button
                          key={page}
                          onClick={() => onPageChange(page)}
                          className={`p-2 w-10 text-sm rounded-lg font-medium transition-colors ${
                              currentPage === page
                                  ? 'bg-indigo-600 text-white shadow-md'
                                  : 'text-gray-700 bg-white hover:bg-indigo-50'
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
                  </button>
              </nav>
          </div>
      );
  };


  const FiltersComponent = ({ filters, onFilterChange, onClear }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg space-y-4 border border-gray-100">
      <h3 className="text-xl font-semibold text-gray-800 flex items-center mb-4">
          <Filter className="w-5 h-5 mr-2 text-indigo-600" />
          Filter & Search
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Search */}
        <div className="lg:col-span-2">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search ID or Name</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              id="search"
              placeholder="Search booking ID or passenger..."
              value={filters.search}
              onChange={(e) => onFilterChange('search', e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
          </div>
        </div>

        {/* Source Filter */}
        <div>
          <label htmlFor="source" className="block text-sm font-medium text-gray-700 mb-1">Source</label>
          <select
            id="source"
            value={filters.source}
            onChange={(e) => onFilterChange('source', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 bg-white rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition"
          >
            {SOURCE_OPTIONS.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        {/* Time Window Filter */}
        <div>
          <label htmlFor="timeWindow" className="block text-sm font-medium text-gray-700 mb-1">Time Window</label>
          <select
            id="timeWindow"
            value={filters.timeWindow}
            onChange={(e) => onFilterChange('timeWindow', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 bg-white rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition"
          >
            {TIME_WINDOWS.map(w => (
              <option key={w.id} value={w.id}>{w.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-2 border-t border-gray-100">
        {/* Start Date */}
        <div className="lg:col-span-2">
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
                type="date"
                id="startDate"
                value={filters.startDate}
                onChange={(e) => onFilterChange('startDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
        </div>

        {/* End Date */}
        <div className="lg:col-span-2">
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
                type="date"
                id="endDate"
                value={filters.endDate}
                onChange={(e) => onFilterChange('endDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
        </div>

        {/* Clear Button */}
        <div className="self-end pt-4">
            <button
                onClick={onClear}
                className="w-full px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg shadow-sm hover:bg-gray-100 transition duration-150 text-sm"
            >
                Clear Filters
            </button>
        </div>
      </div>
    </div>
  );

  const EmptyState = () => (
    <div className="text-center p-12 bg-white rounded-xl shadow-lg border border-gray-100 mt-8">
      <X className="w-12 h-12 text-red-400 mx-auto" />
      <h3 className="mt-2 text-xl font-semibold text-gray-900">No Bookings Found</h3>
      <p className="mt-1 text-gray-500">Adjust your filters or search terms and try again.</p>
    </div>
  );

  // --- Main Render ---

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar - Desktop and Mobile Menu */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header (Top Nav) for Mobile Menu Toggle */}
        <header className="md:hidden sticky top-0 bg-white shadow-md p-4 flex items-center justify-between z-30">
            <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="text-gray-600 hover:text-gray-900"
                aria-label="Toggle navigation menu"
            >
                <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">Bus Tracker</h1>
        </header>

        {/* Overlay for mobile sidebar */}
        {isSidebarOpen && (
            <div
                className="fixed inset-0 bg-gray-900 bg-opacity-50 z-30 md:hidden"
                onClick={() => setIsSidebarOpen(false)}
            ></div>
        )}

        {/* View Rendering */}
        <main className="flex-1 overflow-y-auto">
          {currentView === 'dashboard' ? <DashboardView /> : <BookingsListView />}
        </main>

        {/* Booking Detail Modal */}
        <BookingDetailModal booking={selectedBooking} onClose={handleCloseDetail} />
      </div>
    </div>
  );
};

export default App;
