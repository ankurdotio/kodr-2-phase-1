import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Navigation() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isSeller = pathname.startsWith('/seller');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const userLinks = [ { to: '/home', label: 'Home' } ];
  const sellerLinks = [
    { to: '/seller/dashboard', label: 'Dashboard' },
    { to: '/seller/products/create', label: 'Add Product' },
  ];
  const links = isSeller ? sellerLinks : userLinks;

  function switchRole(role) {
    if (role === 'seller' && !isSeller) navigate('/seller/dashboard');
    if (role === 'user' && isSeller) navigate('/home');
  }

  return (
    <nav className={`site-nav ${isSeller ? 'role-seller':''}`} aria-label="Primary">
      <div className="nav-inner">
        <button className="menu-btn" aria-label="Toggle menu" aria-expanded={menuOpen} onClick={()=>setMenuOpen(o=>!o)}>
          <span /><span /><span />
        </button>
        <a href={isSeller ? '/seller/dashboard' : '/home'} className="brand" aria-label="Site home">
          Shop<span>{isSeller ? 'SELLER' : 'USER'}</span>
        </a>
        <ul className={`nav-links ${menuOpen ? 'open':''}`} role="menubar">
          {links.map(link => (
            <li key={link.to} role="none">
              <NavLink to={link.to} role="menuitem" end>{link.label}</NavLink>
            </li>
          ))}
        </ul>
        <div className="spacer" />
        <div className="role-toggle" role="tablist" aria-label="Role switch">
          <button type="button" className={!isSeller ? 'active':''} role="tab" aria-selected={!isSeller} onClick={()=>switchRole('user')}>User</button>
          <button type="button" className={isSeller ? 'active':''} role="tab" aria-selected={isSeller} onClick={()=>switchRole('seller')}>Seller</button>
        </div>
        <div className="auth-links">
          {!isSeller && <a href="/user/login">Login</a>}
          {isSeller && <a href="/seller/login">Login</a>}
        </div>
      </div>
    </nav>
  );
}
