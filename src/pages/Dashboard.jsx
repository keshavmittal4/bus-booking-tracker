const DashboardPage = ({ data, loading, navigate }) => {
  const { bookings, kpi } = data;

  // Recent bookings: last 4 confirmed bookings
  const recentBookings = useMemo(() =>
    bookings
      .filter(b => b.status === 'Confirmed')
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 4),
    [bookings]
  );

  return (
    <div className="p-8 space-y-8">
      <h2 className="text-3xl font-bold text-gray-800">Overview</h2>

      {loading ? (
        <div className="text-center text-gray-500 py-12">Loading Key Metrics...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPI
            title="Total Revenue"
            value={formatCurrency(kpi.totalRevenue || 0)}
            icon={DollarSign}
            color="bg-green-500"
          />
          <KPI
            title="Confirmed Bookings"
            value={kpi.confirmedBookings || 0}
            icon={Calendar}
            color="bg-indigo-500"
          />
          <KPI
            title="Avg. Booking Value"
            value={formatCurrency(kpi.avgBookingValue || 0)}
            icon={Users}
            color="bg-yellow-500"
          />
          <KPI
            title="Occupancy Rate"
            value={`${kpi.occupancyRate || 0}%`}
            icon={BarChart2}
            color="bg-red-500"
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartBookingsBySource bookings={bookings} />
        </div>
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Recent Confirmed Bookings</h3>
          <div className="space-y-4">
            {recentBookings.map(booking => (
              <BookingCard
                key={booking.id}
                booking={booking}
                navigate={navigate} // Use navigate
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};