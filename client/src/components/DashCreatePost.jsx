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
import { useState } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate } from 'react-router-dom';
import { FaUpload, FaEdit, FaSave, FaCrown } from 'react-icons/fa';
import { useSelector } from 'react-redux';

export default function DashCreatePost() {
  const { currentUser } = useSelector((state) => state.user);
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

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
      const res = await fetch('/api/post/create', {
        method: 'POST',
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
        navigate(`/post/${data.slug}`);
      }
    } catch (error) {
      setPublishError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900'>
      <div className='p-6'>
        <div className='max-w-4xl mx-auto'>
          <div className='bg-white/90 dark:bg-gray-800 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700 overflow-hidden'>
            {/* Header Section */}
            <div className='bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-gray-800 dark:via-black dark:to-gray-900 px-8 py-6 text-white'>
              <h1 className='text-3xl font-bold'>Create New Post</h1>
              <p className='text-blue-100 dark:text-gray-300 mt-2'>Write and publish your amazing content</p>
            </div>
            
            <div className='p-8'>
             
              
              <form className='space-y-6' onSubmit={handleSubmit}>
                {/* Title and Category Row */}
                <div className='grid md:grid-cols-3 gap-6'>
                  <div className='md:col-span-2'>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                      Post Title
                    </label>
                    <input
                      type='text'
                      placeholder='Enter your post title'
                      required
                      id='title'
                      className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 bg-gray-50 dark:bg-gray-700 hover:bg-white dark:hover:bg-gray-600'
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                      Category
                    </label>
                    <select
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 bg-gray-50 dark:bg-gray-700 hover:bg-white dark:hover:bg-gray-600'
                    >
                      <option value='uncategorized'>Select a category</option>
                      <option value='technology'>Technology</option>
                      <option value='programming'>Programming</option>
                      <option value='design'>Design</option>
                      <option value='business'>Business</option>
                      <option value='lifestyle'>Lifestyle</option>
                      <option value='tutorial'>Tutorial</option>
                      <option value='news'>News</option>
                    </select>
                  </div>
                </div>

                {/* Image Upload Section */}
                <div className='space-y-4'>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                    Featured Image
                  </label>
                  <div className='border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-xl p-6 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200'>
                    <div className='flex flex-col sm:flex-row gap-4 items-center justify-between'>
                      <div className='flex-1'>
                        <input
                          type='file'
                          accept='image/*'
                          onChange={(e) => setFile(e.target.files[0])}
                          className='w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-800 file:text-white hover:file:bg-gray-700 transition-colors duration-200'
                        />
                      </div>
                      <button
                        type='button'
                        onClick={handleUpdloadImage}
                        disabled={imageUploadProgress}
                        className='flex items-center space-x-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed'
                      >
                        {imageUploadProgress ? (
                          <div className='w-6 h-6'>
                            <CircularProgressbar
                              value={imageUploadProgress}
                              text={`${imageUploadProgress || 0}%`}
                              styles={{
                                path: {
                                  stroke: '#ffffff',
                                },
                                text: {
                                  fill: '#ffffff',
                                  fontSize: '12px',
                                  fontWeight: 'bold',
                                },
                              }}
                            />
                          </div>
                        ) : (
                          <>
                            <FaUpload className='w-4 h-4' />
                            <span>Upload Image</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                  {imageUploadError && (
                    <Alert color='failure' className='mt-4'>
                      {imageUploadError}
                    </Alert>
                  )}
                  {formData.image && (
                    <div className='mt-4'>
                      <img
                        src={formData.image}
                        alt='upload'
                        className='w-full h-72 object-cover rounded-xl shadow-lg'
                      />
                    </div>
                  )}
                </div>

                {/* Content Editor */}
                <div className='space-y-4'>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                    Post Content
                  </label>
                  <div className='border border-gray-300 dark:border-gray-600 rounded-xl overflow-hidden'>
                    <ReactQuill
                      theme='snow'
                      placeholder='Write something amazing...'
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
                          ['link', 'image'],
                          ['clean']
                        ],
                      }}
                    />
                  </div>
                </div>

                {/* Publish Button */}
                <Button
                  type='submit'
                  disabled={loading}
                  className='w-full bg-gradient-to-r from-gray-800 to-black hover:from-gray-700 hover:to-gray-900 text-white font-medium py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl text-lg'
                >
                  {loading ? (
                    <div className='flex items-center justify-center space-x-2'>
                      <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                      <span>Publishing...</span>
                    </div>
                  ) : (
                    <div className='flex items-center justify-center space-x-2'>
                      <FaSave className='w-4 h-4' />
                      <span>Publish Post</span>
                    </div>
                  )}
                </Button>

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