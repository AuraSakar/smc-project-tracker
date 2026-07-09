import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  return (
    <span className="status-badge" style={{ backgroundColor: statusColors[status] || '#555' }}>
      {t(status)}
    </span>
  );
}