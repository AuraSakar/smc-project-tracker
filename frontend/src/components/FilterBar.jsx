import { useTranslation } from 'react-i18next';

const categories = ['All', 'Road', 'Water Supply', 'Drainage', 'Park/Garden', 'Building', 'Electricity', 'Other'];
const statuses = ['All', 'Planned', 'Tender Issued', 'In Progress', 'On Hold', 'Completed', 'Cancelled'];
const wards = ['All', ...Array.from({ length: 48 }, (_, i) => `Ward No. ${i + 1}`), 'City-wide'];

export default function FilterBar({ filters, onFilterChange }) {
  const { t } = useTranslation();
  return (
    <div className="filter-bar">
      <div className="filter-group">
        <label>{t('Category')}</label>
        <select value={filters.category} onChange={(e) => onFilterChange('category', e.target.value)}>
          {categories.map((c) => <option key={c} value={c === 'All' ? '' : c}>{c === 'All' ? t('All Categories') : t(c)}</option>)}
        </select>
      </div>
      <div className="filter-group">
        <label>{t('Status')}</label>
        <select value={filters.status} onChange={(e) => onFilterChange('status', e.target.value)}>
          {statuses.map((s) => <option key={s} value={s === 'All' ? '' : s}>{s === 'All' ? t('All Statuses') : t(s)}</option>)}
        </select>
      </div>
      <div className="filter-group">
        <label>{t('Ward')}</label>
        <select value={filters.ward} onChange={(e) => onFilterChange('ward', e.target.value)}>
          {wards.map((w) => <option key={w} value={w === 'All' ? '' : w}>{w === 'All' ? t('All Wards') : w}</option>)}
        </select>
      </div>
    </div>
  );
}