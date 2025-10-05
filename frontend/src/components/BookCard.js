// frontend/src/components/BookCard.js
import React from 'react';
import { Link } from 'react-router-dom';

const BookCard = ({ book }) => {
  return (
    <div className="card mb-3">
      <div className="card-body">
        <h5 className="card-title">{book.title} <small className="text-muted">by {book.author}</small></h5>
        <p className="card-text">{book.description?.slice(0, 140)}{book.description?.length > 140 ? '...' : ''}</p>
        <p className="mb-1"><strong>Genre:</strong> {book.genre} &nbsp; <strong>Year:</strong> {book.year}</p>
        <p className="mb-1"><small>Added by: {book.addedBy?.name || 'Unknown'}</small></p>
        <Link to={`/books/${book._id}`} className="btn btn-primary btn-sm">Details</Link>
      </div>
    </div>
  );
};

export default BookCard;
