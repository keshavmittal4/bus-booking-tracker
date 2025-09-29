// src/utils/constants.js

export const SOURCE_OPTIONS = [
    { id: 'all', name: 'All Sources' },
    { id: 'mmt', name: 'MakeMyTrip' },
    { id: 'goibibo', name: 'Goibibo' },
    { id: 'mybus', name: 'MyBus' },
    { id: 'personal', name: 'Personal Booking' },
];

export const TIME_WINDOWS = [
    { id: 'all', name: 'All Day' },
    { id: 'morning', name: 'Morning (5am - 12pm)', start: 5, end: 12 },
    { id: 'afternoon', name: 'Afternoon (12pm - 5pm)', start: 12, end: 17 },
    { id: 'evening', name: 'Evening (5pm - 9pm)', start: 17, end: 21 },
    { id: 'night', name: 'Night (9pm - 5am)', start: 21, end: 5 },
];

export const COLORS = {
    mmt: '#10B981', // Emerald
    goibibo: '#F59E0B', // Amber
    mybus: '#0EA5E9', // Sky
    personal: '#6366F1', // Indigo
};