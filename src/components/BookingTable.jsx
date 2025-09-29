const BookingTable = ({ bookings, navigate }) => {
  const [sortKey, setSortKey] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');

  const sortedBookings = useMemo(() => {
    // Note: 'date' is the only key that doesn't match the header names exactly (Date)
    // We adjust the sort logic to handle this if needed, but for string fields like 'guest' or 'source'
    // we convert the header name (e.g., 'Guest') to the object key (e.g., 'guest').
    const keyMap = {
      'id': 'id',
      'guest': 'guest',
      'date': 'date',
      'amount': 'amount',
      'status': 'status',
      'source': 'source',
      'roomtype': 'roomType'
    };
    const actualKey = keyMap[sortKey] || sortKey;

    return [...bookings].sort((a, b) => {
      let valA = a[actualKey];
      let valB = b[actualKey];

      if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [bookings, sortKey, sortDirection]);

  const handleSort = (header) => {
    const key = header.toLowerCase().replace(/ /g, ''); // Convert 'Room Type' to 'roomtype'
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const SortIcon = ({ keyName }) => {
    // Note: keyName should be the normalized key (e.g., 'roomtype')
    if (sortKey !== keyName) return <List className="w-3 h-3 text-gray-400 opacity-50" />;
    return sortDirection === 'asc'
      ? <ChevronUp className="w-3 h-3 text-gray-600" />
      : <ChevronDown className="w-3 h-3 text-gray-600" />;
  };

  const getStatusClasses = (status) => {
    switch (status) {
      case 'Confirmed': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const headerMappings = [
    { label: 'ID', key: 'id' },
    { label: 'Guest', key: 'guest' },
    { label: 'Date', key: 'date' },
    { label: 'Amount', key: 'amount' },
    { label: 'Status', key: 'status' },
    { label: 'Source', key: 'source' },
    { label: 'Room Type', key: 'roomtype' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {headerMappings.map(header => (
                <th
                  key={header.key}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition"
                  onClick={() => handleSort(header.label)}
                >
                  <div className="flex items-center">
                    {header.label}
                    <SortIcon keyName={header.key} />
                  </div>
                </th>
              ))}
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedBookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-gray-50 transition duration-150">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{booking.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.guest}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(booking.date)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-indigo-600">
                  {formatCurrency(booking.amount)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(booking.status)}`}>
                    {booking.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.source}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.roomType}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => navigate(`/bookings/${booking.id}`)} // Use path format
                    className="text-indigo-600 hover:text-indigo-900 transition"
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))}
            {sortedBookings.length === 0 && (
                <tr>
                    <td colSpan="8" className="px-6 py-10 text-center text-gray-500 text-lg">
                        No bookings found matching the current criteria.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};