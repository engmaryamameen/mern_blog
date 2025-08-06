import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PostCard from '../components/PostCard';
import { FaSearch, FaFilter, FaSort, FaFolder, FaSpinner, FaTimes, FaEye, FaCalendar, FaClock, FaUser } from 'react-icons/fa';

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [sidebarData, setSidebarData] = useState({
    searchTerm: '',
    sort: 'desc',
    category: 'uncategorized',
  });

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/post/getposts');
        if (res.ok) {
          const data = await res.json();
          setPosts(data.posts);
          if (data.posts.length === 9) {
            setShowMore(true);
          } else {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };
    fetchPosts();
  }, []);

  const handleChange = (e) => {
    if (e.target.id === 'searchTerm') {
      setSidebarData({ ...sidebarData, searchTerm: e.target.value });
    }
    if (e.target.id === 'sort') {
      const order = e.target.value || 'desc';
      setSidebarData({ ...sidebarData, sort: order });
    }
    if (e.target.id === 'category') {
      const category = e.target.value || 'uncategorized';
      setSidebarData({ ...sidebarData, category });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set('searchTerm', sidebarData.searchTerm);
    urlParams.set('sort', sidebarData.sort);
    urlParams.set('category', sidebarData.category);
    const searchQuery = urlParams.toString();
    window.location.href = `/search?${searchQuery}`;
  };

  const handleShowMore = async () => {
    const numberOfPosts = posts.length;
    const startIndex = numberOfPosts;
    const res = await fetch(`/api/post/getposts?startIndex=${startIndex}`);
    if (!res.ok) {
      return;
    }
    if (res.ok) {
      const data = await res.json();
      setPosts([...posts, ...data.posts]);
      if (data.posts.length === 9) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900'>
      <div className='p-6'>
        <div className='max-w-7xl mx-auto'>
          {/* Header Section */}
          <div className='bg-gradient-to-r from-gray-800 via-black to-gray-900 rounded-2xl shadow-xl mb-8 overflow-hidden'>
            <div className='px-8 py-8 text-white'>
              <div className='flex items-center space-x-4 mb-4'>
                <div className='w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center'>
                  <FaEye className='w-8 h-8 text-white' />
                </div>
                <div>
                  <h1 className='text-3xl font-bold'>All Blog Posts</h1>
                  <p className='text-gray-300 text-lg'>Discover amazing content from our community</p>
                </div>
              </div>
              
              {/* Blog Stats */}
              <div className='flex items-center space-x-6 text-sm'>
                <div className='flex items-center space-x-2'>
                  <FaEye className='w-4 h-4 text-blue-400' />
                  <span className='text-gray-300'>{posts.length} posts available</span>
                </div>
                <div className='flex items-center space-x-2'>
                  <FaFilter className='w-4 h-4 text-purple-400' />
                  <span className='text-gray-300'>Use search to find specific content</span>
                </div>
              </div>
            </div>
          </div>

          <div className='flex flex-col lg:flex-row gap-8'>
            {/* Sidebar - Search Filters */}
            <div className='lg:w-80 flex-shrink-0'>
              <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden sticky top-6'>
                <div className='bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 px-6 py-4 border-b border-gray-200 dark:border-gray-700'>
                  <h3 className='text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2'>
                    <FaSearch className='w-4 h-4 text-blue-600 dark:text-blue-400' />
                    <span>Find Posts</span>
                  </h3>
                </div>
                
                <form className='p-6 space-y-6' onSubmit={handleSubmit}>
                  {/* Search Term */}
                  <div className='space-y-2'>
                    <label className='text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center space-x-2'>
                      <FaSearch className='w-4 h-4 text-gray-500' />
                      <span>Search Term</span>
                    </label>
                    <div className='relative'>
                      <input
                        type='text'
                        placeholder='Search articles, topics, or keywords...'
                        id='searchTerm'
                        value={sidebarData.searchTerm}
                        onChange={handleChange}
                        className='w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 bg-gray-50 dark:bg-gray-700 hover:bg-white dark:hover:bg-gray-600'
                      />
                      <FaSearch className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
                    </div>
                  </div>

                  {/* Sort Options */}
                  <div className='space-y-2'>
                    <label className='text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center space-x-2'>
                      <FaSort className='w-4 h-4 text-gray-500' />
                      <span>Sort By</span>
                    </label>
                    <select
                      onChange={handleChange}
                      value={sidebarData.sort}
                      id='sort'
                      className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 bg-gray-50 dark:bg-gray-700 hover:bg-white dark:hover:bg-gray-600'
                    >
                      <option value='desc'>Latest First</option>
                      <option value='asc'>Oldest First</option>
                    </select>
                  </div>

                  {/* Category Filter */}
                  <div className='space-y-2'>
                    <label className='text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center space-x-2'>
                      <FaFolder className='w-4 h-4 text-gray-500' />
                      <span>Category</span>
                    </label>
                    <select
                      onChange={handleChange}
                      value={sidebarData.category}
                      id='category'
                      className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 bg-gray-50 dark:bg-gray-700 hover:bg-white dark:hover:bg-gray-600'
                    >
                      <option value='uncategorized'>All Categories</option>
                      <option value='technology'>Technology</option>
                      <option value='programming'>Programming</option>
                      <option value='design'>Design</option>
                      <option value='business'>Business</option>
                      <option value='lifestyle'>Lifestyle</option>
                      <option value='tutorial'>Tutorial</option>
                      <option value='news'>News</option>
                      <option value='marketing'>Marketing</option>
                      <option value='health'>Health</option>
                      <option value='science'>Science</option>
                      <option value='history'>History</option>
                      <option value='art'>Art</option>
                      <option value='music'>Music</option>
                    </select>
                  </div>

                  {/* Search Button */}
                  <button
                    type='submit'
                    className='w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2'
                  >
                    <FaSearch className='w-4 h-4' />
                    <span>Search Posts</span>
                  </button>
                </form>
              </div>
            </div>

            {/* Main Content - Blog Posts */}
            <div className='flex-1'>
              <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden'>
                <div className='bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700'>
                  <div className='flex items-center justify-between'>
                    <h2 className='text-xl font-semibold text-gray-900 dark:text-white flex items-center space-x-2'>
                      <FaEye className='w-4 h-4 text-gray-600 dark:text-gray-400' />
                      <span>All Posts</span>
                    </h2>
                    <div className='bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm font-medium px-3 py-1 rounded-full'>
                      {posts.length} {posts.length === 1 ? 'post' : 'posts'}
                    </div>
                  </div>
                </div>

                <div className='p-6'>
                  {/* Loading State */}
                  {loading && (
                    <div className='flex items-center justify-center py-12'>
                      <div className='flex items-center space-x-3'>
                        <FaSpinner className='w-6 h-6 text-blue-600 animate-spin' />
                        <span className='text-gray-600 dark:text-gray-400 text-lg'>Loading posts...</span>
                      </div>
                    </div>
                  )}

                  {/* No Posts State */}
                  {!loading && posts.length === 0 && (
                    <div className='text-center py-12'>
                      <div className='w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6'>
                        <FaTimes className='w-12 h-12 text-gray-400 dark:text-gray-500' />
                      </div>
                      <h3 className='text-2xl font-semibold text-gray-900 dark:text-white mb-4'>
                        No posts found
                      </h3>
                      <p className='text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6'>
                        Be the first to create amazing content for our community!
                      </p>
                      <Link to='/create-post'>
                        <button className='bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl'>
                          Create Your First Post
                        </button>
                      </Link>
                    </div>
                  )}

                  {/* Blog Posts Grid */}
                  {!loading && posts.length > 0 && (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                      {posts.map((post) => (
                        <PostCard key={post._id} post={post} />
                      ))}
                    </div>
                  )}

                  {/* Show More Button */}
                  {showMore && (
                    <div className='text-center mt-8 pt-6 border-t border-gray-200 dark:border-gray-700'>
                      <button
                        onClick={handleShowMore}
                        className='bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2 mx-auto'
                      >
                        <FaEye className='w-4 h-4' />
                        <span>Load More Posts</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 