import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Navigation() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isSeller = user?.role === 'seller' || pathname.startsWith('/seller');
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => { setDrawerOpen(false); }, [pathname]);

  const handleEsc = useCallback((e) => {
    if (e.key === 'Escape') setDrawerOpen(false);
  }, []);

  useEffect(() => {
    if (drawerOpen) {
      document.addEventListener('keydown', handleEsc);
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.removeEventListener('keydown', handleEsc);
      document.documentElement.style.overflow = '';
    }
    return () => document.removeEventListener('keydown', handleEsc);
  }, [drawerOpen, handleEsc]);

  const userLinks = [ { to: '/home', label: 'Home' } ];
  const sellerLinks = [ { to: '/seller/dashboard', label: 'Dashboard' }, { to: '/seller/products/create', label: 'Add Product' } ];
  const links = (user?.role === 'seller') ? sellerLinks : userLinks;

  // Role switch removed per request; navigation reflects current path only.

  return (
    <nav className={`site-nav ${isSeller ? 'role-seller':''}`} aria-label="Primary">
      <div className="nav-inner">
        <button className="menu-btn" aria-label="Toggle menu" aria-controls="mobile-drawer" aria-expanded={drawerOpen} onClick={()=>setDrawerOpen(o=>!o)}>
          <span /><span /><span />
        </button>
        <a href={isSeller ? '/seller/dashboard' : '/home'} className="brand" aria-label="Site home">Shop</a>
        <ul className="nav-links" role="menubar">
          {links.map(link => (
            <li key={link.to} role="none"><NavLink to={link.to} role="menuitem" end>{link.label}</NavLink></li>
          ))}
        </ul>
        <div className="spacer" />
        <div className="auth-links">
          {user ? (
            <>
              <span style={{fontSize:'.65rem'}}>Hi, {user.fullName?.firstName || user.username}</span>
              <button style={{fontSize:'.6rem'}} onClick={()=>{ logout(); navigate('/home'); }}>Logout</button>
            </>
          ) : (
            <>
              <a href="/user/login">Login</a>
              <a href="/user/register">Register</a>
            </>
          )}
        </div>
      </div>

      {/* Mobile drawer */}
      <div className={`nav-drawer-backdrop ${drawerOpen ? 'open':''}`} onClick={()=>setDrawerOpen(false)} />
      <aside id="mobile-drawer" className={`nav-drawer ${drawerOpen ? 'open':''}`} aria-hidden={!drawerOpen} aria-label="Mobile navigation">
        <header>
          <a href={isSeller ? '/seller/dashboard' : '/home'} className="brand">Shop</a>
          <button className="close-drawer" aria-label="Close menu" onClick={()=>setDrawerOpen(false)}>×</button>
        </header>
        <nav>
          <div className="drawer-section-title">Navigation</div>
          <ul className="drawer-links" role="menubar">
            {links.map(link => (
              <li key={link.to} role="none"><NavLink to={link.to} role="menuitem" end>{link.label}</NavLink></li>
            ))}
          </ul>
        </nav>
        <div className="drawer-auth">
          {user ? (
            <button onClick={()=>{ logout(); navigate('/home'); }}>Logout</button>
          ) : (
            <>
              <a href="/user/login">Login</a>
              <a href="/user/register">Register</a>
            </>
          )}
        </div>
      </aside>
    </nav>
  );
}
