import './StatusBadge.css';

const statusColors = {
  'Planned': '#f5a623',
  'Tender Issued': '#1a3c6e',
  'In Progress': '#2e7d32',
  'On Hold': '#f5a623',
  'Completed': '#2e7d32',
  'Cancelled': '#c0392b',
};

export default function StatusBadge({ status }) {
  return (
    <span className="status-badge" style={{ backgroundColor: statusColors[status] || '#555' }}>
      {status}
    </span>
  );
}