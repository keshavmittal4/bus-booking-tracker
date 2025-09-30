This is a single-page application (SPA) built with React and Tailwind CSS designed to display booking data, offering powerful filtering, sorting, and dashboard analytics for data visualization and operational insights.

🚀 Project Setup
Follow these steps to get the project running on your local machine.

Prerequisites
Node.js (LTS version recommended)

npm

Installation
Clone the Repository:


git clone (https://github.com/keshavmittal4/bus-booking-tracker)


cd bus-booking-tracker


Install Dependencies:
This project uses standard React dependencies, plus Recharts for charts, Tailwind CSS for styling, and react-csv for data export.



npm install


Note: If you encounter a Could not resolve "prop-types" error, run npm install prop-types to resolve the dependency required by react-csv.

Run the Development Server:
The project uses Vite as the build tool.


npm run dev


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


Here are some Screenshots:

<img width="1897" height="850" alt="image" src="https://github.com/user-attachments/assets/2cad8376-8a6b-456d-ac1f-71712aa074eb" />

<img width="1869" height="845" alt="image" src="https://github.com/user-attachments/assets/98ce4116-21ec-4e58-9a06-9cfdcd01551a" />

<img width="1912" height="754" alt="image" src="https://github.com/user-attachments/assets/04c6cb47-0122-40f9-b7b9-34a7ed1ba230" />




Responsive Design: While the layout is built with Tailwind CSS, the chart legends are conditionally rendered using a custom useIsMobile hook to ensure the pagination and charts do not overflow on small mobile screens.
