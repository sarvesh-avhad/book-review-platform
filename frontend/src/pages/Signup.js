// frontend/src/pages/Signup.js
import React, { useState, useContext } from 'react';
import { AuthContext } from '../AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
  const { register } = useContext(AuthContext);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await register(form.name, form.email, form.password);
      navigate('/');
    } catch (error) {
      setErr(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Sign up</h2>
      {err && <div className="alert alert-danger">{err}</div>}
      <form onSubmit={submit} style={{ maxWidth: 520 }}>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input required className="form-control" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}/>
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input required className="form-control" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}/>
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input required className="form-control" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}/>
        </div>
        <button className="btn btn-primary">Register</button> &nbsp;
        <Link to="/login">Already have an account? Login</Link>
      </form>
    </div>
  );
};

export default Signup;
