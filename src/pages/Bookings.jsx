const BookingsPage = ({ data, loading, navigate }) => {
  const [filters, setFilters] = useState({
    searchTerm: '',
    status: '',
    source: '',
  });

  const filteredBookings = useMemo(() => {
    let list = data.bookings;
    const { searchTerm, status, source } = filters;

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      list = list.filter(b =>
        b.guest.toLowerCase().includes(searchLower) ||
        b.id.toLowerCase().includes(searchLower)
      );
    }

    if (status) {
      list = list.filter(b => b.status === status);
    }

    if (source) {
      list = list.filter(b => b.source === source);
    }

    return list;
  }, [data.bookings, filters]);

  return (
    <div className="p-8 space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">All Bookings</h2>
      {loading ? (
         <div className="text-center text-gray-500 py-12">Loading Bookings...</div>
      ) : (
        <>
          <Filters filters={filters} setFilters={setFilters} onSearch={() => {/* Filter is reactive */}} />
          <BookingTable bookings={filteredBookings} navigate={navigate} />
        </>
      )}
    </div>
  );
};