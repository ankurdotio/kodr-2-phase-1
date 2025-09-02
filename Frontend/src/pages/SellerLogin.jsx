import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SellerLogin.css';
import './UserRegister.css'; // reuse base auth styles
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function SellerLogin() {
  const [ form, setForm ] = useState({ identifier: '', password: '' });
  const role = 'seller';
  const { refresh } = useAuth();
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [ name ]: value }));
  }


  function handleSubmit(e) {
    e.preventDefault();
    const data = { password: form.password }

    if (form.identifier.includes('@')) {
      data.email = form.identifier
    }
    else {
      data.username = form.identifier
    }

  api.post("/api/auth/seller/login",data)
  .then(response => { console.log(response.data); refresh(); navigate('/seller/dashboard'); })

  }

  function switchRole(nextRole) {
    if (nextRole === role) return;
    navigate(nextRole === 'seller' ? '/seller/login' : '/user/login');
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card seller-login role-seller" role="region" aria-labelledby="seller-login-heading">
        <div className="role-switch" role="tablist" aria-label="Account type">
          <button type="button" role="tab" aria-selected={role === 'user'} className={role === 'user' ? 'active' : ''} onClick={() => switchRole('user')}>User</button>
          <button type="button" role="tab" aria-selected={role === 'seller'} className={role === 'seller' ? 'active' : ''} onClick={() => switchRole('seller')}>Seller</button>
        </div>
        <span className="seller-badge" aria-hidden="true">SELLER</span>
        <header className="auth-header">
          <h1 id="seller-login-heading" className="auth-title">Seller sign in</h1>
          <p className="auth-subtitle">Access your seller dashboard.</p>
        </header>
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="field-group">
            <label htmlFor="identifier">Username or Email</label>
            <input
              id="identifier"
              name="identifier"
              type="text"
              placeholder="storehandle or you@example.com"
              autoComplete="username"
              value={form.identifier}
              onChange={handleChange}
              required
            />
          </div>
          <div className="field-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <p className="seller-forgot"><a href="#">Forgot password?</a></p>
          <button type="submit" className="submit-btn">Sign in</button>
        </form>
        <p className="switch-auth">New seller? <a href="/seller/register">Create seller account</a></p>
      </div>
    </div>
  );
}
