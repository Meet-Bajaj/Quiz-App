import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import NavAuth from '../components/NavAuth';
import Prism from '../components/Prism';
import Footer from '../components/Footer';
import Navbar from '../components/NavAuth';

const Login = React.memo(() => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setError,
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    }
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Replace with your actual login API call
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        // Store auth token if needed
        localStorage.setItem('authToken', result.token);
        console.log('Login successful:', result);
        
        // Navigate to dashboard or home page
        navigate('/dashboard');
      } else {
        // Handle server errors
        setError('root', {
          type: 'server',
          message: result.message || 'Invalid email or password',
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('root', {
        type: 'server',
        message: 'Network error. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const prismAttributes = {
    animationType: "rotate",
    timeScale: 0.5,
    height: 3.5,
    baseWidth: 5.5,
    scale: 3.6,
    hueShift: 0,
    colorFrequency: 1,
    noise: 0.5,
    glow: 1,
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center min-h-screen w-screen p-4 bg-black/20 backdrop-blur-sm">
      {/* <NavAuth/> */}
      <Navbar isRequired={false} />
      <div className="w-full h-full absolute -z-10 opacity-50 md:flex hidden">
        <Prism {...prismAttributes} />
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-center w-full max-w-6xl rounded-xl shadow-2xl bg-zinc-950 min-h-[500px] overflow-hidden">
        
        {/* Left Section - Welcome Message */}
        <div className="flex-1 p-8 lg:p-12 text-center lg:text-left w-full border-b lg:border-b-0 lg:border-r border-gray-800">
          <h1 className="text-4xl lg:text-7xl bricolage font-bold text-white mb-6">
            Welcome Back!
          </h1>
          <p className="text-gray-300 text-sm lg:text-base mb-4">
            Sign in to continue your quiz journey
          </p>
          <Link 
            to="/signup"
            className="inline-block group"
            aria-label="Navigate to signup page"
          >
            <p className="text-white text-sm lg:text-base">
              Don't have an account?{' '}
              <span className="text-blue-400 hover:text-blue-300 group-hover:underline transition-colors">
                Sign Up
              </span>
            </p>
          </Link>
        </div>

        {/* Right Section - Form */}
        <div className="flex-1 p-8 lg:p-12 w-full">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Server Error Display */}
            {errors.root && (
              <div className="p-3 rounded-lg bg-red-900/20 border border-red-500/50">
                <p className="text-red-400 text-sm text-center" role="alert">
                  {errors.root.message}
                </p>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <input
                type="email"
                placeholder="Email"
                autoComplete="email"
                className={`w-full p-3 bg-transparent border-b-2 text-white placeholder-gray-400 focus:outline-none transition-all duration-300 input-transparent ${
                  errors.email
                    ? 'border-red-500 focus:border-red-400'
                    : 'border-gray-600 focus:border-white focus:scale-105'
                }`}
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Please enter a valid email address',
                  },
                })}
                aria-invalid={errors.email ? 'true' : 'false'}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-red-400 text-sm animate-fadeIn" role="alert">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <input
                type="password"
                placeholder="Password"
                autoComplete="current-password"
                className={`w-full p-3 bg-transparent border-b-2 text-white placeholder-gray-400 focus:outline-none transition-all duration-300 input-transparent ${
                  errors.password
                    ? 'border-red-500 focus:border-red-400'
                    : 'border-gray-600 focus:border-white focus:scale-105'
                }`}
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
                aria-invalid={errors.password ? 'true' : 'false'}
                disabled={isLoading}
              />
              {errors.password && (
                <p className="text-red-400 text-sm animate-fadeIn" role="alert">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Forgot Password Link */}
            {/* <div className="text-right">
              <Link 
                to="/forgot-password"
                className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
              >
                Forgot your password?
              </Link>
            </div> */}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isValid || isLoading}
              className={`w-full lg:w-auto bg-white text-black rounded-full font-medium px-8 py-2 transition-all duration-300 ${
                !isValid || isLoading
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:opacity-90 hover:scale-105 active:scale-95'
              }`}
              aria-label={isLoading ? 'Signing in...' : 'Sign in to your account'}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                  Signing In...
                </div>
              ) : (
                'Login'
              )}
            </button>
          </form>
        </div>
      </div>
      
      <Footer />
    </div>
  );
});

Login.displayName = 'Login';

export default Login;
