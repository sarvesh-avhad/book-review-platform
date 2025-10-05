// frontend/src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import BookList from './pages/BookList';
import Signup from './pages/Signup';
import Login from './pages/Login';
import BookDetails from './pages/BookDetails';
import AddEditBook from './pages/AddEditBook';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import { useContext } from 'react';
import { AuthContext } from './AuthContext';

function App() {
  const { user } = useContext(AuthContext);
  return (
    <BrowserRouter>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container">
          <Link className="navbar-brand" to="/">Book reviews</Link>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav ms-auto">
              {user ? (
                <>
                  <li className="nav-item"><Link className="nav-link" to="/profile">{user.name}</Link></li>
                </>
              ) : (
                <>
                  <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>
                  <li className="nav-item"><Link className="nav-link" to="/signup">Sign up</Link></li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<BookList />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/books/:id" element={<BookDetails />} />
        <Route path="/add" element={<ProtectedRoute><AddEditBook /></ProtectedRoute>} />
        <Route path="/edit/:id" element={<ProtectedRoute><AddEditBook /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="*" element={<div className="container mt-4">Not found</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
