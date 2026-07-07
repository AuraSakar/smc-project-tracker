import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import About from './pages/About';
import ProjectDetail from './pages/ProjectDetail';
import Login from './pages/Login';
import Dashboard from './pages/admin/Dashboard';
import ManageProjects from './pages/admin/ManageProjects';
import AddProject from './pages/admin/AddProject';
import EditProject from './pages/admin/EditProject';

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/admin/projects" element={<ProtectedRoute><ManageProjects /></ProtectedRoute>} />
          <Route path="/admin/projects/add" element={<ProtectedRoute><AddProject /></ProtectedRoute>} />
          <Route path="/admin/projects/edit/:id" element={<ProtectedRoute><EditProject /></ProtectedRoute>} />
          <Route path="*" element={
            <div className="page-wrapper text-center">
              <h1>404</h1>
              <p>Page not found</p>
              <a href="/" className="btn btn-primary mt-2">Go Home</a>
            </div>
          } />
        </Routes>
      </main>
      <Footer />
      <ToastContainer position="top-right" theme="colored" />
    </>
  );
}