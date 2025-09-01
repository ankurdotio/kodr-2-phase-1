import { NavLink, useLocation } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';

export default function Navigation() {
  const { pathname } = useLocation();
  const isSeller = pathname.startsWith('/seller');
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
  const sellerLinks = [
    { to: '/seller/dashboard', label: 'Dashboard' },
    { to: '/seller/products/create', label: 'Add Product' },
  ];
  const links = isSeller ? sellerLinks : userLinks;

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
          {!isSeller && <a href="/user/login">Login</a>}
          {isSeller && <a href="/seller/login">Login</a>}
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
          {!isSeller && <a href="/user/login">Login</a>}
          {isSeller && <a href="/seller/login">Login</a>}
        </div>
      </aside>
    </nav>
  );
}
