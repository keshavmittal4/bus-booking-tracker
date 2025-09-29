This is a single-page application (SPA) built with React and Tailwind CSS designed to display booking data, offering powerful filtering, sorting, and dashboard analytics for data visualization and operational insights.

🚀 Project Setup
Follow these steps to get the project running on your local machine.

Prerequisites
Node.js (LTS version recommended)

npm or yarn

Installation
Clone the Repository:

Bash

git clone (https://github.com/keshavmittal4/bus-booking-tracker)
cd bus-booking-tracker
Install Dependencies:
This project uses standard React dependencies, plus Recharts for charts, Tailwind CSS for styling, and react-csv for data export.

Bash

npm install
# or
yarn install
Note: If you encounter a Could not resolve "prop-types" error, run npm install prop-types to resolve the dependency required by react-csv.

Run the Development Server:
The project uses Vite as the build tool.

Bash

npm run dev
# or
yarn dev
Access the Application:
Open your browser to the address shown in the terminal (usually http://localhost:5173).

🧩 Project Structure and Key Decisions
The application is structured to promote separation of concerns, performance optimization, and maintainability.

Central State Management (src/App.jsx)
The entire application state (bookings, filters, current view, sorting) is managed in App.jsx.

State/Logic	Purpose	Decision Rationale
useState	Manages all UI states (filters, view, modal, sidebar).	Simple, fast state management for an application of this size.
useMemo(filteredBookings)	Caches the result of all filtering and sorting operations.	Performance: Ensures the expensive filtering and sorting logic only runs when the raw data (bookings), filters, or sortConfig actually change.
useMemo(analyticsData)	Calculates all KPI metrics and chart data (e.g., total fare, bookings by source).	Performance: Recalculates dashboard metrics only when the filteredBookings list changes, preventing redundant calculations.
useCallback	Used for handler functions (e.g., handleFilterChange).	Stability & Performance: Ensures functions passed to child components do not change identity on every render, preventing unnecessary re-renders.

Export to Sheets
Styling & Components
Tailwind CSS: Used for utility-first styling, enabling rapid, responsive UI development.

Data Visualization: Recharts is used for rendering analytical graphs on the dashboard.

Data Export: The <CSVLink> component from react-csv is used to handle data preparation and download initiation, replacing complex manual DOM manipulation.

🚧 Limitations
This project is a high-performance front-end dashboard prototype and has the following intentional limitations:

Static Data Source: The booking data (src/mockData.js) is static and loaded locally. There is no API integration for fetching real-time data.

Client-Side Processing: All filtering, sorting, and data aggregation is performed entirely on the client-side (in App.jsx). This approach is suitable for smaller datasets but is not scalable for massive data volumes.

Date Logic: The logic for determining "Today's Bookings" relies on the user's local system time zone, which is a common source of inconsistency if the application were hosted globally without proper server-side UTC date handling.

No Type Checking: The project uses plain JavaScript/React with manual prop checks, rather than a strongly typed solution like TypeScript.

Responsive Design: While the layout is built with Tailwind CSS, the chart legends are conditionally rendered using a custom useIsMobile hook to ensure the pagination and charts do not overflow on small mobile screens.
