// src/components/list/BookingDetailModal.jsx
import React from 'react';
import { Users, Bus, MapPin, DollarSign, Calendar, Clock, ListChecks, X } from 'lucide-react';
import { formatCurrency, formatDate, formatTime } from '../utils/formatter.jsx';
import { SOURCE_OPTIONS, COLORS } from '../utils/constants.jsx';

const DetailRow = ({ icon: Icon, label, value, color = 'text-gray-700' }) => (
    <div className="flex items-start justify-between">
        <div className="flex items-center space-x-2">
            <Icon className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <span className="font-medium text-gray-600">{label}:</span>
        </div>
        <span className={`text-right font-semibold ${color}`}>{value}</span>
    </div>
);

const BookingDetailModal = ({ booking, onClose }) => {
    if (!booking) return null;

    const sourceDetails = SOURCE_OPTIONS.find(s => s.id === booking.source);
    const sourceName = sourceDetails ? sourceDetails.name : 'Unknown';
    const sourceColor = COLORS[booking.source] || '#6B7280';
    const sourceColorClass = `text-${sourceColor.replace('#', '')}`; // Simplified for Tailwind JIT

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
                        <DetailRow icon={DollarSign} label="Total Fare" value={formatCurrency(booking.fare)} color="text-emerald-600" />
                        <DetailRow icon={Calendar} label="Date" value={formatDate(booking.date)} />
                        <DetailRow icon={Clock} label="Time" value={formatTime(booking.time)} />
                        <DetailRow icon={ListChecks} label="Source" value={sourceName} color={`text-[${sourceColor}]`} />
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

export default BookingDetailModal;