// frontend/src/pages/BookDetails.js
import React, { useEffect, useState, useContext } from 'react';
import api from '../api';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

const BookDetails = () => {
  const { id } = useParams();
  const [data, setData] = useState({ book: null, reviews: [], avgRating: null, reviewsCount: 0 });
  const [loading, setLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState({ rating: 5, reviewText: '' });
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/books/${id}`);
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [id]);

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/books/${id}/reviews`, reviewForm);
      setReviewForm({ rating: 5, reviewText: '' });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error posting review');
    }
  };

  const deleteReview = async (reviewId) => {
    if (!window.confirm('Delete review?')) return;
    await api.delete(`/reviews/${reviewId}`);
    fetchData();
  };

  const deleteBook = async () => {
    if (!window.confirm('Delete book?')) return;
    await api.delete(`/books/${id}`);
    navigate('/');
  };

  if (loading) return <div className="container mt-4">Loading...</div>;
  if (!data.book) return <div className="container mt-4">Book not found</div>;

  const isOwner = user && user.id === data.book.addedBy?._id;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between">
        <h2>{data.book.title}</h2>
        <div>
          {isOwner && (
            <>
              <Link to={`/edit/${data.book._id}`} className="btn btn-outline-secondary btn-sm me-2">Edit</Link>
              <button className="btn btn-danger btn-sm" onClick={deleteBook}>Delete</button>
            </>
          )}
        </div>
      </div>

      <p className="text-muted">by {data.book.author} &nbsp; | &nbsp; Genre: {data.book.genre} &nbsp;|&nbsp; Year: {data.book.year}</p>
      <p>{data.book.description}</p>

      <div className="mb-3">
        <h5>Average rating: {data.avgRating ?? 'No ratings yet'} ({data.reviewsCount} reviews)</h5>
      </div>

      <div className="mb-4">
        <h5>Reviews</h5>
        {data.reviews.length === 0 && <div>No reviews yet.</div>}
        {data.reviews.map(r => (
          <div key={r._id} className="border rounded p-2 mb-2">
            <div className="d-flex justify-content-between">
              <div><strong>{r.user?.name || 'User'}</strong> <small className="text-muted">rated {r.rating}/5</small></div>
              {user && user.id === r.user?._id && (
                <div>
                  <Link to={`/edit-review/${r._id}`} className="btn btn-sm btn-outline-secondary me-1">Edit</Link>
                  <button className="btn btn-sm btn-danger" onClick={() => deleteReview(r._id)}>Delete</button>
                </div>
              )}
            </div>
            <p className="mb-0">{r.reviewText}</p>
            <small className="text-muted">{new Date(r.createdAt).toLocaleString()}</small>
          </div>
        ))}
      </div>

      <div className="mb-4">
        {user ? (
          <form onSubmit={submitReview} style={{ maxWidth: 700 }}>
            <h5>Add / Update your review</h5>
            <div className="mb-2">
              <label>Rating</label>
              <select className="form-select" value={reviewForm.rating} onChange={e => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}>
                {[5,4,3,2,1].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div className="mb-2">
              <label>Text</label>
              <textarea className="form-control" rows="3" value={reviewForm.reviewText} onChange={e => setReviewForm({ ...reviewForm, reviewText: e.target.value })}/>
            </div>
            <button className="btn btn-primary">Post Review</button>
          </form>
        ) : (
          <div>Please <Link to="/login">login</Link> to post a review.</div>
        )}
      </div>
    </div>
  );
};

export default BookDetails;
