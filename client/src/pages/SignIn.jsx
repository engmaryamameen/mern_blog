import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from '../redux/user/userSlice';

import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaRocket, FaShieldAlt, FaUsers, FaCode, FaLightbulb, FaGlobe, FaStar, FaHeart, FaArrowRight } from 'react-icons/fa';


export default function SignIn() {
  const [formData, setFormData] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const { loading, error: errorMessage } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    setIsAnimating(true);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return dispatch(signInFailure('Please fill all the fields'));
    }
    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
      }

      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate('/');
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  const features = [
    {
      icon: <FaRocket className="w-6 h-6" />,
      title: "Lightning Fast",
      description: "Experience blazing-fast performance with our optimized platform",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <FaShieldAlt className="w-6 h-6" />,
      title: "Enterprise Security",
      description: "Bank-level encryption keeps your data safe and secure",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <FaUsers className="w-6 h-6" />,
      title: "Global Community",
      description: "Join 50,000+ developers sharing knowledge and insights",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <FaCode className="w-6 h-6" />,
      title: "Smart Features",
      description: "AI-powered tools to enhance your content creation",
      color: "from-orange-500 to-red-500"
    }
  ];

  const stats = [
    { number: "50K+", label: "Active Users", icon: <FaUsers /> },
    { number: "100K+", label: "Articles Published", icon: <FaCode /> },
    { number: "1M+", label: "Monthly Views", icon: <FaGlobe /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
      {/* Professional Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-indigo-600/5 to-purple-600/5 dark:from-blue-600/10 dark:via-indigo-600/10 dark:to-purple-600/10"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-10 dark:opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      {/* Subtle Floating Elements */}
      <div className="absolute top-20 left-10 w-24 h-24 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 dark:from-blue-500/10 dark:to-indigo-500/10 rounded-full blur-2xl"></div>
      <div className="absolute top-40 right-20 w-32 h-32 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 dark:from-indigo-500/10 dark:to-purple-500/10 rounded-full blur-2xl"></div>
      <div className="absolute bottom-20 left-1/4 w-28 h-28 bg-gradient-to-r from-purple-500/20 to-blue-500/20 dark:from-purple-500/10 dark:to-blue-500/10 rounded-full blur-2xl"></div>

      <div className="relative py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Side - Hero Section */}
            <div className="hidden lg:block">
              <div className="space-y-12">
                {/* Logo and Brand */}
                <div className="text-center lg:text-left">                  
                  <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                    Welcome back to{' '}
                    <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      your workspace
                    </span>
                  </h2>
                  <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed">
                    Access your personalized dashboard, create amazing content, and connect with the developer community.
                  </p>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-3 gap-4 mb-10">
                  {stats.map((stat, index) => (
                    <div 
                      key={index}
                      className="text-center p-4 bg-white/80 dark:bg-white/5 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-white/10 hover:bg-white dark:hover:bg-white/10 transition-all duration-300 shadow-sm"
                    >
                      <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stat.number}</div>
                      <div className="text-gray-600 dark:text-gray-400 text-xs font-medium">{stat.label}</div>
                    </div>
                  ))}
                </div>


                {/* Trust Indicators */}
                <div className="bg-white/80 dark:bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-gray-200/50 dark:border-white/10 shadow-sm">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="flex -space-x-1">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="w-6 h-6 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full border border-white/20"></div>
                      ))}
                    </div>
                    <div className="text-gray-900 dark:text-white">
                      <div className="font-medium text-sm">Trusted by 50K+ developers</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className="w-3 h-3 text-yellow-400" />
                    ))}
                    <span className="text-gray-600 dark:text-gray-300 text-sm ml-2">4.9/5 rating</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Sign In Form */}
            <div className="flex justify-center">
              <div className="w-full max-w-md">
                {/* Mobile Logo */}
                <div className="lg:hidden text-center mb-8">
                  <Link to="/" className="inline-flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold text-xl">T</span>
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tech Blog</h1>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Welcome back</p>
                    </div>
                  </Link>
                </div>

                {/* Form Card */}
                <div className="relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-purple-600/20 rounded-2xl blur-sm"></div>
                  <div className="relative p-8 bg-white/90 dark:bg-white/5 backdrop-blur-md rounded-2xl border border-gray-200/50 dark:border-white/10 shadow-xl">
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Sign in to your account
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Access your personalized dashboard and start creating amazing content
                      </p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                      {/* Email Field */}
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Email address
                        </label>
                        <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaEnvelope className="h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                          </div>
                          <input
                            type="email"
                            id="email"
                            placeholder="Enter your email"
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                            required
                          />
                        </div>
                      </div>

                      {/* Password Field */}
                      <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Password
                        </label>
                        <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaLock className="h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                          </div>
                          <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            placeholder="Enter your password"
                            onChange={handleChange}
                            className="w-full pl-10 pr-10 py-3 bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                            required
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <FaEyeSlash className="h-4 w-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200" />
                            ) : (
                              <FaEye className="h-4 w-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Remember Me & Forgot Password */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <input
                            id="remember-me"
                            name="remember-me"
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600 dark:text-gray-400">
                            Remember me
                          </label>
                        </div>
                        <div className="text-sm">
                          <a href="#" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200">
                            Forgot password?
                          </a>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 text-base flex items-center justify-center space-x-2 group"
                      >
                        <span>Sign in</span>
                        <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                      </button>

                      {/* Error Message */}
                      {errorMessage && (
                        <div className="bg-red-500/20 border border-red-500/30 text-red-200 px-4 py-3 rounded-xl">
                          <div className="flex">
                            <div className="flex-shrink-0">
                              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium">{errorMessage}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </form>

                    {/* Sign Up Link */}
                    <div className="mt-8 text-center">
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Don't have an account?{' '}
                        <Link
                          to="/sign-up"
                          className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
                        >
                          Sign up for free
                        </Link>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
