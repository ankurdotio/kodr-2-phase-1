import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserRegister.css';

export default function UserRegister() {
  const [form, setForm] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  const role = 'user';
  const navigate = useNavigate();

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
    navigate(nextRole === 'seller' ? '/seller/register' : '/user/register');
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card role-user" role="region" aria-labelledby="register-heading">
        <div className="role-switch" role="tablist" aria-label="Account type">
          <button type="button" role="tab" aria-selected={role==='user'} className={role==='user' ? 'active' : ''} onClick={() => switchRole('user')}>User</button>
          <button type="button" role="tab" aria-selected={role==='seller'} className={role==='seller' ? 'active' : ''} onClick={() => switchRole('seller')}>Seller</button>
        </div>
        <header className="auth-header">
          <h1 id="register-heading" className="auth-title">Create account</h1>
          <p className="auth-subtitle">Join us and start your journey. It only takes a minute.</p>
        </header>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="field-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="yourhandle"
              autoComplete="username"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>

            <div className="field-row">
              <div className="field-group">
                <label htmlFor="firstName">First name</label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="Jane"
                  autoComplete="given-name"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="field-group">
                <label htmlFor="lastName">Last name</label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Doe"
                  autoComplete="family-name"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

          <div className="field-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              value={form.email}
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
              autoComplete="new-password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={8}
            />
          </div>

          <button type="submit" className="submit-btn">Create account</button>
          <p className="fine-print">By creating an account you agree to our terms & privacy policy.</p>
        </form>
  <p className="switch-auth">Already have an account? <a href="/user/login">Sign in</a></p>
      </div>
    </div>
  );
}
