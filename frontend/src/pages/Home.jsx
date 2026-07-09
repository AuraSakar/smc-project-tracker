import { useState, useEffect } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';
import ProjectCard from '../components/ProjectCard';
import FilterBar from '../components/FilterBar';
import { formatINR } from '../utils/format';
import './Home.css';

export default function Home() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, inProgress: 0, totalBudget: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const location = useLocation();
  const isHome = location.pathname === '/';

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    status: searchParams.get('status') || '',
    ward: searchParams.get('ward') || '',
  });

  useEffect(() => {
    setFilters({
      category: searchParams.get('category') || '',
      status: searchParams.get('status') || '',
      ward: searchParams.get('ward') || '',
    });
    setSearch(searchParams.get('search') || '');
  }, [searchParams]);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      setLoading(true);
      try {
        const params = { page, limit: 9 };
        if (filters.category) params.category = filters.category;
        if (filters.status) params.status = filters.status;
        if (filters.ward) params.ward = filters.ward;
        if (search) params.search = search;
        const [projectsRes, statsRes] = await Promise.all([
          api.get('/projects', { params }),
          api.get('/projects', { params: { limit: 100 } }),
        ]);
        if (cancelled) return;
        setProjects(projectsRes.data.projects);
        setTotalPages(projectsRes.data.totalPages);
        const allProjects = statsRes.data.projects;
        setStats({
          total: statsRes.data.total,
          completed: allProjects.filter((p) => p.status === 'Completed').length,
          inProgress: allProjects.filter((p) => p.status === 'In Progress').length,
          totalBudget: allProjects.reduce((sum, p) => sum + p.estimatedCost, 0),
        });
      } catch (err) {
        if (!cancelled) console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();
    window.scrollTo(0, 0);

    return () => { cancelled = true; };
  }, [page, filters, search]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    setSearchParams(params);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
  };

  return (
    <div>
      {isHome && (
        <>
          <section className="hero">
            <div className="container hero-content">
              <h1>{t('Solapur Municipal Corporation')} {t('Project Tracker')}</h1>
              <h2>प्रकल्प माहिती पोर्टल</h2>
              <p>{t('Hero Description')}</p>
              <form onSubmit={handleSearch} className="hero-search">
                <i className="fas fa-search search-icon"></i>
                <input
                  type="text"
                  placeholder={t('Search Placeholder')}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button type="submit" className="btn btn-primary">{t('Search')}</button>
              </form>
            </div>
          </section>

          <section className="stats-row container">
            <div className="stat-card"><span className="stat-number">{stats.total}</span><span className="stat-label">{t('Total Projects')}</span></div>
            <div className="stat-card"><span className="stat-number">{stats.completed}</span><span className="stat-label">{t('Completed')}</span></div>
            <div className="stat-card"><span className="stat-number">{stats.inProgress}</span><span className="stat-label">{t('In Progress')}</span></div>
            <div className="stat-card"><span className="stat-number">{formatINR(stats.totalBudget)}</span><span className="stat-label">{t('Total Budget (Cr)')}</span></div>
          </section>
        </>
      )}

      <section className="container">
        <FilterBar filters={filters} onFilterChange={handleFilterChange} />
      </section>

      <section className="container page-wrapper">
        {loading ? (
          <p className="text-center">Loading projects...</p>
        ) : projects.length === 0 ? (
          <p className="text-center text-muted">{t('No projects found')}</p>
        ) : (
          <>
            <div className="grid-3">
              {projects.map((p) => <ProjectCard key={p._id} project={p} />)}
            </div>
            {totalPages > 1 && (
              <div className="pagination">
                <button disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button key={i + 1} className={page === i + 1 ? 'active' : ''} onClick={() => setPage(i + 1)}>{i + 1}</button>
                ))}
                <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}