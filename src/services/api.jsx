const mockBookings = [
  { id: 'B001', guest: 'Alice Johnson', date: '2024-11-15', status: 'Confirmed', amount: 450.00, source: 'Website', roomType: 'Deluxe' },
  { id: 'B002', guest: 'Bob Smith', date: '2024-11-14', status: 'Pending', amount: 320.00, source: 'Booking.com', roomType: 'Standard' },
  { id: 'B003', guest: 'Charlie Brown', date: '2024-11-13', status: 'Confirmed', amount: 780.00, source: 'Expedia', roomType: 'Suite' },
  { id: 'B004', guest: 'Diana Prince', date: '2024-11-13', status: 'Cancelled', amount: 150.00, source: 'Website', roomType: 'Standard' },
  { id: 'B005', guest: 'Clark Kent', date: '2024-11-12', status: 'Confirmed', amount: 590.00, source: 'Booking.com', roomType: 'Deluxe' },
  { id: 'B006', guest: 'Lois Lane', date: '2024-11-11', status: 'Confirmed', amount: 280.00, source: 'Website', roomType: 'Standard' },
];

/**
 * Mock API calls to simulate network requests with a brief delay.
 * @param {string} endpoint The endpoint to simulate fetching.
 * @param {number} delay Delay in ms.
 * @returns {Promise<any>}
 */
const mockFetch = (endpoint, delay = 500) => new Promise(resolve => {
  setTimeout(() => {
    switch (endpoint) {
      case 'bookings':
        resolve(mockBookings);
        break;
      case 'kpi':
        resolve({
          totalRevenue: mockBookings.filter(b => b.status === 'Confirmed').reduce((sum, b) => sum + b.amount, 0),
          confirmedBookings: mockBookings.filter(b => b.status === 'Confirmed').length,
          avgBookingValue: 450.50,
          occupancyRate: 85,
        });
        break;
      default:
        // Detail fetch
        if (endpoint.startsWith('booking/')) {
          const id = endpoint.split('/')[1];
          const booking = mockBookings.find(b => b.id === id);
          resolve(booking || null);
        } else {
          resolve([]);
        }
    }
  }, delay);
});