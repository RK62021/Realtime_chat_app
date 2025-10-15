// src/pages/AuthSuccess.jsx
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { loginSuccess } from '../features/auth/authSlice';
import { API_URL } from '../config/index.js';

export default function AuthSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) return navigate('/login', { replace: true });

    // ✅ Store token in localStorage
    localStorage.setItem('token', token);

    // ✅ Set Axios default Authorization header
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    // ✅ Fetch user with progress tracking
    const fetchUser = async () => {
      try {
        setCurrentStep(1); // Verifying credentials
        
        const { data } = await axios.get(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        setCurrentStep(2); // Loading user profile

        dispatch(
          loginSuccess({
            token,
            user: data.data.user,
            needSetup: !data.data.user.username,
          })
        );

        setCurrentStep(3); // Redirecting to dashboard
        
        // Small delay for better UX
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 1000);
      } catch (err) {
        console.error('Failed to fetch user:', err);
        setError('Authentication failed. Please try again.');
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 2000);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="min-h-screen w-full bg-[radial-gradient(1000px_600px_at_-10%_-10%,rgba(99,102,241,0.25),transparent),radial-gradient(800px_500px_at_110%_110%,rgba(147,51,234,0.25),transparent)] bg-slate-950 flex items-center justify-center p-6">
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
        {/* Decorative blur elements */}
        <div className="absolute -top-6 -right-6 h-24 w-24 bg-indigo-500/20 blur-2xl rounded-full" />
        <div className="absolute -bottom-6 -left-6 h-24 w-24 bg-fuchsia-500/20 blur-2xl rounded-full" />
        
        <div className="relative p-8 text-center">
          {/* Success/Error icon with animation */}
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <div className={`h-16 w-16 rounded-full p-0.5 ${
                error 
                  ? 'bg-gradient-to-r from-rose-500 to-red-500' 
                  : 'bg-gradient-to-r from-emerald-500 to-green-500'
              }`}>
                <div className="h-full w-full rounded-full bg-slate-950 flex items-center justify-center">
                  {error ? (
                    <svg className="h-8 w-8 text-rose-400 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11H7v-2h10v2z"/>
                    </svg>
                  ) : (
                    <svg className="h-8 w-8 text-emerald-400 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  )}
                </div>
              </div>
              {/* Spinning ring */}
              <div className={`absolute inset-0 h-16 w-16 rounded-full border-2 border-transparent animate-spin ${
                error ? 'border-t-rose-400' : 'border-t-emerald-400'
              }`}></div>
            </div>
          </div>
          
          {error ? (
            <>
              <h1 className="text-2xl font-semibold tracking-tight text-white mb-2">
                Authentication Failed
              </h1>
              <p className="text-sm text-rose-300 mb-6">
                {error}
              </p>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-semibold tracking-tight text-white mb-2">
                Authentication Successful
              </h1>
              <p className="text-sm text-gray-300 mb-6">
                Setting up your account...
              </p>
            </>
          )}
          
          {/* Progress steps */}
          <div className="space-y-3 text-left">
            <div className="flex items-center space-x-3">
              <div className={`h-2 w-2 rounded-full ${
                currentStep >= 1 ? 'bg-emerald-400 animate-pulse' : 'bg-gray-400'
              }`}></div>
              <span className={`text-sm ${currentStep >= 1 ? 'text-gray-300' : 'text-gray-400'}`}>
                Verifying credentials
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div className={`h-2 w-2 rounded-full ${
                currentStep >= 2 ? 'bg-indigo-400 animate-pulse' : 'bg-gray-400'
              }`} style={{ animationDelay: '500ms' }}></div>
              <span className={`text-sm ${currentStep >= 2 ? 'text-gray-300' : 'text-gray-400'}`}>
                Loading user profile
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div className={`h-2 w-2 rounded-full ${
                currentStep >= 3 ? 'bg-emerald-400 animate-pulse' : 'bg-gray-400'
              }`}></div>
              <span className={`text-sm ${currentStep >= 3 ? 'text-gray-300' : 'text-gray-400'}`}>
                Redirecting to dashboard
              </span>
            </div>
          </div>
          
          {/* Loading dots animation */}
          <div className="mt-6 flex justify-center space-x-1">
            <div className="h-2 w-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="h-2 w-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="h-2 w-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
