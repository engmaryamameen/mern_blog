#  Tech Blog  - MERN Stack Blog Application

A modern, full-stack blog application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) featuring a beautiful UI, real-time interactions, and comprehensive admin dashboard.

![Tech Blog](https://img.shields.io/badge/MERN-Stack-orange?style=for-the-badge&logo=mongodb&logoColor=white)
![React](https://img.shields.io/badge/React-18.2.0-blue?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-8.0+-green?style=for-the-badge&logo=mongodb)

## ✨ Features

### 🎨 User Features
- **Modern UI/UX**: Beautiful, responsive design with dark/light theme support
- **Blog Reading**: Browse and read blog posts with rich text formatting
- **Search & Filter**: Advanced search functionality with category filtering
- **User Authentication**: Secure sign-up/sign-in with JWT tokens
- **Comments System**: Interactive commenting system with real-time updates
- **User Profiles**: Personalized user profiles and settings

### 🔧 Admin Features
- **Dashboard**: Comprehensive admin dashboard with analytics
- **Post Management**: Create, edit, and delete blog posts with rich text editor
- **User Management**: Manage users, roles, and permissions
- **Comment Moderation**: Moderate and manage user comments
- **Content Analytics**: Track post views, engagement, and user activity

### 🛡️ Security & Performance
- **Rate Limiting**: API rate limiting to prevent abuse
- **Helmet Security**: Enhanced security headers
- **Input Validation**: Comprehensive input validation and sanitization
- **Error Handling**: Robust error handling and logging
- **Compression**: Gzip compression for better performance

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Material-UI** - React component library
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **React Quill** - Rich text editor
- **React Icons** - Icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **Multer** - File upload handling

### Development Tools
- **ESLint** - Code linting
- **Nodemon** - Development server with auto-reload
- **Morgan** - HTTP request logger
- **CORS** - Cross-origin resource sharing

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/engmaryamameen/mern_blog
   cd mern-blog
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   npm install
   
   # Install client dependencies
   cd client
   npm install
   cd ..
   ```

3. **Environment Configuration**
   
   Create a `.env` file in the `api` directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   CLIENT_URL=http://localhost:5173
   PORT=3000
   ```

4. **Database Setup**
   - Set up a MongoDB database (local or MongoDB Atlas)
   - Update the `MONGODB_URI` in your `.env` file

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

### Separate Frontend/Backend
```bash
# Start backend only
npm run dev

# Start frontend only (in client directory)
cd client
npm run dev
```

## 📁 Project Structure

```
mern-blog/
├── api/                    # Backend server
│   ├── controllers/        # Route controllers
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── utils/             # Utility functions
│   └── index.js           # Server entry point
├── client/                # Frontend React app
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── redux/         # Redux store and slices
│   │   └── App.jsx        # Main app component
│   └── package.json
└── package.json
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `GET /api/auth/signout` - User logout

### Users
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/update/:userId` - Update user profile
- `DELETE /api/user/delete/:userId` - Delete user (admin only)

### Posts
- `GET /api/post/getposts` - Get all posts
- `GET /api/post/getpost/:slug` - Get single post
- `POST /api/post/create` - Create new post (admin only)
- `PUT /api/post/updatepost/:postId` - Update post (admin only)
- `DELETE /api/post/deletepost/:postId` - Delete post (admin only)

### Comments
- `POST /api/comment/create` - Create comment
- `GET /api/comment/getcomments/:postId` - Get post comments
- `PUT /api/comment/editcomment/:commentId` - Edit comment
- `DELETE /api/comment/deletecomment/:commentId` - Delete comment

## 🎯 Key Features Explained

### Rich Text Editor
- Uses React Quill for creating and editing blog posts
- Supports formatting, images, and embedded content
- Real-time preview and auto-save functionality

### Authentication System
- JWT-based authentication with secure token storage
- Protected routes for admin and user areas
- Password hashing with bcryptjs

### Responsive Design
- Mobile-first approach with Tailwind CSS
- Dark/light theme support
- Optimized for all device sizes

### Admin Dashboard
- Comprehensive analytics and user management
- Post creation and editing interface
- Comment moderation tools
- User role management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/feature_branch`)
3. Commit your changes (`git commit -m 'Add some Feature'`)
4. Push to the branch (`git push origin feature/feature_branch`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

##  Acknowledgments

- [React](https://reactjs.org/) - Frontend framework
- [Express.js](https://expressjs.com/) - Backend framework
- [MongoDB](https://www.mongodb.com/) - Database
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Material-UI](https://mui.com/) - Component library

## 📞 Support

If you have any questions or need help, please open an issue on GitHub or contact the maintainers.

---

⭐ **Star this repository if you found it helpful!** 