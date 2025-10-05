// frontend/src/pages/BookList.js
import React, { useEffect, useState, useContext } from 'react';
import api from '../api';
import BookCard from '../components/BookCard';
import Pagination from '../components/Pagination';
import { AuthContext } from '../AuthContext';
import { Link } from 'react-router-dom';

const BookList = () => {
  const [booksData, setBooksData] = useState({ books: [], page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const [search, setSearch] = useState('');

  const fetchBooks = async (page = 1) => {
    setLoading(true);
    try {
      const res = await api.get('/books', { params: { page, search } });
      setBooksData(res.data);
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchBooks(1); }, [search]);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Books</h2>
        <div>
          {user ? (
            <>
              <span className="me-2">Hi, {user.name}</span>
              <Link className="btn btn-outline-primary btn-sm me-2" to="/add">Add Book</Link>
              <Link className="btn btn-outline-secondary btn-sm me-2" to="/profile">Profile</Link>
              <button className="btn btn-danger btn-sm" onClick={() => logout()}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-primary btn-sm me-2">Login</Link>
              <Link to="/signup" className="btn btn-secondary btn-sm">Sign up</Link>
            </>
          )}
        </div>
      </div>

      <div className="mb-3 d-flex">
        <input className="form-control me-2" placeholder="Search by title/author/genre" value={search} onChange={(e) => setSearch(e.target.value)} />
        <button className="btn btn-outline-secondary" onClick={() => fetchBooks(1)}>Search</button>
      </div>

      {loading ? <div>Loading...</div> : (
        <>
          {booksData.books.length === 0 ? <div>No books found.</div> : booksData.books.map(b => <BookCard key={b._id} book={b} />)}
          <Pagination page={booksData.page} totalPages={booksData.totalPages} onChange={(p) => fetchBooks(p)} />
        </>
      )}
    </div>
  );
};

export default BookList;
