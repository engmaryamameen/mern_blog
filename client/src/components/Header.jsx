import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaMoon, FaSun, FaUser, FaSignOutAlt, FaCog, FaHome, FaChartBar, FaUsers, FaUserCircle, FaCogs } from 'react-icons/fa';
import { HiMenu, HiX, HiChevronRight } from 'react-icons/hi';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../redux/theme/themeSlice';
import { signoutSuccess } from '../redux/user/userSlice';
import { useEffect, useState } from 'react';

export default function Header() {
  const path = useLocation().pathname;
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  const handleSignout = async () => {
    try {
      const res = await fetch('/api/user/signout', {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
        setIsDropdownOpen(false);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const navLinks = [
    { name: 'Home', path: '/', icon: FaHome },
    { name: 'Blog', path: '/blog', icon: FaChartBar },
    { name: 'Categories',  icon: FaUsers, hasSubmenu: true },
    { name: 'About', path: '/about', icon: FaUserCircle },
  ];

  const categoryOptions = [
    { name: 'Technology', path: '/search?category=technology' },
    { name: 'Programming', path: '/search?category=programming' },
    { name: 'Design', path: '/search?category=design' },
    { name: 'Business', path: '/search?category=business' },
    { name: 'Lifestyle', path: '/search?category=lifestyle' },
    { name: 'Tutorial', path: '/search?category=tutorial' },
    { name: 'News', path: '/search?category=news' },
    { name: 'Marketing', path: '/search?category=marketing' },
    { name: 'Health', path: '/search?category=health' },
    { name: 'Science', path: '/search?category=science' },
    { name: 'History', path: '/search?category=history' },
    { name: 'Art', path: '/search?category=art' },
    { name: 'Music', path: '/search?category=music' },
  ];

  const toggleSubmenu = (menuName) => {
    setActiveSubmenu(activeSubmenu === menuName ? null : menuName);
  };

  return (
    <>
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
                  <span className="text-white font-bold text-lg">T</span>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Tech Blog
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Professional Insights</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => (
                <div key={link.name} className="relative">
                  <Link
                    to={link.hasSubmenu ? '#' : link.path}
                    className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      path === link.path
                        ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                        : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                    onClick={(e) => {
                      if (link.hasSubmenu) {
                        e.preventDefault();
                        toggleSubmenu(link.name);
                      }
                    }}
                  >
                    <link.icon className="w-4 h-4" />
                    <span>{link.name}</span>
                    {link.hasSubmenu && (
                      <HiChevronRight className={`w-4 h-4 transition-transform duration-200 ${
                        activeSubmenu === link.name ? 'rotate-90' : ''
                      }`} />
                    )}
                  </Link>
                  
                  {/* Submenu for Categories */}
                  {link.hasSubmenu && activeSubmenu === link.name && (
                    <div className="absolute top-full left-0 mt-1 w-96 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-4 z-50">
                      <div className="px-4 pb-2 border-b border-gray-200 dark:border-gray-700 mb-2">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Browse Categories</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-1 px-2">
                        {categoryOptions.map((option) => {
                          const urlParams = new URLSearchParams(location.search);
                          const currentCategory = urlParams.get('category');
                          const isActive = currentCategory === option.path.split('=')[1];
                          
                          return (
                            <Link
                              key={option.name}
                              to={option.path}
                              className={`flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                                isActive
                                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 font-medium shadow-sm'
                                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                              }`}
                              onClick={() => setActiveSubmenu(null)}
                            >
                              <span className="flex items-center space-x-2">
                                <div className={`w-2 h-2 rounded-full ${
                                  isActive 
                                    ? 'bg-blue-600 dark:bg-blue-400' 
                                    : 'bg-gray-300 dark:bg-gray-600'
                                }`}></div>
                                <span>{option.name}</span>
                              </span>
                              {isActive && (
                                <span className="text-blue-600 dark:text-blue-400 text-xs">✓</span>
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Search Bar */}
            <div className="hidden md:flex items-center flex-1 max-w-md mx-4 lg:mx-8">
              <form onSubmit={handleSubmit} className="relative w-full">
                <div className="relative">
                  <AiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white transition-all duration-200 hover:bg-white dark:hover:bg-gray-700"
                  />
                </div>
              </form>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Search Button - Only on small screens */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
              >
                <AiOutlineSearch className="w-5 h-5" />
              </button>

              {/* Theme Toggle */}
              <button
                onClick={() => dispatch(toggleTheme())}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
              >
                {theme === 'light' ? <FaMoon className="w-5 h-5" /> : <FaSun className="w-5 h-5" />}
              </button>

              {/* Sidebar Toggle - Hidden on large screens */}
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
              >
                <HiMenu className="w-6 h-6" />
              </button>

              {/* User Menu */}
              {currentUser ? (
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                  >
                    <img
                      src={currentUser.profilePicture}
                      alt={currentUser.username}
                      className="w-8 h-8 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                    />
                    <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {currentUser.username}
                    </span>
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          @{currentUser.username}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {currentUser.email}
                        </p>
                      </div>
                      
                      <Link
                        to="/dashboard?tab=profile"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                      >
                        <FaUser className="w-4 h-4 mr-3" />
                        Profile
                      </Link>
                      
                      <Link
                        to="/dashboard?tab=dash"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                      >
                        <FaCog className="w-4 h-4 mr-3" />
                        Dashboard
                      </Link>
                      
                      <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                      
                      <button
                        onClick={handleSignout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                      >
                        <FaSignOutAlt className="w-4 h-4 mr-3" />
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/sign-in">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg font-medium transition-colors duration-200 shadow-sm hover:shadow-md">
                    Sign In
                  </button>
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden py-4 border-t border-gray-200 dark:border-gray-700 animate-fade-in">
              {/* Mobile Search - Prominent placement */}
              <div className="mb-4 px-4">
                <form onSubmit={handleSubmit} className="relative">
                  <AiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white text-base"
                  />
                </form>
              </div>
              
            </div>
          )}
        </div>
      </header>

      {/* Sidebar */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsSidebarOpen(false)}></div>
          <div className="absolute left-0 top-0 h-full w-64 bg-white dark:bg-gray-800 shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Tech Blog</h2>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <HiX className="w-6 h-6" />
              </button>
            </div>
            <nav className="p-4 space-y-2">
              {navLinks.map((link) => (
                <div key={link.name} className="relative">
                  <Link
                    to={link.hasSubmenu ? '#' : link.path}
                    className={`flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      path === link.path
                        ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                        : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                    onClick={(e) => {
                      if (link.hasSubmenu) {
                        e.preventDefault();
                        toggleSubmenu(link.name);
                      }
                    }}
                  >
                    <div className="flex items-center space-x-2">
                      <link.icon className="w-4 h-4" />
                      <span>{link.name}</span>
                    </div>
                    {link.hasSubmenu && (
                      <HiChevronRight className={`w-4 h-4 transition-transform duration-200 ${
                        activeSubmenu === link.name ? 'rotate-90' : ''
                      }`} />
                    )}
                  </Link>
                  
                  {/* Submenu for Categories */}
                  {link.hasSubmenu && activeSubmenu === link.name && (
                    <div className="ml-6 mt-2">
                      <div className="pb-2 mb-2 border-b border-gray-200 dark:border-gray-700">
                        <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Categories</h4>
                      </div>
                      <div className="grid grid-cols-1 gap-1">
                        {categoryOptions.map((option) => {
                          const urlParams = new URLSearchParams(location.search);
                          const currentCategory = urlParams.get('category');
                          const isActive = currentCategory === option.path.split('=')[1];
                          
                          return (
                            <Link
                              key={option.name}
                              to={option.path}
                              className={`flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                                isActive
                                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 font-medium'
                                  : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                              }`}
                              onClick={() => {
                                setActiveSubmenu(null);
                                setIsSidebarOpen(false);
                              }}
                            >
                              <span className="flex items-center space-x-2">
                                <div className={`w-1.5 h-1.5 rounded-full ${
                                  isActive 
                                    ? 'bg-blue-600 dark:bg-blue-400' 
                                    : 'bg-gray-300 dark:bg-gray-600'
                                }`}></div>
                                <span>{option.name}</span>
                              </span>
                              {isActive && (
                                <span className="text-blue-600 dark:text-blue-400 text-xs">✓</span>
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden">
        <div className="bg-blue-600 rounded-t-xl mx-2 mb-2">
          <nav className="flex justify-around py-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                  path === link.path
                    ? 'text-white bg-blue-700'
                    : 'text-blue-100 hover:text-white hover:bg-blue-700'
                }`}
              >
                <link.icon className="w-5 h-5" />
                <span className="text-xs font-medium">{link.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}
