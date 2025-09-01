import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserLogin.css';
import './UserRegister.css'; // reuse base auth styles

export default function UserLogin() {
  const [form, setForm] = useState({ identifier: '', password: '' });
  const navigate = useNavigate();
  const role = 'user';

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    // UI only – submission logic intentionally omitted.
  }

  function switchRole(nextRole) {
    if (nextRole === role) return;
    navigate(nextRole === 'seller' ? '/seller/login' : '/user/login');
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card login-card role-user" role="region" aria-labelledby="login-heading">
        <div className="role-switch" role="tablist" aria-label="Account type">
          <button type="button" role="tab" aria-selected={role==='user'} className={role==='user' ? 'active' : ''} onClick={() => switchRole('user')}>User</button>
          <button type="button" role="tab" aria-selected={role==='seller'} className={role==='seller' ? 'active' : ''} onClick={() => switchRole('seller')}>Seller</button>
        </div>
        <header className="auth-header">
          <h1 id="login-heading" className="auth-title">Sign in</h1>
          <p className="auth-subtitle">Welcome back. Enter your credentials to continue.</p>
        </header>
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="field-group">
            <label htmlFor="identifier">Username or Email</label>
            <input
              id="identifier"
              name="identifier"
              type="text"
              placeholder="yourhandle or you@example.com"
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
          <p className="forgot-link"><a href="#">Forgot password?</a></p>
          <button type="submit" className="submit-btn">Sign in</button>
        </form>
  <p className="switch-auth">New here? <a href="/user/register">Create an account</a></p>
      </div>
    </div>
  );
}
