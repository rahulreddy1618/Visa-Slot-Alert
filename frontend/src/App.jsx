import { useState, useEffect, useCallback } from 'react';
import AlertForm from './components/AlertForm';
import AlertList from './components/AlertList';
import { getAlerts } from './api';
import './App.css';

function App() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});

  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAlerts(filters);
      setAlerts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load alerts');
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  }, [filters.country, filters.status]);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value || undefined,
    }));
  };

  return (
    <div className="app">
      <header>
        <h1>Visa Slot Alerts Tracker</h1>
        <p className="subtitle">Track and manage your visa appointment alerts</p>
      </header>

      <AlertForm onSuccess={fetchAlerts} />

      <section className="filters">
        <h3>Filters</h3>
        <div className="filter-row">
          <input
            type="text"
            placeholder="Filter by country"
            value={filters.country || ''}
            onChange={(e) => handleFilterChange('country', e.target.value)}
          />
          <select
            value={filters.status || ''}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="">All statuses</option>
            <option value="Active">Active</option>
            <option value="Booked">Booked</option>
            <option value="Expired">Expired</option>
          </select>
        </div>
      </section>

      {error && <div className="error-banner">{error}</div>}
      {loading ? (
        <p className="loading">Loading alerts...</p>
      ) : (
        <AlertList alerts={alerts} onUpdate={fetchAlerts} />
      )}
    </div>
  );
}

export default App;
