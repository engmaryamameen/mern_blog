import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { useEffect, useState } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaArrowLeft, FaSave, FaUpload } from 'react-icons/fa';

export default function DashUpdatePost() {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [postId, setPostId] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    // Get postId from URL parameters
    const urlParams = new URLSearchParams(location.search);
    const postIdFromUrl = urlParams.get('postId');
    if (postIdFromUrl) {
      setPostId(postIdFromUrl);
    }
  }, [location.search]);

  useEffect(() => {
    if (postId) {
      const fetchPost = async () => {
        try {
          const res = await fetch(`/api/post/getposts?postId=${postId}`);
          const data = await res.json();
          if (!res.ok) {
            console.log(data.message);
            setPublishError(data.message);
            return;
          }
          if (res.ok) {
            setPublishError(null);
            setFormData(data.posts[0]);
          }
        } catch (error) {
          console.log(error.message);
          setPublishError('Failed to fetch post');
        }
      };

      fetchPost();
    }
  }, [postId]);

  const handleUpdloadImage = async () => {
    try {
      if (!file) {
        setImageUploadError('Please select an image');
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + '-' + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError('Image upload failed');
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            setImageUploadError(null);
            setFormData({ ...formData, image: downloadURL });
          });
        }
      );
    } catch (error) {
      setImageUploadError('Image upload failed');
      setImageUploadProgress(null);
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch(`/api/post/updatepost/${formData._id}/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }

      if (res.ok) {
        setPublishError(null);
        // Navigate back to posts tab
        navigate('/dashboard?tab=posts');
      }
    } catch (error) {
      setPublishError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/dashboard?tab=posts');
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900'>
      <div className='p-6'>
        <div className='max-w-4xl mx-auto'>
          <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden'>
            {/* Header Section */}
            <div className='bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 px-8 py-6 text-white'>
              <div className='flex items-center justify-between'>
                <div>
                  <h1 className='text-3xl font-bold'>Update Post</h1>
                  <p className='text-blue-100 mt-2'>Edit and update your blog post</p>
                </div>
                <Button
                  color="light"
                  onClick={handleBack}
                  className='bg-white/20 hover:bg-white/30 border-white/30'
                >
                  <FaArrowLeft className='mr-2' />
                  Back to Posts
                </Button>
              </div>
            </div>

            {/* Form Section */}
            <div className='p-8'>
              <form className='space-y-6' onSubmit={handleSubmit}>
                {/* Title and Category Row */}
                <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                  {/* Post Title Field */}
                  <div className='lg:col-span-2 space-y-3'>
                    <label className='block text-sm font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wide'>
                      Post Title
                    </label>
                    <div className='relative group'>
                      <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                        <svg className='w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-300' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z' />
                        </svg>
                      </div>
                      <TextInput
                        type='text'
                        placeholder='Enter a compelling title for your post...'
                        required
                        id='title'
                        className='w-full pl-12 pr-12 py-4 transition-all duration-300 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-2xl shadow-sm hover:shadow-lg focus:shadow-xl text-lg font-medium'
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        value={formData.title || ''}
                      />
                      <div className='absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none'>
                        <div className='w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center group-focus-within:bg-blue-200 dark:group-focus-within:bg-blue-800/50 transition-colors duration-300'>
                          <svg className='w-4 h-4 text-blue-600 dark:text-blue-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Category Field */}
                  <div className='space-y-3'>
                    <label className='block text-sm font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wide'>
                      Category
                    </label>
                    <div className='relative group'>
                      <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                        <div className='w-6 h-6 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center group-focus-within:bg-yellow-200 dark:group-focus-within:bg-yellow-800/50 transition-colors duration-300'>
                          <svg className='w-3 h-3 text-yellow-600 dark:text-yellow-400' fill='currentColor' viewBox='0 0 20 20'>
                            <path d='M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z' />
                          </svg>
                        </div>
                      </div>
                      <Select
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
                        value={formData.category || 'uncategorized'}
                        className='w-full pl-12 pr-12 py-4 transition-all duration-300 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-2xl shadow-sm hover:shadow-lg focus:shadow-xl appearance-none text-lg font-medium'
                      >
                        <option value='uncategorized' className='py-3 text-lg'>📂 Select a category</option>
                        <option value='javascript' className='py-3 text-lg'>⚡ JavaScript</option>
                        <option value='reactjs' className='py-3 text-lg'>⚛️ React.js</option>
                        <option value='nextjs' className='py-3 text-lg'>🚀 Next.js</option>
                        <option value='nodejs' className='py-3 text-lg'>🟢 Node.js</option>
                        <option value='mongodb' className='py-3 text-lg'>🍃 MongoDB</option>
                        <option value='other' className='py-3 text-lg'>📝 Other</option>
                      </Select>
                      <div className='absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none'>
                        <div className='w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center group-focus-within:bg-blue-200 dark:group-focus-within:bg-blue-800/50 transition-colors duration-300'>
                          <svg className='w-4 h-4 text-blue-600 dark:text-blue-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Image Upload Section */}
                <div className='space-y-3'>
                  <label className='block text-sm font-semibold text-gray-700 dark:text-gray-300'>
                    Featured Image
                  </label>
                  <div className='relative group'>
                    <div className='border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50 transition-all duration-300 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-lg'>
                      <div className='flex flex-col items-center justify-center space-y-4'>
                        {/* Upload Icon */}
                        <div className='w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50 transition-colors duration-300'>
                          <svg className='w-8 h-8 text-blue-600 dark:text-blue-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12' />
                          </svg>
                        </div>
                        
                        {/* Upload Text */}
                        <div className='text-center'>
                          <p className='text-lg font-medium text-gray-700 dark:text-gray-300'>
                            Drop your image here, or{' '}
                            <span className='text-blue-600 dark:text-blue-400 font-semibold cursor-pointer hover:underline'>
                              browse
                            </span>
                          </p>
                          <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
                            PNG, JPG, GIF up to 10MB
                          </p>
                        </div>
                        
                        {/* File Input */}
                        <div className='w-full max-w-xs'>
                          <FileInput
                            type='file'
                            accept='image/*'
                            onChange={(e) => setFile(e.target.files[0])}
                            className='w-full opacity-0 absolute inset-0 cursor-pointer'
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Upload Button */}
                    <div className='absolute bottom-4 right-4'>
                      <Button
                        type='button'
                        gradientDuoTone='purpleToBlue'
                        size='sm'
                        onClick={handleUpdloadImage}
                        disabled={imageUploadProgress}
                        className='flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105'
                      >
                        {imageUploadProgress ? (
                          <div className='w-5 h-5'>
                            <CircularProgressbar
                              value={imageUploadProgress}
                              text={`${imageUploadProgress || 0}%`}
                              styles={{
                                text: {
                                  fontSize: '10px',
                                  fill: '#ffffff',
                                },
                                path: {
                                  stroke: '#ffffff',
                                },
                                trail: {
                                  stroke: 'rgba(255,255,255,0.3)',
                                },
                              }}
                            />
                          </div>
                        ) : (
                          <>
                            <FaUpload className='w-4 h-4' />
                            Upload
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  {imageUploadError && (
                    <Alert color='failure' className='mt-4 rounded-xl border-l-4 border-red-500'>
                      <div className='flex items-center gap-2'>
                        <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
                          <path fillRule='evenodd' d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z' clipRule='evenodd' />
                        </svg>
                        {imageUploadError}
                      </div>
                    </Alert>
                  )}
                </div>

                {/* Current Image Preview */}
                {formData.image && (
                  <div className='relative group'>
                    <img
                      src={formData.image}
                      alt='Current post image'
                      className='w-full h-64 object-cover rounded-xl shadow-lg'
                    />
                    <div className='absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center'>
                      <span className='text-white font-medium'>Current Image</span>
                    </div>
                  </div>
                )}

                {/* Content Editor */}
                <div className='space-y-3'>
                  <label className='block text-sm font-semibold text-gray-700 dark:text-gray-300'>
                    Post Content
                  </label>
                  <div className='border-2 border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden shadow-sm hover:shadow-md focus-within:shadow-lg transition-all duration-300'>
                    <ReactQuill
                      theme='snow'
                      value={formData.content || ''}
                      placeholder='Start writing your amazing content here...'
                      className='h-72'
                      required
                      onChange={(value) => {
                        setFormData({ ...formData, content: value });
                      }}
                      modules={{
                        toolbar: [
                          [{ 'header': [1, 2, 3, false] }],
                          ['bold', 'italic', 'underline', 'strike'],
                          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                          [{ 'color': [] }, { 'background': [] }],
                          [{ 'align': [] }],
                          ['link', 'image', 'blockquote', 'code-block'],
                          ['clean']
                        ],
                      }}
                      formats={[
                        'header',
                        'bold', 'italic', 'underline', 'strike',
                        'list', 'bullet',
                        'color', 'background',
                        'align',
                        'link', 'image', 'blockquote', 'code-block'
                      ]}
                    />
                  </div>
                  <p className='text-xs text-gray-500 dark:text-gray-400'>
                    💡 Tip: Use the toolbar above to format your content with headings, lists, links, and more!
                  </p>
                </div>

                {/* Submit Button */}
                <div className='flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700'>
                  <Button
                    type='submit'
                    gradientDuoTone='purpleToPink'
                    size='lg'
                    disabled={loading}
                    className='flex items-center gap-3 px-10 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105'
                  >
                    {loading ? (
                      <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                    ) : (
                      <FaSave className='w-5 h-5' />
                    )}
                    <span className='font-semibold'>
                      {loading ? 'Updating Post...' : 'Update Post'}
                    </span>
                  </Button>
                </div>

                {/* Error Alert */}
                {publishError && (
                  <Alert className='mt-4' color='failure'>
                    {publishError}
                  </Alert>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 