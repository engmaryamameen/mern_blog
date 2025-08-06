import { Alert, Button, Modal, TextInput, Textarea } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Comment from './Comment';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { FaUser, FaComment, FaPaperPlane, FaSignInAlt } from 'react-icons/fa';

export default function CommentSection({ postId }) {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState('');
  const [commentError, setCommentError] = useState(null);
  const [comments, setComments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment.length > 200) {
      return;
    }
    try {
      const res = await fetch('/api/comment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: comment,
          postId,
          userId: currentUser._id,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setComment('');
        setCommentError(null);
        setComments([data, ...comments]);
      }
    } catch (error) {
      setCommentError(error.message);
    }
  };

  useEffect(() => {
    const getComments = async () => {
      try {
        const res = await fetch(`/api/comment/getPostComments/${postId}`);
        if (res.ok) {
          const data = await res.json();
          setComments(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    getComments();
  }, [postId]);

  const handleLike = async (commentId) => {
    try {
      if (!currentUser) {
        navigate('/sign-in');
        return;
      }
      const res = await fetch(`/api/comment/likeComment/${commentId}`, {
        method: 'PUT',
      });
      if (res.ok) {
        const data = await res.json();
        setComments(
          comments.map((comment) =>
            comment._id === commentId
              ? {
                  ...comment,
                  likes: data.likes,
                  numberOfLikes: data.likes.length,
                }
              : comment
          )
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleEdit = async (comment, editedContent) => {
    setComments(
      comments.map((c) =>
        c._id === comment._id ? { ...c, content: editedContent } : c
      )
    );
  };

  const handleDelete = async (commentId) => {
    setShowModal(false);
    try {
      if (!currentUser) {
        navigate('/sign-in');
        return;
      }
      const res = await fetch(`/api/comment/deleteComment/${commentId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        const data = await res.json();
        setComments(comments.filter((comment) => comment._id !== commentId));
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className='max-w-4xl mx-auto w-full p-6'>
      {/* Header Section */}
      <div className='bg-gradient-to-r from-gray-800 via-black to-gray-900 rounded-2xl shadow-xl mb-8 overflow-hidden'>
        <div className='px-8 py-6 text-white'>
          <div className='flex items-center space-x-3 mb-4'>
            <div className='w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center'>
              <FaComment className='w-6 h-6 text-white' />
            </div>
            <div>
              <h2 className='text-2xl font-bold'>Comments</h2>
              <p className='text-gray-300 text-sm'>Share your thoughts and join the discussion</p>
            </div>
          </div>
        </div>
      </div>

      {/* User Status Section */}
      {currentUser ? (
        <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6 border border-gray-200 dark:border-gray-700'>
          <div className='flex items-center space-x-4'>
            <div className='relative'>
              <img
                className='h-12 w-12 object-cover rounded-full border-4 border-gray-200 dark:border-gray-600 shadow-lg'
                src={currentUser.profilePicture}
                alt={currentUser.username}
              />
              <div className='absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white'></div>
            </div>
            <div className='flex-1'>
              <div className='flex items-center space-x-2'>
                <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
                  {currentUser.username}
                </h3>
                <span className='bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium px-2.5 py-0.5 rounded-full'>
                  Signed In
                </span>
              </div>
              <p className='text-sm text-gray-600 dark:text-gray-400'>
                Ready to share your thoughts
              </p>
            </div>
            <Link
              to={'/dashboard?tab=profile'}
              className='text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium hover:underline transition-colors duration-200'
            >
              View Profile
            </Link>
          </div>
        </div>
      ) : (
        <div className='bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-6 mb-6'>
          <div className='flex items-center space-x-3'>
            <div className='w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center'>
              <FaSignInAlt className='w-5 h-5 text-orange-600 dark:text-orange-400' />
            </div>
            <div className='flex-1'>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
                Sign in to comment
              </h3>
              <p className='text-gray-600 dark:text-gray-400 text-sm'>
                Join the discussion by signing in to your account
              </p>
            </div>
            <Link 
              to={'/sign-in'}
              className='bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl'
            >
              Sign In
            </Link>
          </div>
        </div>
      )}

      {/* Comment Form */}
      {currentUser && (
        <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 mb-8 overflow-hidden'>
          <div className='bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 px-6 py-4 border-b border-gray-200 dark:border-gray-700'>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2'>
              <FaUser className='w-4 h-4 text-blue-600 dark:text-blue-400' />
              <span>Add Your Comment</span>
            </h3>
          </div>
          <form onSubmit={handleSubmit} className='p-6'>
            <div className='space-y-4'>
              <textarea
                placeholder='Share your thoughts, ideas, or questions...'
                rows='4'
                maxLength='200'
                onChange={(e) => setComment(e.target.value)}
                value={comment}
                className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 resize-none bg-gray-50 dark:bg-gray-700 hover:bg-white dark:hover:bg-gray-600'
              />
              <div className='flex justify-between items-center'>
                <div className='flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400'>
                  <div className={`w-3 h-3 rounded-full ${comment.length > 180 ? 'bg-red-500' : comment.length > 150 ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                  <span>{200 - comment.length} characters remaining</span>
                </div>
                <button
                  type='submit'
                  disabled={!comment.trim() || comment.length > 200}
                  className='bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:transform-none disabled:shadow-none flex items-center space-x-2'
                >
                  <FaPaperPlane className='w-4 h-4' />
                  <span>Post Comment</span>
                </button>
              </div>
            </div>
            {commentError && (
              <Alert color='failure' className='mt-4'>
                {commentError}
              </Alert>
            )}
          </form>
        </div>
      )}

      {/* Comments List */}
      <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden'>
        <div className='bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700'>
          <div className='flex items-center justify-between'>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2'>
              <FaComment className='w-4 h-4 text-gray-600 dark:text-gray-400' />
              <span>All Comments</span>
            </h3>
            <div className='bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm font-medium px-3 py-1 rounded-full'>
              {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
            </div>
          </div>
        </div>
        
        <div className='p-6'>
          {comments.length === 0 ? (
            <div className='text-center py-12'>
              <div className='w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4'>
                <FaComment className='w-10 h-10 text-gray-400 dark:text-gray-500' />
              </div>
              <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-2'>
                No comments yet!
              </h3>
              <p className='text-gray-600 dark:text-gray-400 max-w-md mx-auto'>
                Be the first to share your thoughts and start the conversation.
              </p>
            </div>
          ) : (
            <div className='space-y-6'>
              {comments.map((comment) => (
                <Comment
                  key={comment._id}
                  comment={comment}
                  onLike={handleLike}
                  onEdit={handleEdit}
                  onDelete={(commentId) => {
                    setShowModal(true);
                    setCommentToDelete(commentId);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
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
              <Button
                color='failure'
                onClick={() => handleDelete(commentToDelete)}
              >
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
