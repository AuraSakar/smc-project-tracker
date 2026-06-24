import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import ProjectCard from '../components/ProjectCard';
import FilterBar from '../components/FilterBar';
import { formatINR } from '../utils/format';
import './Home.css';

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, inProgress: 0, totalBudget: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    status: searchParams.get('status') || '',
    ward: searchParams.get('ward') || '',
  });

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 9 };
      if (filters.category) params.category = filters.category;
      if (filters.status) params.status = filters.status;
      if (filters.ward) params.ward = filters.ward;
      if (search) params.search = search;
      const res = await api.get('/projects', { params });
      setProjects(res.data.projects);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const all = await api.get('/projects', { params: { limit: 100 } });
      const allProjects = all.data.projects;
      setStats({
        total: all.data.total,
        completed: allProjects.filter((p) => p.status === 'Completed').length,
        inProgress: allProjects.filter((p) => p.status === 'In Progress').length,
        totalBudget: allProjects.reduce((sum, p) => sum + p.estimatedCost, 0),
      });
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchProjects();
    fetchStats();
    window.scrollTo(0, 0);
  }, [page, filters]);

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
    fetchProjects();
  };

  return (
    <div>
      <section className="hero">
        <div className="container hero-content">
          <h1>SMC Project Tracker</h1>
          <h2>प्रकल्प माहिती पोर्टल</h2>
          <p>Track all civic development projects of Solapur Municipal Corporation — roads, water supply, drainage, parks, and more.</p>
          <form onSubmit={handleSearch} className="hero-search">
            <i className="fas fa-search search-icon"></i>
            <input
              type="text"
              placeholder="Search projects by name, ward, or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">Search</button>
          </form>
        </div>
      </section>

      <section className="stats-row container">
        <div className="stat-card"><span className="stat-number">{stats.total}</span><span className="stat-label">Total Projects</span></div>
        <div className="stat-card"><span className="stat-number">{stats.completed}</span><span className="stat-label">Completed</span></div>
        <div className="stat-card"><span className="stat-number">{stats.inProgress}</span><span className="stat-label">In Progress</span></div>
        <div className="stat-card"><span className="stat-number">{formatINR(stats.totalBudget)}</span><span className="stat-label">Total Budget</span></div>
      </section>

      <section className="container">
        <FilterBar filters={filters} onFilterChange={handleFilterChange} />
      </section>

      <section className="container page-wrapper">
        {loading ? (
          <p className="text-center">Loading projects...</p>
        ) : projects.length === 0 ? (
          <p className="text-center text-muted">No projects found.</p>
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