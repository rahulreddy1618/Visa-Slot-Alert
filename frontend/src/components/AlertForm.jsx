import { useState } from 'react';
import { createAlert } from '../api';
import './AlertForm.css';

const VISA_TYPES = ['Tourist', 'Business', 'Student'];

function AlertForm({ onSuccess }) {
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [visaType, setVisaType] = useState('Tourist');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const trimmedCountry = country.trim();
    const trimmedCity = city.trim();

    if (!trimmedCountry) {
      setError('Country is required');
      return;
    }
    if (!trimmedCity) {
      setError('City is required');
      return;
    }

    setSubmitting(true);
    try {
      await createAlert({
        country: trimmedCountry,
        city: trimmedCity,
        visaType,
      });
      setCountry('');
      setCity('');
      setVisaType('Tourist');
      onSuccess?.();
    } catch (err) {
      setError(err.message || 'Failed to create alert');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="alert-form" onSubmit={handleSubmit}>
      <h3>Create New Alert</h3>
      {error && <div className="form-error">{error}</div>}
      <div className="form-row">
        <label>
          Country
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="e.g. USA"
            disabled={submitting}
          />
        </label>
        <label>
          City
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="e.g. New York"
            disabled={submitting}
          />
        </label>
        <label>
          Visa Type
          <select
            value={visaType}
            onChange={(e) => setVisaType(e.target.value)}
            disabled={submitting}
          >
            {VISA_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
      </div>
      <button type="submit" disabled={submitting}>
        {submitting ? 'Creating...' : 'Create Alert'}
      </button>
    </form>
  );
}

export default AlertForm;
