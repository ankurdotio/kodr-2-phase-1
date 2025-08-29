import React, { useState } from 'react';
import './Register.css';

const initialState = { username: '', firstName: '', lastName: '', email: '', password: '' };

const Register = () => {
  const [form, setForm] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    // Fake latency simulation
    setTimeout(() => {
      // Simple demo feedback; replace with toast system later
      window?.alert?.('Registered! (demo)');
      setSubmitting(false);
      setForm(initialState);
    }, 600);
  };

  return (
    <main className="register-screen">
      <form className="register-card" onSubmit={handleSubmit} noValidate>
        <h1 className="register-title">Create account</h1>
        <div className="field-group full">
          <label htmlFor="username" className="field-label">Username</label>
          <input id="username" name="username" autoComplete="username" placeholder="username" value={form.username} onChange={handleChange} required />
        </div>
        <div className="field-row">
          <div className="field-group">
            <label htmlFor="firstName" className="field-label">First name</label>
            <input id="firstName" name="firstName" autoComplete="given-name" placeholder="firstName" value={form.firstName} onChange={handleChange} required />
          </div>
          <div className="field-group">
            <label htmlFor="lastName" className="field-label">Last name</label>
            <input id="lastName" name="lastName" autoComplete="family-name" placeholder="lastName" value={form.lastName} onChange={handleChange} required />
          </div>
        </div>
        <div className="field-group full">
          <label htmlFor="email" className="field-label">Email</label>
            <input id="email" name="email" type="email" autoComplete="email" placeholder="email" value={form.email} onChange={handleChange} required />
        </div>
        <div className="field-group full">
          <label htmlFor="password" className="field-label">Password</label>
          <input id="password" name="password" type="password" autoComplete="new-password" placeholder="password" value={form.password} onChange={handleChange} required minLength={6} />
        </div>
        <div className="actions">
          <button type="submit" disabled={submitting}>{submitting ? 'Registering…' : 'Register'}</button>
        </div>
      </form>
    </main>
  );
};

export default Register;
