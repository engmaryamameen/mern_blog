import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import DashSidebar from '../components/DashSidebar';
import DashProfile from '../components/DashProfile';
import DashPosts from '../components/DashPosts';
import DashCreatePost from '../components/DashCreatePost';
import DashUpdatePost from '../components/DashUpdatePost';
import DashUsers from '../components/DashUsers';
import DashComments from '../components/DashComments';
import DashboardComp from '../components/DashboardComp';

export default function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState('dash'); // Set default tab to 'dash'
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
  return (
    <div className='min-h-screen flex flex-col md:flex-row'>
      <div className='md:w-64 flex-shrink-0'>
        {/* Sidebar */}
        <DashSidebar />
      </div>
      {/* Main content area - takes full remaining width */}
      <div className='flex-1 w-full'>
        {/* profile... */}
        {tab === 'profile' && <DashProfile />}
        {/* posts... */}
        {tab === 'posts' && <DashPosts />}
        {/* create post... */}
        {tab === 'create-post' && <DashCreatePost />}
        {/* update post... */}
        {tab === 'update-post' && <DashUpdatePost />}
        {/* users */}
        {tab === 'users' && <DashUsers />}
        {/* comments  */}
        {tab === 'comments' && <DashComments />}
        {/* dashboard comp */}
        {tab === 'dash' && <DashboardComp />}
      </div>
    </div>
  );
}
