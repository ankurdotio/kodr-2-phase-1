import { Outlet, useLocation } from 'react-router-dom';
import './AppLayout.css';
import Navigation from '../components/Navigation';

export default function AppLayout() {
  const { pathname } = useLocation();
  const isSeller = pathname.startsWith('/seller');
  return (
    <div className={`app-frame ${isSeller ? 'role-seller':''}`}>
      <Navigation />
      <main className="app-main">
        <Outlet />
      </main>
      <footer className="site-footer">© {new Date().getFullYear()} Demo Shop UI</footer>
    </div>
  );
}
