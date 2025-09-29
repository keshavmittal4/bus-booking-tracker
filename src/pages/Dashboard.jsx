import { AreaChart, Area, BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { ListChecks, DollarSign, Calendar, IndianRupeeIcon } from 'lucide-react';
import KPICard from '../components/KPICard.jsx';
import { formatCurrency } from '../utils/formatter.jsx';
import { COLORS } from '../utils/constants.jsx';

const ChartCard = ({ title, children }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-3">{title}</h3>
        <div className="h-80">
            {children}
        </div>
    </div>
);

const DashboardView = ({ analyticsData }) => {
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
                    value={formatCurrency(totalFare)}
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
                <ChartCard title="Daily Booking Trend">
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
                </ChartCard>

                {/* Chart 2: Bookings by Source (Pie Chart) */}
                <ChartCard title="Bookings Distribution by Source">
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart className=''>
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
                            {/* <Legend layout="vertical" verticalAlign="bottom" align="left" wrapperStyle={{ paddingLeft: '10px' }} /> */}
                        </PieChart>
                    </ResponsiveContainer>
                </ChartCard>

                {/* Chart 3: Time of Day Distribution */}
                <ChartCard title="Bookings by Time Window">
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

export default DashboardView;