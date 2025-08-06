import { Modal, Button } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { FaCheck, FaTimes, FaCrown } from 'react-icons/fa';
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
  Box,
  Divider
} from '@mui/material';
import { 
  Delete as DeleteIcon,
  CalendarToday as CalendarIcon,
  Favorite as FavoriteIcon,
  Person as PersonIcon,
  Article as ArticleIcon,
  Comment as CommentIcon
} from '@mui/icons-material';

export default function DashComments() {
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const [comments, setComments] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState('');
  const [loading, setLoading] = useState(true);
  
  const isDarkMode = theme === 'dark';

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/comment/getcomments`);
        const data = await res.json();
        if (res.ok) {
          setComments(data.comments);
          if (data.comments.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    };
    if (currentUser && currentUser._id) {
      fetchComments();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = comments.length;
    try {
      const res = await fetch(
        `/api/comment/getcomments?startIndex=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        setComments((prev) => [...prev, ...data.comments]);
        if (data.comments.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteComment = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `/api/comment/deleteComment/${commentIdToDelete}`,
        {
          method: 'DELETE',
        }
      );
      const data = await res.json();
      if (res.ok) {
        setComments((prev) =>
          prev.filter((comment) => comment._id !== commentIdToDelete)
        );
        setShowModal(false);
      } else {
        console.log(data.message);
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
              <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>Comments Management</h1>
              <p className='text-gray-600 dark:text-gray-400 mt-2'>Monitor and manage all blog comments</p>
            </div>
          </div>
        </div>
        {/* Content Section */}
        <div className='max-w-7xl mx-auto'>
          {loading ? (
            <div className='flex justify-center items-center py-12'>
              <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
            </div>
          ) : (
            <>
              {comments && comments.length > 0 ? (
                <div className='bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700 overflow-hidden'>
                  {/* Table Header */}
                  <div className='bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 px-6 py-4'>
                    <h2 className='text-xl font-semibold text-white'>All Comments</h2>
                  </div>

                  {/* Comments Table */}
                  <TableContainer 
                    component={Paper} 
                    sx={{ 
                      boxShadow: 'none', 
                      border: '1px solid',
                      borderColor: isDarkMode ? 'rgba(75, 85, 99, 0.5)' : 'rgba(229, 231, 235, 0.5)',
                      backgroundColor: 'transparent',
                      '& .MuiPaper-root': {
                        backgroundColor: 'transparent',
                        boxShadow: 'none'
                      }
                    }}
                  >
                    <Table sx={{ minWidth: 650 }} aria-label="comments table">
                      <TableHead sx={{ 
                        backgroundColor: isDarkMode ? 'rgba(31, 41, 55, 0.8)' : 'rgba(248, 250, 252, 0.8)',
                        '& .MuiTableCell-root': {
                          borderBottom: `1px solid ${isDarkMode ? 'rgba(75, 85, 99, 0.5)' : 'rgba(229, 231, 235, 0.5)'}`
                        }
                      }}>
                        <TableRow>
                          <TableCell sx={{ 
                            fontWeight: 'bold', 
                            color: isDarkMode ? 'rgb(243, 244, 246)' : 'rgb(55, 65, 81)',
                            '& .MuiTypography-root': {
                              color: isDarkMode ? 'rgb(243, 244, 246)' : 'rgb(55, 65, 81)'
                            }
                          }}>
                            <Box display="flex" alignItems="center" gap={1}>
                              <CalendarIcon fontSize="small" sx={{ color: isDarkMode ? 'rgb(156, 163, 175)' : 'rgb(107, 114, 128)' }} />
                              <Typography variant="subtitle2">Date</Typography>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ 
                            fontWeight: 'bold', 
                            color: isDarkMode ? 'rgb(243, 244, 246)' : 'rgb(55, 65, 81)',
                            '& .MuiTypography-root': {
                              color: isDarkMode ? 'rgb(243, 244, 246)' : 'rgb(55, 65, 81)'
                            }
                          }}>
                            <Box display="flex" alignItems="center" gap={1}>
                              <PersonIcon fontSize="small" sx={{ color: isDarkMode ? 'rgb(156, 163, 175)' : 'rgb(107, 114, 128)' }} />
                              <Typography variant="subtitle2">User</Typography>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ 
                            fontWeight: 'bold', 
                            color: isDarkMode ? 'rgb(243, 244, 246)' : 'rgb(55, 65, 81)',
                            '& .MuiTypography-root': {
                              color: isDarkMode ? 'rgb(243, 244, 246)' : 'rgb(55, 65, 81)'
                            }
                          }}>
                            <Box display="flex" alignItems="center" gap={1}>
                              <CommentIcon fontSize="small" sx={{ color: isDarkMode ? 'rgb(156, 163, 175)' : 'rgb(107, 114, 128)' }} />
                              <Typography variant="subtitle2">Comment</Typography>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ 
                            fontWeight: 'bold', 
                            color: isDarkMode ? 'rgb(243, 244, 246)' : 'rgb(55, 65, 81)',
                            '& .MuiTypography-root': {
                              color: isDarkMode ? 'rgb(243, 244, 246)' : 'rgb(55, 65, 81)'
                            }
                          }}>
                            <Box display="flex" alignItems="center" gap={1}>
                              <ArticleIcon fontSize="small" sx={{ color: isDarkMode ? 'rgb(156, 163, 175)' : 'rgb(107, 114, 128)' }} />
                              <Typography variant="subtitle2">Post</Typography>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ 
                            fontWeight: 'bold', 
                            color: isDarkMode ? 'rgb(243, 244, 246)' : 'rgb(55, 65, 81)',
                            '& .MuiTypography-root': {
                              color: isDarkMode ? 'rgb(243, 244, 246)' : 'rgb(55, 65, 81)'
                            }
                          }}>
                            <Box display="flex" alignItems="center" gap={1}>
                              <FavoriteIcon fontSize="small" sx={{ color: isDarkMode ? 'rgb(156, 163, 175)' : 'rgb(107, 114, 128)' }} />
                              <Typography variant="subtitle2">Likes</Typography>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ 
                            fontWeight: 'bold', 
                            color: isDarkMode ? 'rgb(243, 244, 246)' : 'rgb(55, 65, 81)'
                          }}>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {comments.map((comment) => (
                          <TableRow
                            key={comment._id}
                            sx={{ 
                              '&:hover': { 
                                backgroundColor: isDarkMode ? 'rgba(55, 65, 81, 0.8)' : 'rgba(249, 250, 251, 0.8)' 
                              },
                              transition: 'background-color 0.2s',
                              '& .MuiTableCell-root': {
                                borderBottom: `1px solid ${isDarkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(229, 231, 235, 0.3)'}`,
                                color: isDarkMode ? 'rgb(243, 244, 246)' : 'rgb(55, 65, 81)'
                              }
                            }}
                          >
                            <TableCell>
                              <Typography variant="body2" sx={{ 
                                color: isDarkMode ? 'rgb(209, 213, 219)' : 'rgb(75, 85, 99)' 
                              }}>
                                {new Date(comment.updatedAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Box display="flex" alignItems="center" gap={2}>
                                <Avatar
                                  sx={{ 
                                    width: 32, 
                                    height: 32,
                                    bgcolor: '#3b82f6'
                                  }}
                                >
                                  {comment.userId ? comment.userId.charAt(0).toUpperCase() : 'U'}
                                </Avatar>
                                <Typography variant="body2" sx={{ 
                                  fontWeight: 500,
                                  color: isDarkMode ? 'rgb(255, 255, 255)' : 'rgb(17, 24, 39)'
                                }}>
                                  {comment.userId || 'Anonymous'}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  maxWidth: 300,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                  color: isDarkMode ? 'rgb(255, 255, 255)' : 'rgb(17, 24, 39)'
                                }}
                              >
                                {comment.content}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={comment.postId || 'Unknown Post'}
                                size="small"
                                sx={{
                                  backgroundColor: isDarkMode ? '#374151' : '#fef3c7',
                                  color: isDarkMode ? '#fbbf24' : '#92400e',
                                  fontWeight: 500,
                                  maxWidth: 150,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis'
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <Box display="flex" alignItems="center" gap={1}>
                                <FavoriteIcon fontSize="small" sx={{ color: '#ef4444' }} />
                                <Typography variant="body2" sx={{ 
                                  fontWeight: 500,
                                  color: isDarkMode ? 'rgb(255, 255, 255)' : 'rgb(17, 24, 39)'
                                }}>
                                  {comment.numberOfLikes || 0}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Tooltip title="Delete Comment">
                                <IconButton
                                  onClick={() => {
                                    setShowModal(true);
                                    setCommentIdToDelete(comment._id);
                                  }}
                                  size="small"
                                  sx={{ color: '#ef4444' }}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  {/* Show More Button */}
                  {showMore && (
                    <div className='p-6 text-center'>
                      <button
                        onClick={handleShowMore}
                        className='bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105'
                      >
                        Show More Comments
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                                  <div className='bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700 p-8 text-center'>
                  <div className='text-gray-400 dark:text-gray-500 mb-4'>
                    <CommentIcon sx={{ fontSize: 64 }} />
                  </div>
                  <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-2'>
                    No Comments Yet
                  </h3>
                  <p className='text-gray-600 dark:text-gray-400'>
                    Comments will appear here once users start engaging with your posts.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Delete Modal */}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size='md'
      >
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
              Are you sure you want to delete this comment?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDeleteComment}>
                Yes, I'm sure
              </Button>
              <Button color='gray' onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
