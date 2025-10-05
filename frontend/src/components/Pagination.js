// frontend/src/components/Pagination.js
import React from 'react';

const Pagination = ({ page, totalPages, onChange }) => {
  const pages = [];
  for (let p = 1; p <= totalPages; p++) pages.push(p);

  if (totalPages <= 1) return null;

  return (
    <nav>
      <ul className="pagination">
        <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => onChange(page - 1)}>Previous</button>
        </li>
        {pages.map(p => (
          <li key={p} className={`page-item ${p === page ? 'active' : ''}`}>
            <button className="page-link" onClick={() => onChange(p)}>{p}</button>
          </li>
        ))}
        <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => onChange(page + 1)}>Next</button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
