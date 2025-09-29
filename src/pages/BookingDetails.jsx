const BookingDetailPage = ({ bookingId, navigate }) => {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        // Fetch detail using the ID extracted by the simulated router
        const detail = await mockFetch(`booking/${bookingId}`);
        setBooking(detail);
      } catch (error) {
        console.error("Failed to fetch booking detail:", error);
        setBooking(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [bookingId]);

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500">
        Loading booking details for {bookingId}...
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="p-8 space-y-6">
        <h2 className="text-3xl font-bold text-red-600">Booking Not Found</h2>
        <p className="text-gray-600">
          The booking with ID **{bookingId}** could not be found.
        </p>
        <button
          onClick={() => navigate('/bookings')} // navigate to the /bookings path
          className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
        >
          &larr; Back to Bookings
        </button>
      </div>
    );
  }

  const getStatusClasses = (status) => {
    switch (status) {
      case 'Confirmed': return 'bg-green-100 text-green-800 border-green-300';
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Cancelled': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const DetailRow = ({ label, value }) => (
    <div className="flex justify-between py-3 border-b border-gray-100 last:border-b-0">
      <span className="text-gray-500 font-medium">{label}</span>
      <span className="text-gray-800 font-semibold">{value}</span>
    </div>
  );

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800">Booking Detail: {booking.id}</h2>
        <button
          onClick={() => navigate('/bookings')} // navigate to the /bookings path
          className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center transition"
        >
          <ChevronUp className="w-4 h-4 mr-1 transform rotate-90" />
          Back to Bookings
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6 pb-4 border-b">
          <h3 className="text-2xl font-extrabold text-indigo-600">{booking.guest}</h3>
          <span className={`px-4 py-1 text-sm font-bold rounded-xl border-2 ${getStatusClasses(booking.status)}`}>
            {booking.status}
          </span>
        </div>

        <DetailRow label="Check-in Date" value={formatDate(booking.date)} />
        <DetailRow label="Room Type" value={booking.roomType} />
        <DetailRow label="Booking Source" value={booking.source} />
        <DetailRow label="Total Amount" value={formatCurrency(booking.amount)} />
        <DetailRow label="Payment Status" value={booking.status === 'Confirmed' ? 'Paid' : 'Unpaid/Pending'} />

        <div className="mt-6 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            Guest Email: <a href="mailto:">{booking.guest.toLowerCase().replace(' ', '.')}@example.com</a>
          </p>
        </div>
      </div>
    </div>
  );
};