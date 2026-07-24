import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import ProtectedRoute from './components/ProtectedRoute';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import DepartmentLayout from './layouts/DepartmentLayout';

// Public pages
import Home from './pages/Home';
import About from './pages/About';
import ProjectDetail from './pages/ProjectDetail';
import LoginSelector from './pages/LoginSelector';
import AdminLogin from './pages/AdminLogin';
import DepartmentLogin from './pages/DepartmentLogin';

// Admin pages
import Dashboard from './pages/admin/Dashboard';
import ProjectList from './pages/admin/ProjectList';
import ManageProjects from './pages/admin/ManageProjects';
import AddProject from './pages/admin/AddProject';
import EditProject from './pages/admin/EditProject';
import Report from './pages/admin/Report';

// Department pages
import DepartmentDashboard from './pages/department/DepartmentDashboard';

export default function App() {
  return (
    <>
      <Routes>
        {/* Public Routes with Navbar and Footer */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/login" element={<LoginSelector />} />
          <Route path="/login/admin" element={<AdminLogin />} />
          <Route path="/login/department" element={<DepartmentLogin />} />
          <Route path="*" element={
            <div className="page-wrapper text-center">
              <h1>404</h1>
              <p>Page not found</p>
              <a href="/" className="btn btn-primary mt-2">Go Home</a>
            </div>
          } />
        </Route>

        {/* Admin Routes with Shell Layout */}
        <Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/projects-list" element={<ProjectList />} />
          <Route path="/admin/projects" element={<ManageProjects />} />
          <Route path="/admin/projects/add" element={<AddProject />} />
          <Route path="/admin/projects/edit/:id" element={<EditProject />} />
          <Route path="/admin/report" element={<Report />} />
        </Route>

        {/* Department Routes with Shell Layout */}
        <Route element={<ProtectedRoute><DepartmentLayout /></ProtectedRoute>}>
          <Route path="/department/dashboard" element={<DepartmentDashboard />} />
        </Route>
      </Routes>
      <ToastContainer position="top-right" theme="colored" />
    </>
  );
}