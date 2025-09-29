export const formatCurrency = (value) => `${value.toLocaleString()}`;

export const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export const formatTime = (timeString) => {
    if (!timeString) return '';
    const [h, m] = timeString.split(':');
    const hours = parseInt(h, 10);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${m} ${ampm}`;
};

export const StatusPill = ({ status }) => {
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