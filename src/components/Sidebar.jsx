import React from "react";

const Sidebar = () => {
  const Sidebar = () => (
    <div
      className={`fixed inset-y-0 left-0 w-64 bg-gray-900 text-white transform ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } md:relative md:translate-x-0 transition-transform duration-300 ease-in-out z-40 md:z-auto flex flex-col pt-5`}
    >
      <div className="px-6 text-2xl font-bold mb-8 flex items-center">
        <Bus className="w-6 h-6 mr-2 text-indigo-400" />
        Booking Tracker
      </div>
      <nav className="flex-1 space-y-2 px-4">
        <SidebarItem
          icon={Home}
          label="Dashboard"
          isActive={currentView === "dashboard"}
          onClick={() => {
            setCurrentView("dashboard");
            setIsSidebarOpen(false);
          }}
        />
        <SidebarItem
          icon={ListChecks}
          label="Bookings List"
          isActive={currentView === "list"}
          onClick={() => {
            setCurrentView("list");
            setIsSidebarOpen(false);
          }}
        />
      </nav>
      <div className="p-4 border-t border-gray-800 text-sm text-gray-500">
        <p>Assignment Demo</p>
      </div>
    </div>
  );

  const SidebarItem = ({ icon: Icon, label, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center p-3 rounded-xl transition-colors duration-200 ${
        isActive
          ? "bg-indigo-600 text-white shadow-lg"
          : "text-gray-300 hover:bg-gray-800 hover:text-white"
      }`}
    >
      <Icon className="w-5 h-5 mr-3" />
      <span>{label}</span>
    </button>
  );
};

export default Sidebar;
