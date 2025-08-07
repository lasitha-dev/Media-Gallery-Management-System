import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import AuthCallback from './components/auth/AuthCallback';
import './App.css';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/auth/callback" element={
          <AuthCallback />
        } />

        {/* Private Routes */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <div className="min-h-screen bg-gray-100">
                <div className="container mx-auto px-4 py-8">
                  <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
                    Media Gallery
                  </h1>
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <p className="text-gray-600">
                      Welcome to the Media Gallery Management System
                    </p>
                  </div>
                </div>
              </div>
            </PrivateRoute>
          }
        />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
