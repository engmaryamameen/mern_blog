import { Modal, Button } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { FaPlus, FaEdit, FaTrash, FaEye, FaCalendar, FaFolder } from 'react-icons/fa';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Avatar,
  Typography,
  Box
} from '@mui/material';
import { 
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CalendarToday as CalendarIcon,
  Folder as FolderIcon
} from '@mui/icons-material';

export default function DashPosts() {
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const [userPosts, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState(null);
  
  const isDarkMode = theme === 'dark';


  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        console.log('Fetching posts for user:', currentUser._id);
        const res = await fetch(`/api/post/getposts`);
        const data = await res.json();
        console.log('Posts response:', data);

        setUserPosts(data.posts);
        console.log('User posts:', data.posts);
        console.log('Posts length:', data.posts ? data.posts.length : 'no posts');
        if (data.posts && data.posts.length < 9) {
          setShowMore(false);
        }
      } catch (error) {
        console.log('Error fetching posts:', error.message);
      } finally {
        setLoading(false);
      }
    };

    // Fetch posts for any authenticated user, not just admins
    if (currentUser && currentUser._id) {
      fetchPosts();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = userPosts.length;
    try {
      const res = await fetch(
        `/api/post/getposts?startIndex=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        setUserPosts((prev) => [...prev, ...data.posts]);
        if (data.posts.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeletePost = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `/api/post/deletepost/${postIdToDelete}/${currentUser._id}`,
        {
          method: 'DELETE',
        }
      );
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setUserPosts((prev) =>
          prev.filter((post) => post._id !== postIdToDelete)
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900'>
      <div className='p-6'>
        {/* Header Section */}
        <div className='max-w-7xl mx-auto mb-8'>
          <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
            <div>
              <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>Posts Management</h1>
              <p className='text-gray-600 dark:text-gray-400 mt-2'>Create, edit, and manage your blog posts</p>
            </div>


          </div>
        </div>

        {/* Content Section */}
        <div className='max-w-7xl mx-auto'>
          
          {loading ? (
            <div className='flex items-center justify-center py-12'>
              <div className='w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin'></div>
              <span className='ml-3 text-gray-600 dark:text-gray-400'>Loading posts...</span>
            </div>
          ) : currentUser.isAdmin ? (
            true ? (
              <div className='bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700 overflow-hidden'>
                {/* Table Header */}
                <div className='bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 px-6 py-4'>
                  <h2 className='text-xl font-semibold text-white'>All Posts</h2>
                </div>
               
                                               {/* Posts Table */}
                <TableContainer component={Paper} sx={{ 
                  boxShadow: 'none', 
                  border: `1px solid ${isDarkMode ? 'rgba(75, 85, 99, 0.5)' : '#e5e7eb'}`,
                  backgroundColor: 'transparent'
                }}>
                  <Table sx={{ minWidth: 650 }} aria-label="posts table">
                    <TableHead sx={{ 
                      backgroundColor: isDarkMode ? 'rgba(31, 41, 55, 0.8)' : 'rgba(248, 250, 252, 0.8)',
                      '& .MuiTableCell-root': {
                        borderBottom: `1px solid ${isDarkMode ? 'rgba(75, 85, 99, 0.5)' : 'rgba(229, 231, 235, 0.5)'}`,
                        color: isDarkMode ? 'rgb(243, 244, 246)' : 'rgb(55, 65, 81)',
                        fontWeight: 'bold'
                      }
                    }}>
                      <TableRow>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1}>
                            <CalendarIcon fontSize="small" sx={{ color: isDarkMode ? 'rgb(156, 163, 175)' : 'rgb(107, 114, 128)' }} />
                            <Typography variant="subtitle2" sx={{ color: isDarkMode ? 'rgb(243, 244, 246)' : 'rgb(55, 65, 81)' }}>Date Updated</Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ color: isDarkMode ? 'rgb(243, 244, 246)' : 'rgb(55, 65, 81)' }}>Post Image</TableCell>
                        <TableCell sx={{ color: isDarkMode ? 'rgb(243, 244, 246)' : 'rgb(55, 65, 81)' }}>Post Title</TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1}>
                            <FolderIcon fontSize="small" sx={{ color: isDarkMode ? 'rgb(156, 163, 175)' : 'rgb(107, 114, 128)' }} />
                            <Typography variant="subtitle2" sx={{ color: isDarkMode ? 'rgb(243, 244, 246)' : 'rgb(55, 65, 81)' }}>Category</Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ color: isDarkMode ? 'rgb(243, 244, 246)' : 'rgb(55, 65, 81)' }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody sx={{
                      '& .MuiTableCell-root': {
                        borderBottom: `1px solid ${isDarkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(229, 231, 235, 0.3)'}`,
                        color: isDarkMode ? 'rgb(243, 244, 246)' : 'rgb(55, 65, 81)'
                      }
                    }}>
                      {userPosts && userPosts.length > 0 ? (
                        userPosts.map((post) => (
                          <TableRow
                            key={post._id}
                            sx={{ 
                              '&:hover': { 
                                backgroundColor: isDarkMode ? 'rgba(55, 65, 81, 0.8)' : 'rgba(249, 250, 251, 0.8)'
                              },
                              transition: 'background-color 0.2s'
                            }}
                          >
                            <TableCell>
                              <Typography variant="body2" sx={{ 
                                color: isDarkMode ? 'rgb(156, 163, 175)' : 'rgb(107, 114, 128)' 
                              }}>
                                {new Date(post.updatedAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Link to={`/post/${post.slug}`}>
                                <Avatar
                                  src={post.image}
                                  alt={post.title}
                                  variant="rounded"
                                  sx={{ 
                                    width: 80, 
                                    height: 48,
                                    cursor: 'pointer',
                                    '&:hover': { transform: 'scale(1.05)' },
                                    transition: 'transform 0.2s'
                                  }}
                                />
                              </Link>
                            </TableCell>
                            <TableCell>
                              <Link to={`/post/${post.slug}`} style={{ textDecoration: 'none' }}>
                                <Typography 
                                  variant="body1" 
                                  sx={{ 
                                    fontWeight: 500,
                                    color: isDarkMode ? 'rgb(255, 255, 255)' : 'rgb(17, 24, 39)',
                                    '&:hover': { color: '#3b82f6' },
                                    transition: 'color 0.2s',
                                    cursor: 'pointer'
                                  }}
                                >
                                  {post.title}
                                </Typography>
                              </Link>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={post.category}
                                size="small"
                                sx={{
                                  backgroundColor: isDarkMode ? '#374151' : '#dbeafe',
                                  color: isDarkMode ? '#93c5fd' : '#1e40af',
                                  fontWeight: 500,
                                  textTransform: 'capitalize'
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <Box display="flex" gap={1}>
                                <Tooltip title="View Post">
                                  <IconButton
                                    component={Link}
                                    to={`/post/${post.slug}`}
                                    size="small"
                                    sx={{ color: '#3b82f6' }}
                                  >
                                    <VisibilityIcon />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Edit Post">
                                  <IconButton
                                    onClick={() => {
                                      // Navigate to dashboard with update-post tab and post ID
                                      window.location.href = `/dashboard?tab=update-post&postId=${post._id}`;
                                    }}
                                    size="small"
                                    sx={{ color: '#10b981' }}
                                  >
                                    <EditIcon />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete Post">
                                  <IconButton
                                    onClick={() => {
                                      setShowModal(true);
                                      setPostIdToDelete(post._id);
                                    }}
                                    size="small"
                                    sx={{ color: '#ef4444' }}
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </Tooltip>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                            <Typography variant="body1" sx={{ 
                              color: isDarkMode ? 'rgb(156, 163, 175)' : 'rgb(107, 114, 128)' 
                            }}>
                              No posts found in the table
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                {/* Show More Button */}
                {showMore && (
                  <div className='px-6 py-4 border-t border-gray-200 dark:border-gray-700'>
                    <button
                      onClick={handleShowMore}
                      className='w-full text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium py-3 transition-colors duration-200'
                    >
                      Show more posts
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Empty State */
              <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 text-center'>
                <div className='w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6'>
                  <FaPlus className='w-12 h-12 text-gray-400 dark:text-gray-500' />
                </div>
                <h3 className='text-2xl font-semibold text-gray-900 dark:text-white mb-4'>
                  No posts yet!
                </h3>
                <p className='text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto'>
                  Start creating amazing content for your blog. Your first post is just a click away.
                </p>
                <Link to='/create-post'>
                  <button className='bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium px-8 py-3 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2 mx-auto'>
                    <FaPlus className='w-4 h-4' />
                    <span>Create Your First Post</span>
                  </button>
                </Link>
              </div>
            )
          ) : (
            /* Not Admin State */
            <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 text-center'>
              <div className='w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6'>
                <FaTimes className='w-12 h-12 text-red-400 dark:text-red-500' />
              </div>
              <h3 className='text-2xl font-semibold text-gray-900 dark:text-white mb-4'>
                Access Denied
              </h3>
              <p className='text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto'>
                You need admin privileges to access the posts management section.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size='md'
      >
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <div className='w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4'>
              <HiOutlineExclamationCircle className='h-8 w-8 text-red-600 dark:text-red-400' />
            </div>
            <h3 className='mb-4 text-xl font-semibold text-gray-900 dark:text-white'>
              Delete Post
            </h3>
            <p className='mb-6 text-gray-600 dark:text-gray-400'>
              Are you sure you want to delete this post? This action cannot be undone.
            </p>
            <div className='flex justify-center gap-4'>
              <Button
                color='failure'
                onClick={handleDeletePost}
                className='bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg'
              >
                Yes, Delete Post
              </Button>
              <Button
                color='gray'
                onClick={() => setShowModal(false)}
                className='bg-gray-600 hover:bg-gray-700 px-6 py-2 rounded-lg'
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
