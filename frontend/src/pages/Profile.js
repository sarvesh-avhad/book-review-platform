// frontend/src/pages/Profile.js
import React, { useEffect, useState, useContext } from 'react';
import api from '../api';
import { AuthContext } from '../AuthContext';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [books, setBooks] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (!user) return;
    api.get('/users/me/books').then(res => setBooks(res.data)).catch(console.error);
    api.get('/users/me/reviews').then(res => setReviews(res.data)).catch(console.error);
  }, [user]);

  if (!user) return <div className="container mt-4">Please login.</div>;

  return (
    <div className="container mt-4">
      <h2>{user.name}'s Profile</h2>
      <p><strong>Email:</strong> {user.email}</p>

      <div className="mt-4">
        <h4>Your Books</h4>
        {books.length === 0 && <div>No books added yet.</div>}
        {books.map(b => (
          <div key={b._id} className="border p-2 mb-2">
            <h5>{b.title}</h5>
            <p>{b.description?.slice(0, 150)}</p>
            <Link to={`/books/${b._id}`} className="btn btn-sm btn-outline-primary">View</Link>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <h4>Your Reviews</h4>
        {reviews.length === 0 && <div>No reviews yet.</div>}
        {reviews.map(r => (
          <div key={r._id} className="border p-2 mb-2">
            <p><strong>{r.book?.title}</strong> — rated {r.rating}/5</p>
            <p>{r.reviewText}</p>
            <Link to={`/books/${r.book?._id}`} className="btn btn-sm btn-outline-secondary">View Book</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
