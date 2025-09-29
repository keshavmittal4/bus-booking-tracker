const useGlobalState = () => {
  // Renamed 'currentPage' to 'path' to simulate router state
  const [path, setPath] = useState('/dashboard'); 
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ bookings: [], kpi: {} });

  // Mimics useNavigate hook
  const navigate = useCallback((newPath) => {
    setPath(newPath);
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const bookings = await mockFetch('bookings');
      const kpi = await mockFetch('kpi');
      setData({ bookings, kpi });
    } catch (error) {
      console.error("Failed to load initial data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    path, // Current path
    navigate, // Function to change path
    loading,
    data,
    loadData,
  };
};