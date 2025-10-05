// frontend/src/pages/AddEditBook.js
import React, { useEffect, useState, useContext } from 'react';
import api from '../api';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

const AddEditBook = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', author: '', description: '', genre: '', year: '' });
  const [err, setErr] = useState('');

  useEffect(() => {
    if (id) {
      api.get(`/books/${id}`).then(res => {
        const b = res.data.book;
        setForm({ title: b.title, author: b.author, description: b.description, genre: b.genre, year: b.year });
      }).catch(err => setErr('Failed to load book'));
    }
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await api.put(`/books/${id}`, form);
        navigate(`/books/${id}`);
      } else {
        const res = await api.post('/books', form);
        navigate(`/books/${res.data._id}`);
      }
    } catch (err) {
      setErr(err.response?.data?.message || 'Failed');
    }
  };

  return (
    <div className="container mt-4">
      <h2>{id ? 'Edit Book' : 'Add Book'}</h2>
      {err && <div className="alert alert-danger">{err}</div>}
      <form onSubmit={submit} style={{ maxWidth: 720 }}>
        <div className="mb-3">
          <label>Title</label>
          <input required className="form-control" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
        </div>
        <div className="mb-3">
          <label>Author</label>
          <input required className="form-control" value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} />
        </div>
        <div className="mb-3">
          <label>Description</label>
          <textarea className="form-control" rows="4" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        </div>
        <div className="mb-3">
          <label>Genre</label>
          <input className="form-control" value={form.genre} onChange={e => setForm({ ...form, genre: e.target.value })} />
        </div>
        <div className="mb-3">
          <label>Published Year</label>
          <input type="number" className="form-control" value={form.year || ''} onChange={e => setForm({ ...form, year: e.target.value })} />
        </div>
        <button className="btn btn-primary">{id ? 'Save Changes' : 'Add Book'}</button>
      </form>
    </div>
  );
};

export default AddEditBook;
