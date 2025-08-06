import { Link } from 'react-router-dom';

import { useEffect, useState } from 'react';
import PostCard from '../components/PostCard';
import { FaArrowRight, FaRocket, FaLightbulb, FaUsers, FaBookOpen } from 'react-icons/fa';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/post/getPosts');
        const data = await res.json();
        setPosts(data.posts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const features = [
   
    {
      icon: <FaLightbulb className="w-6 h-6" />,
      title: "Expert Knowledge",
      description: "Learn from experienced developers and industry professionals."
    },
    {
      icon: <FaUsers className="w-6 h-6" />,
      title: "Community Driven",
      description: "Join a community of developers sharing knowledge and experiences."
    },
    {
      icon: <FaBookOpen className="w-6 h-6" />,
      title: "Practical Tutorials",
      description: "Step-by-step guides and tutorials for real-world applications."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20 lg:py-32">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-fade-in">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6">
                Welcome to{' '}
                <span className="gradient-text">Tech Blog</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
                Discover cutting-edge insights, tutorials, and resources designed to accelerate your development journey. 
                From web development to software engineering, we've got everything you need to grow as a developer.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link to="/search">
                  <button className="btn-primary text-lg px-8 py-4 flex items-center space-x-2">
                    <span>Explore Articles</span>
                    <FaArrowRight className="w-5 h-5" />
                  </button>
                </Link>
                <Link to="/about">
                  <button className="btn-secondary text-lg px-8 py-4">
                    Learn More
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose Tech Blog?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              We provide comprehensive resources and insights to help you excel in your development career.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="card p-6 text-center group hover:transform hover:scale-105 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 group-hover:shadow-lg transition-all duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Recent Posts Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Latest Articles
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Stay updated with our latest insights, tutorials, and industry trends.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="spinner"></div>
            </div>
          ) : posts && posts.length > 0 ? (
            <div className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.slice(0, 6).map((post, index) => (
                  <div 
                    key={post._id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <PostCard post={post} />
                  </div>
                ))}
              </div>
              
              <div className="text-center">
                <Link to="/search">
                  <button className="btn-primary text-lg px-8 py-4 flex items-center space-x-2 mx-auto">
                    <span>View All Articles</span>
                    <FaArrowRight className="w-5 h-5" />
                  </button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaBookOpen className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                No Articles Yet
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Check back soon for our latest articles and insights.
              </p>
            </div>
          )}
        </div>
      </section>

    </div>
  );
}
