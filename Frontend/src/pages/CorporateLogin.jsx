import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';
import { API_BASE_URL, API_URL } from '../config/api';

const CorporateLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedSimulation, setSelectedSimulation] = useState(null);
  const [activeRole, setActiveRole] = useState("");

  useEffect(() => {
    // Get corporate simulation data from localStorage
    const savedSimulation = localStorage.getItem('selectedCorporateSimulation');
    if (savedSimulation) {
      try {
        const simData = JSON.parse(savedSimulation);
        setSelectedSimulation(simData);
      } catch (error) {
        console.error('Error parsing corporate simulation data:', error);
      }
    }
  }, [location.search]);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password || !activeRole || !selectedSimulation) {
      setError("Please enter all required fields");
      setLoading(false);
      return;
    }

    // Demo credentials for Leadership & Management simulation
    if (email === 'corporatedemo1@test.com' && password === '123' && activeRole === 'participant') {
      // Bypass backend and login directly
      localStorage.setItem('token', 'demo-token-corporate-participant');
      localStorage.setItem('userRole', 'participant');
      localStorage.setItem('userEmail', email);
      localStorage.setItem('simulationType', 'corporate');
      localStorage.setItem('corporateSimulation', selectedSimulation.name);
      localStorage.setItem('userId', 'demo-user-1');
      localStorage.setItem('userName', 'Demo Participant');
      localStorage.setItem('organization', 'Demo Organization');
      
      setLoading(false);
      navigate('/corporate/participant/dashboard');
      return;
    }

    try {
      // First check if server is accessible
      try {
        await axios.options(API_BASE_URL);
      } catch (err) {
        if (err.code === 'ERR_NETWORK') {
          setError('Cannot connect to server. Please ensure the backend server is running.');
          setLoading(false);
          return;
        }
      }

      // Use standard auth endpoint for all corporate roles
      const endpoint = `${API_URL}/auth/login`;

      // Make the login request
      const loginResponse = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          email, 
          password
        })
      });

      const responseData = await loginResponse.json();

      if (loginResponse.ok && responseData.token) {
        // Store authentication data
        localStorage.setItem('token', responseData.token);
        localStorage.setItem('userRole', activeRole);
        localStorage.setItem('userEmail', email);
        localStorage.setItem('simulationType', 'corporate');
        localStorage.setItem('corporateSimulation', selectedSimulation.name);
        
        // Store user info
        if (responseData.user?._id) {
          localStorage.setItem('userId', responseData.user._id);
        }
        if (responseData.user?.organization) {
          localStorage.setItem('organization', responseData.user.organization);
        }
        if (responseData.user?.fullName) {
          localStorage.setItem('userName', responseData.user.fullName);
        }
        
        // Navigate based on role
        if (activeRole === 'admin') {
          navigate("/corporate/admin/dashboard");
        } else if (activeRole === 'participant') {
          navigate("/corporate/participant/dashboard");
        }
      } else {
        setError(responseData.details || responseData.message || "Login failed");
      }
    } catch (err) {
      console.error('Login error:', err);
      
      if (err.code === 'ERR_NETWORK') {
        setError('Cannot connect to server. Please ensure the backend server is running.');
      } else if (err.response?.data?.details) {
        setError(err.response.data.details);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Server error. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-6">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md border border-blue-100">
        {/* Header with simulation info */}
        {selectedSimulation && (
          <div className="text-center mb-6">
            <div className="text-5xl mb-3">{selectedSimulation.icon}</div>
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
              {selectedSimulation.name}
            </h2>
            <p className="text-sm text-gray-600">Corporate Training Simulation</p>
            <div className="flex justify-center gap-2 mt-3">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                {selectedSimulation.level}
              </span>
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                {selectedSimulation.duration}
              </span>
            </div>
          </div>
        )}

        {!selectedSimulation && (
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
              Corporate Simulation Login
            </h2>
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-700 text-sm">
                ⚠️ Please select a corporate simulation from the{' '}
                <a href="/corporate-simulations" className="text-blue-600 underline font-semibold">
                  corporate simulations page
                </a>
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200">
            <p className="text-red-600 text-sm font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5" noValidate>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Role
            </label>
            <select
              value={activeRole}
              onChange={(e) => setActiveRole(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              disabled={loading}
            >
              <option value="">Select Your Role</option>
              <option value="participant">Participant</option>
              <option value="admin">Training Administrator</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your work email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className={`w-full flex items-center justify-center py-3 px-4 rounded-lg font-semibold text-white transition-all transform ${
              loading
                ? 'bg-gradient-to-r from-blue-400 to-purple-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:shadow-lg hover:scale-105'
            }`}
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Sign In to Simulation
              </>
            )}
          </button>
        </form>

        {/* Additional info */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="text-center text-sm text-gray-600">
            <p className="mb-2">Need help? Contact your training administrator</p>
            <button
              onClick={() => navigate('/corporate-simulations')}
              className="text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center transition-colors"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Corporate Simulations
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CorporateLogin;
