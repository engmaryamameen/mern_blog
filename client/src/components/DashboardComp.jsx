import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  HiAnnotation,
  HiArrowNarrowUp,
  HiDocumentText,
  HiOutlineUserGroup,
} from 'react-icons/hi';
import { Button, Table } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { FaUsers, FaComments, FaFileAlt, FaEye, FaCalendar, FaUser, FaHeart, FaFolder, FaExternalLinkAlt } from 'react-icons/fa';

export default function DashboardComp() {
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [lastMonthUsers, setLastMonthUsers] = useState(0);
  const [lastMonthPosts, setLastMonthPosts] = useState(0);
  const [lastMonthComments, setLastMonthComments] = useState(0);
  const { currentUser } = useSelector((state) => state.user);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/user/getusers?limit=5');
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          setTotalUsers(data.totalUsers);
          setLastMonthUsers(data.lastMonthUsers);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/post/getposts?limit=5');
        const data = await res.json();
        if (res.ok) {
          setPosts(data.posts);
          setTotalPosts(data.totalPosts);
          setLastMonthPosts(data.lastMonthPosts);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    const fetchComments = async () => {
      try {
        const res = await fetch('/api/comment/getcomments?limit=5');
        const data = await res.json();
        if (res.ok) {
          setComments(data.comments);
          setTotalComments(data.totalComments);
          setLastMonthComments(data.lastMonthComments);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchUsers();
      fetchPosts();
      fetchComments();
    }
  }, [currentUser]);
  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6'>
      <div className='max-w-7xl mx-auto'>
        {/* Header Section */}
        <div className='bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-gray-800 dark:via-black dark:to-gray-900 rounded-2xl shadow-xl mb-8 overflow-hidden'>
          <div className='px-8 py-8 text-white'>
            <div className='flex items-center space-x-4 mb-4'>
              <div className='w-16 h-16 bg-white/20 dark:bg-gradient-to-br dark:from-blue-500 dark:to-purple-600 rounded-full flex items-center justify-center backdrop-blur-sm'>
                <FaEye className='w-8 h-8 text-white' />
              </div>
              <div>
                <h1 className='text-3xl font-bold'>Dashboard Overview</h1>
                <p className='text-blue-100 dark:text-gray-300 text-lg'>Monitor your blog's performance and recent activities</p>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className='flex items-center space-x-6 text-sm'>
              <div className='flex items-center space-x-2'>
                <FaUsers className='w-4 h-4 text-blue-200 dark:text-blue-400' />
                <span className='text-blue-100 dark:text-gray-300'>{totalUsers} total users</span>
              </div>
              <div className='flex items-center space-x-2'>
                <FaFileAlt className='w-4 h-4 text-green-200 dark:text-green-400' />
                <span className='text-blue-100 dark:text-gray-300'>{totalPosts} total posts</span>
              </div>
              <div className='flex items-center space-x-2'>
                <FaComments className='w-4 h-4 text-purple-200 dark:text-purple-400' />
                <span className='text-blue-100 dark:text-gray-300'>{totalComments} total comments</span>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'>
          {/* Total Users Card */}
          <div className='bg-white/80 dark:bg-gray-800 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105'>
            <div className='p-6'>
              <div className='flex items-center justify-between mb-4'>
                <div>
                  <h3 className='text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide'>Total Users</h3>
                  <p className='text-3xl font-bold text-gray-900 dark:text-white mt-2'>{totalUsers}</p>
                </div>
                <div className='w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center shadow-lg'>
                  <FaUsers className='w-8 h-8 text-white' />
                </div>
              </div>
              <div className='flex items-center space-x-2 text-sm'>
                <div className='flex items-center space-x-1 text-green-600 dark:text-green-400'>
                  <HiArrowNarrowUp className='w-4 h-4' />
                  <span className='font-medium'>{lastMonthUsers}</span>
                </div>
                <span className='text-gray-500 dark:text-gray-400'>from last month</span>
              </div>
            </div>
          </div>

          {/* Total Comments Card */}
          <div className='bg-white/80 dark:bg-gray-800 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105'>
            <div className='p-6'>
              <div className='flex items-center justify-between mb-4'>
                <div>
                  <h3 className='text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide'>Total Comments</h3>
                  <p className='text-3xl font-bold text-gray-900 dark:text-white mt-2'>{totalComments}</p>
                </div>
                <div className='w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg'>
                  <FaComments className='w-8 h-8 text-white' />
                </div>
              </div>
              <div className='flex items-center space-x-2 text-sm'>
                <div className='flex items-center space-x-1 text-green-600 dark:text-green-400'>
                  <HiArrowNarrowUp className='w-4 h-4' />
                  <span className='font-medium'>{lastMonthComments}</span>
                </div>
                <span className='text-gray-500 dark:text-gray-400'>from last month</span>
              </div>
            </div>
          </div>

          {/* Total Posts Card */}
          <div className='bg-white/80 dark:bg-gray-800 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105'>
            <div className='p-6'>
              <div className='flex items-center justify-between mb-4'>
                <div>
                  <h3 className='text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide'>Total Posts</h3>
                  <p className='text-3xl font-bold text-gray-900 dark:text-white mt-2'>{totalPosts}</p>
                </div>
                <div className='w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg'>
                  <FaFileAlt className='w-8 h-8 text-white' />
                </div>
              </div>
              <div className='flex items-center space-x-2 text-sm'>
                <div className='flex items-center space-x-1 text-green-600 dark:text-green-400'>
                  <HiArrowNarrowUp className='w-4 h-4' />
                  <span className='font-medium'>{lastMonthPosts}</span>
                </div>
                <span className='text-gray-500 dark:text-gray-400'>from last month</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Recent Users */}
          <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden'>
            <div className='bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 px-6 py-4 border-b border-gray-200 dark:border-gray-700'>
              <div className='flex items-center justify-between'>
                <h3 className='text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2'>
                  <FaUsers className='w-4 h-4 text-blue-600 dark:text-blue-400' />
                  <span>Recent Users</span>
                </h3>
                <Link to={'/dashboard?tab=users'}>
                  <button className='bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm font-medium px-3 py-1 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors duration-200 flex items-center space-x-1'>
                    <span>See all</span>
                    <FaExternalLinkAlt className='w-3 h-3' />
                  </button>
                </Link>
              </div>
            </div>
            
            <div className='p-6'>
              {users && users.length > 0 ? (
                <div className='space-y-4'>
                  {users.map((user) => (
                    <div key={user._id} className='flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200'>
                      <div className='relative'>
                        <img
                          src={user.profilePicture}
                          alt={user.username}
                          className='w-12 h-12 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600 shadow-sm'
                        />
                        <div className='absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white'></div>
                      </div>
                      <div className='flex-1 min-w-0'>
                        <h4 className='text-sm font-semibold text-gray-900 dark:text-white truncate'>
                          {user.username}
                        </h4>
                        <p className='text-xs text-gray-500 dark:text-gray-400'>
                          Joined {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      {user.isAdmin && (
                        <span className='bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs font-medium px-2 py-1 rounded-full'>
                          Admin
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className='text-center py-8'>
                  <div className='w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4'>
                    <FaUsers className='w-8 h-8 text-gray-400 dark:text-gray-500' />
                  </div>
                  <p className='text-gray-500 dark:text-gray-400 text-sm'>No recent users</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Comments */}
          <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden'>
            <div className='bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 px-6 py-4 border-b border-gray-200 dark:border-gray-700'>
              <div className='flex items-center justify-between'>
                <h3 className='text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2'>
                  <FaComments className='w-4 h-4 text-purple-600 dark:text-purple-400' />
                  <span>Recent Comments</span>
                </h3>
                <Link to={'/dashboard?tab=comments'}>
                  <button className='bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-sm font-medium px-3 py-1 rounded-full hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors duration-200 flex items-center space-x-1'>
                    <span>See all</span>
                    <FaExternalLinkAlt className='w-3 h-3' />
                  </button>
                </Link>
              </div>
            </div>
            
            <div className='p-6'>
              {comments && comments.length > 0 ? (
                <div className='space-y-4'>
                  {comments.map((comment) => (
                    <div key={comment._id} className='p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200'>
                      <div className='flex items-start space-x-3'>
                        <div className='w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center flex-shrink-0'>
                          <FaComments className='w-4 h-4 text-purple-600 dark:text-purple-400' />
                        </div>
                        <div className='flex-1 min-w-0'>
                          <p className='text-sm text-gray-900 dark:text-white line-clamp-2 mb-2'>
                            {comment.content}
                          </p>
                          <div className='flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400'>
                            <span className='flex items-center space-x-1'>
                              <FaHeart className='w-3 h-3' />
                              <span>{comment.numberOfLikes} likes</span>
                            </span>
                            <span className='flex items-center space-x-1'>
                              <FaCalendar className='w-3 h-3' />
                              <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className='text-center py-8'>
                  <div className='w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4'>
                    <FaComments className='w-8 h-8 text-gray-400 dark:text-gray-500' />
                  </div>
                  <p className='text-gray-500 dark:text-gray-400 text-sm'>No recent comments</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Posts */}
          <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden'>
            <div className='bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 px-6 py-4 border-b border-gray-200 dark:border-gray-700'>
              <div className='flex items-center justify-between'>
                <h3 className='text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2'>
                  <FaFileAlt className='w-4 h-4 text-green-600 dark:text-green-400' />
                  <span>Recent Posts</span>
                </h3>
                <Link to={'/dashboard?tab=posts'}>
                  <button className='bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-sm font-medium px-3 py-1 rounded-full hover:bg-green-200 dark:hover:bg-green-800 transition-colors duration-200 flex items-center space-x-1'>
                    <span>See all</span>
                    <FaExternalLinkAlt className='w-3 h-3' />
                  </button>
                </Link>
              </div>
            </div>
            
            <div className='p-6'>
              {posts && posts.length > 0 ? (
                <div className='space-y-4'>
                  {posts.map((post) => (
                    <div key={post._id} className='p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200'>
                      <div className='flex items-start space-x-3'>
                        <img
                          src={post.image}
                          alt={post.title}
                          className='w-12 h-8 rounded-lg object-cover flex-shrink-0 shadow-sm'
                        />
                        <div className='flex-1 min-w-0'>
                          <h4 className='text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2'>
                            {post.title}
                          </h4>
                          <div className='flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400'>
                            <span className='flex items-center space-x-1'>
                              <FaFolder className='w-3 h-3' />
                              <span className='capitalize'>{post.category}</span>
                            </span>
                            <span className='flex items-center space-x-1'>
                              <FaCalendar className='w-3 h-3' />
                              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className='text-center py-8'>
                  <div className='w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4'>
                    <FaFileAlt className='w-8 h-8 text-gray-400 dark:text-gray-500' />
                  </div>
                  <p className='text-gray-500 dark:text-gray-400 text-sm'>No recent posts</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
