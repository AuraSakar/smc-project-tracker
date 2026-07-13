import { useTranslation } from 'react-i18next';
import './Report.css';

export default function Report() {
  const { t } = useTranslation();

  return (
    <div className="report-page">
        <div className="report-header">
          <h1>{t('Analytics & Reports')}</h1>
          <p className="text-muted">{t('Comprehensive data insights and project reporting')}</p>
        </div>

        <div className="report-empty-state">
          <div className="empty-icon">
            <i className="fas fa-chart-pie"></i>
          </div>
          <h2>{t('Reporting Features Coming Soon')}</h2>
          <p>{t('We are currently building advanced analytics and exportable reports. Check back in a future update.')}</p>
          <button className="btn btn-outline mt-2" disabled>
            <i className="fas fa-download"></i> {t('Export Report (Unavailable)')}
          </button>
        </div>
    </div>
  );
}
