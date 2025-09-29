const KPICard = ({ title, value, icon: Icon, colorClass }) => (
    <div className="bg-white p-5 rounded-xl shadow-lg flex items-center justify-between transition-all duration-300 hover:shadow-xl border border-gray-100">
        <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className="p-3 rounded-full bg-opacity-20" style={{ backgroundColor: colorClass.replace('text-', '').replace('-500', '300') }}>
            <Icon className={`w-6 h-6 ${colorClass}`} aria-hidden="true" />
        </div>
    </div>
);

export default KPICard;