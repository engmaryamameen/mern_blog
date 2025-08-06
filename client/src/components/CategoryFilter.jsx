import { Link, useLocation } from 'react-router-dom';
import { FaFolder } from 'react-icons/fa';

export default function CategoryFilter() {
  const location = useLocation();
  
  const categories = [
    { name: 'All', path: '/search', value: 'uncategorized' },
    { name: 'Technology', path: '/search?category=technology', value: 'technology' },
    { name: 'Programming', path: '/search?category=programming', value: 'programming' },
    { name: 'Design', path: '/search?category=design', value: 'design' },
    { name: 'Business', path: '/search?category=business', value: 'business' },
    { name: 'Lifestyle', path: '/search?category=lifestyle', value: 'lifestyle' },
    { name: 'Tutorial', path: '/search?category=tutorial', value: 'tutorial' },
    { name: 'News', path: '/search?category=news', value: 'news' },
  ];

  const urlParams = new URLSearchParams(location.search);
  const currentCategory = urlParams.get('category') || 'uncategorized';

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => {
        const isActive = currentCategory === category.value;
        
        return (
          <Link
            key={category.value}
            to={category.path}
            className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              isActive
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <FaFolder className="w-3 h-3" />
            <span>{category.name}</span>
          </Link>
        );
      })}
    </div>
  );
} 