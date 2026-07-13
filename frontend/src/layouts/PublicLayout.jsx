import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import A11yBar from '../components/A11yBar';

export default function PublicLayout() {
  return (
    <>
      <A11yBar />
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
