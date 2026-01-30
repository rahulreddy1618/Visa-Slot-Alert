import { useState, useEffect } from 'react';
import { updateAlertStatus, deleteAlert } from '../api';
import './AlertList.css';

const STATUS_CYCLE = ['Active', 'Booked', 'Expired'];

function AlertList({ alerts, onUpdate }) {
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 5;
  const totalPages = Math.max(1, Math.ceil(alerts.length / PAGE_SIZE));
  const paginatedAlerts = alerts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    if (page > totalPages && totalPages > 0) {
      setPage(totalPages);
    }
  }, [alerts.length, page, totalPages]);

  const cycleStatus = async (alert) => {
    const currentIndex = STATUS_CYCLE.indexOf(alert.status);
    const nextIndex = (currentIndex + 1) % STATUS_CYCLE.length;
    const nextStatus = STATUS_CYCLE[nextIndex];

    setUpdatingId(alert.id);
    setError(null);
    try {
      await updateAlertStatus(alert.id, nextStatus);
      onUpdate?.();
    } catch (err) {
      setError(err.message || 'Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    setError(null);
    try {
      await deleteAlert(id);
      onUpdate?.();
      if (page > totalPages - 1 && page > 1) {
        setPage(page - 1);
      }
    } catch (err) {
      setError(err.message || 'Failed to delete alert');
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (iso) => {
    try {
      return new Date(iso).toLocaleString();
    } catch {
      return iso;
    }
  };

  if (alerts.length === 0) {
    return (
      <div className="alert-list">
        <p className="empty-state">No alerts yet. Create one above.</p>
      </div>
    );
  }

  return (
    <div className="alert-list">
      {error && <div className="list-error">{error}</div>}
      <table className="alerts-table">
        <thead>
          <tr>
            <th>Country</th>
            <th>City</th>
            <th>Visa Type</th>
            <th>Status</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedAlerts.map((alert) => (
            <tr key={alert.id}>
              <td>{alert.country}</td>
              <td>{alert.city}</td>
              <td>{alert.visaType}</td>
              <td>
                <span className={`status-badge status-${alert.status.toLowerCase()}`}>
                  {alert.status}
                </span>
              </td>
              <td>{formatDate(alert.createdAt)}</td>
              <td>
                <button
                  className="btn-cycle"
                  onClick={() => cycleStatus(alert)}
                  disabled={updatingId === alert.id}
                  title="Cycle: Active → Booked → Expired"
                >
                  {updatingId === alert.id ? '...' : 'Update Status'}
                </button>
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(alert.id)}
                  disabled={deletingId === alert.id}
                >
                  {deletingId === alert.id ? '...' : 'Delete'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default AlertList;
