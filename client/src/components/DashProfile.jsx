import { Alert, Button, Modal, ModalBody, TextInput } from 'flowbite-react';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signoutSuccess,
} from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaCamera, FaEdit, FaTrash, FaSignOutAlt } from 'react-icons/fa';

export default function DashProfile() {
  const { currentUser, error, loading } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const filePickerRef = useRef();
  const dispatch = useDispatch();
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };
  
  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () => {
    setImageFileUploading(true);
    setImageFileUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadError(
          'Could not upload image (File must be less than 2MB)'
        );
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
        setImageFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setFormData({ ...formData, profilePicture: downloadURL });
          setImageFileUploading(false);
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);
    if (Object.keys(formData).length === 0) {
      setUpdateUserError('No changes made');
      return;
    }
    if (imageFileUploading) {
      setUpdateUserError('Please wait for image to upload');
      return;
    }
    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      } else {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("User's profile updated successfully");
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
    }
  };
  
  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
      } else {
        dispatch(deleteUserSuccess(data));
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

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
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  
  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-800 dark:via-gray-700 dark:to-gray-900 p-6'>
      <div className=' mx-10'>
        <div className='bg-white/90 dark:bg-gray-800 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700 overflow-hidden'>
          {/* Header Section */}
          <div className='bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-gray-800 dark:via-black dark:to-gray-900 px-8 py-6 text-white'>
            <h1 className='text-3xl font-bold'>Profile Settings</h1>
            <p className='text-blue-100 dark:text-gray-300 mt-2'>Manage your account information and preferences</p>
          </div>
          
          <div className='p-8'>
            <form onSubmit={handleSubmit} className='space-y-8'>
              {/* Profile Picture Section */}
              <div className='text-center'>
                <input
                  type='file'
                  accept='image/*'
                  onChange={handleImageChange}
                  ref={filePickerRef}
                  hidden
                />
                <div
                  className='relative w-40 h-40 mx-auto cursor-pointer group'
                  onClick={() => filePickerRef.current.click()}
                >
                  {imageFileUploadProgress && (
                    <CircularProgressbar
                      value={imageFileUploadProgress || 0}
                      text={`${imageFileUploadProgress}%`}
                      strokeWidth={5}
                      styles={{
                        root: {
                          width: '100%',
                          height: '100%',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                        },
                        path: {
                          stroke: `rgba(255, 255, 255, ${
                            imageFileUploadProgress / 100
                          })`,
                        },
                        text: {
                          fill: '#ffffff',
                          fontSize: '16px',
                          fontWeight: 'bold',
                        },
                      }}
                    />
                  )}
                  <div className='relative w-full h-full'>
                    <img
                      src={imageFileUrl || currentUser.profilePicture}
                      alt='user'
                      className={`rounded-full w-full h-full object-cover border-4 border-white shadow-lg ${
                        imageFileUploadProgress &&
                        imageFileUploadProgress < 100 &&
                        'opacity-60'
                      }`}
                    />
                    <div className='absolute inset-0 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center'>
                      <FaCamera className='text-white text-2xl' />
                    </div>
                  </div>
                </div>
                <p className='text-sm text-gray-600 dark:text-gray-400 mt-3'>
                  Click to change profile picture
                </p>
                {imageFileUploadError && (
                  <Alert color='failure' className='mt-4 max-w-md mx-auto'>
                    {imageFileUploadError}
                  </Alert>
                )}
              </div>

              {/* Form Fields */}
              <div className='grid md:grid-cols-2 gap-6'>
                {/* Username Field */}
                <div className='space-y-2'>
                  <label className='text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center'>
                    <FaUser className='w-4 h-4 mr-2' />
                    Username
                  </label>
                  <div className='relative'>
                    <input
                      type='text'
                      id='username'
                      placeholder='Enter your username'
                      defaultValue={currentUser.username}
                      onChange={handleChange}
                      className='w-full pl-12 pr-4 py-3.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-gray-800 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 bg-gray-50 dark:bg-gray-700 hover:bg-white dark:hover:bg-gray-600'
                    />
                    <FaUser className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
                  </div>
                </div>

                {/* Email Field */}
                <div className='space-y-2'>
                  <label className='text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center'>
                    <FaEnvelope className='w-4 h-4 mr-2' />
                    Email Address
                  </label>
                  <div className='relative'>
                    <input
                      type='email'
                      id='email'
                      placeholder='Enter your email'
                      defaultValue={currentUser.email}
                      onChange={handleChange}
                      className='w-full pl-12 pr-4 py-3.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-gray-800 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 bg-gray-50 dark:bg-gray-700 hover:bg-white dark:hover:bg-gray-600'
                    />
                    <FaEnvelope className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
                  </div>
                </div>
              </div>

              {/* Password Field */}
              <div className='space-y-2'>
                <label className='text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center'>
                  <FaLock className='w-4 h-4 mr-2' />
                  New Password (leave blank to keep current)
                </label>
                <div className='relative'>
                  <input
                    type='password'
                    id='password'
                    placeholder='Enter new password'
                    onChange={handleChange}
                    className='w-full pl-12 pr-4 py-3.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-gray-800 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 bg-gray-50 dark:bg-gray-700 hover:bg-white dark:hover:bg-gray-600'
                  />
                  <FaLock className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
                </div>
              </div>

              {/* Update Button */}
              <Button
                type='submit'
                disabled={loading || imageFileUploading}
                className='w-full bg-gradient-to-r from-gray-800 to-black hover:from-gray-700 hover:to-gray-900 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl'
              >
                {loading ? (
                  <div className='flex items-center justify-center space-x-2'>
                    <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                    <span>Updating Profile...</span>
                  </div>
                ) : (
                  <div className='flex items-center justify-center space-x-2'>
                    <FaEdit className='w-4 h-4' />
                    <span>Update Profile</span>
                  </div>
                )}
              </Button>
            </form>

            {/* Action Buttons */}
            <div className='mt-8 pt-6 border-t border-gray-200 dark:border-gray-700'>
              <div className='flex flex-col sm:flex-row gap-4 justify-between'>
                <button
                  onClick={() => setShowModal(true)}
                  className='flex items-center justify-center space-x-2 px-6 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-200'
                >
                  <FaTrash className='w-4 h-4' />
                  <span>Delete Account</span>
                </button>
                <button
                  onClick={handleSignout}
                  className='flex items-center justify-center space-x-2 px-6 py-3 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200'
                >
                  <FaSignOutAlt className='w-4 h-4' />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>

            {/* Success/Error Messages */}
            {updateUserSuccess && (
              <Alert color='success' className='mt-6'>
                {updateUserSuccess}
              </Alert>
            )}
            {updateUserError && (
              <Alert color='failure' className='mt-6'>
                {updateUserError}
              </Alert>
            )}
            {error && (
              <Alert color='failure' className='mt-6'>
                {error}
              </Alert>
            )}
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
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
              Delete Account
            </h3>
            <p className='mb-6 text-gray-600 dark:text-gray-400'>
              Are you sure you want to delete your account? This action cannot be undone.
            </p>
            <div className='flex justify-center gap-4'>
              <Button 
                color='failure' 
                onClick={handleDeleteUser}
                className='bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg'
              >
                Yes, Delete Account
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
