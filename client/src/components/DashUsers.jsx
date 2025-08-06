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
  Switch,
  FormControlLabel
} from '@mui/material';
import { 
  Delete as DeleteIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  AdminPanelSettings as AdminIcon,
  VerifiedUser as VerifiedIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';

export default function DashUsers() {
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState('');
  const [loading, setLoading] = useState(true);
  
  const isDarkMode = theme === 'dark';

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/user/getusers`);
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          if (data.users.length < 9) {
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
      fetchUsers();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = users.length;
    try {
      const res = await fetch(`/api/user/getusers?startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => [...prev, ...data.users]);
        if (data.users.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteUser = async () => {
    try {
        const res = await fetch(`/api/user/delete/${userIdToDelete}`, {
            method: 'DELETE',
        });
        const data = await res.json();
        if (res.ok) {
            setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete));
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
              <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>Users Management</h1>
              <p className='text-gray-600 dark:text-gray-400 mt-2'>Monitor and manage all registered users</p>
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
              {users && users.length > 0 ? (
                <div className='bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700 overflow-hidden'>
                  {/* Table Header */}
                  <div className='bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 px-6 py-4'>
                    <h2 className='text-xl font-semibold text-white'>All Users</h2>
                  </div>

                  {/* Users Table */}
                  <TableContainer component={Paper} sx={{ 
                    boxShadow: 'none', 
                    border: `1px solid ${isDarkMode ? 'rgba(75, 85, 99, 0.5)' : '#e5e7eb'}`,
                    backgroundColor: 'transparent'
                  }}>
                    <Table sx={{ minWidth: 650 }} aria-label="users table">
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
                              <Typography variant="subtitle2" sx={{ color: isDarkMode ? 'rgb(243, 244, 246)' : 'rgb(55, 65, 81)' }}>Join Date</Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box display="flex" alignItems="center" gap={1}>
                              <PersonIcon fontSize="small" sx={{ color: isDarkMode ? 'rgb(156, 163, 175)' : 'rgb(107, 114, 128)' }} />
                              <Typography variant="subtitle2" sx={{ color: isDarkMode ? 'rgb(243, 244, 246)' : 'rgb(55, 65, 81)' }}>Profile</Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box display="flex" alignItems="center" gap={1}>
                              <PersonIcon fontSize="small" sx={{ color: isDarkMode ? 'rgb(156, 163, 175)' : 'rgb(107, 114, 128)' }} />
                              <Typography variant="subtitle2" sx={{ color: isDarkMode ? 'rgb(243, 244, 246)' : 'rgb(55, 65, 81)' }}>Username</Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box display="flex" alignItems="center" gap={1}>
                              <EmailIcon fontSize="small" sx={{ color: isDarkMode ? 'rgb(156, 163, 175)' : 'rgb(107, 114, 128)' }} />
                              <Typography variant="subtitle2" sx={{ color: isDarkMode ? 'rgb(243, 244, 246)' : 'rgb(55, 65, 81)' }}>Email</Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box display="flex" alignItems="center" gap={1}>
                              <AdminIcon fontSize="small" sx={{ color: isDarkMode ? 'rgb(156, 163, 175)' : 'rgb(107, 114, 128)' }} />
                              <Typography variant="subtitle2" sx={{ color: isDarkMode ? 'rgb(243, 244, 246)' : 'rgb(55, 65, 81)' }}>Role</Typography>
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
                        {users.map((user) => (
                          <TableRow
                            key={user._id}
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
                                {new Date(user.createdAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Avatar
                                src={user.profilePicture}
                                alt={user.username}
                                sx={{ 
                                  width: 48, 
                                  height: 48,
                                  border: `2px solid ${isDarkMode ? 'rgba(75, 85, 99, 0.5)' : '#e5e7eb'}`
                                }}
                              >
                                {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                              </Avatar>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body1" sx={{ 
                                fontWeight: 500,
                                color: isDarkMode ? 'rgb(255, 255, 255)' : 'rgb(17, 24, 39)'
                              }}>
                                {user.username}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" sx={{ 
                                color: isDarkMode ? 'rgb(156, 163, 175)' : 'rgb(107, 114, 128)' 
                              }}>
                                {user.email}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              {user.isAdmin ? (
                                <Chip
                                  icon={<VerifiedIcon />}
                                  label="Admin"
                                  size="small"
                                  sx={{
                                    backgroundColor: isDarkMode ? '#065f46' : '#dcfce7',
                                    color: isDarkMode ? '#6ee7b7' : '#166534',
                                    fontWeight: 500
                                  }}
                                />
                              ) : (
                                <Chip
                                  icon={<PersonIcon />}
                                  label="User"
                                  size="small"
                                  sx={{
                                    backgroundColor: isDarkMode ? '#374151' : '#f3f4f6',
                                    color: isDarkMode ? '#d1d5db' : '#374151',
                                    fontWeight: 500
                                  }}
                                />
                              )}
                            </TableCell>
                            <TableCell>
                              <Tooltip title="Delete User">
                                <IconButton
                                  onClick={() => {
                                    setShowModal(true);
                                    setUserIdToDelete(user._id);
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
                        Show More Users
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center'>
                  <div className='text-gray-400 dark:text-gray-500 mb-4'>
                    <PersonIcon sx={{ fontSize: 64 }} />
                  </div>
                  <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-2'>
                    No Users Found
                  </h3>
                  <p className='text-gray-600 dark:text-gray-400'>
                    Users will appear here once they register on your platform.
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
              Are you sure you want to delete this user?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDeleteUser}>
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
