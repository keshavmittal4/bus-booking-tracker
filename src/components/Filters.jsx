const Filters = ({ filters, setFilters, onSearch }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex flex-wrap gap-4 p-4 bg-white rounded-xl shadow-md mb-6">
      <div className="relative flex-grow max-w-sm">
        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
        <input
          type="text"
          name="searchTerm"
          placeholder="Search by Guest Name or ID..."
          value={filters.searchTerm}
          onChange={handleInputChange}
          onKeyDown={(e) => e.key === 'Enter' && onSearch()}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
        />
      </div>

      <div className="flex items-center space-x-4">
        <Filter className="w-5 h-5 text-gray-500" />

        <select
          name="status"
          value={filters.status}
          onChange={handleInputChange}
          className="p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm"
        >
          <option value="">All Statuses</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Pending">Pending</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        <select
          name="source"
          value={filters.source}
          onChange={handleInputChange}
          className="p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm"
        >
          <option value="">All Sources</option>
          <option value="Website">Website</option>
          <option value="Booking.com">Booking.com</option>
          <option value="Expedia">Expedia</option>
        </select>
      </div>
    </div>
  );
}; 
