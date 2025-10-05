// frontend/src/pages/Login.js
import React, { useState, useContext } from 'react';
import { AuthContext } from '../AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ email: '', password: '' });
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (error) {
      setErr(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Login</h2>
      {err && <div className="alert alert-danger">{err}</div>}
      <form onSubmit={submit} style={{ maxWidth: 520 }}>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input required type="email" className="form-control" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}/>
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input required type="password" className="form-control" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}/>
        </div>
        <button className="btn btn-primary">Login</button> &nbsp;
        <Link to="/signup">New? Sign up</Link>
      </form>
    </div>
  );
};

export default Login;
