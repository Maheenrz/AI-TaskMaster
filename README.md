# AI TaskMaster

> **Intelligent Task Management Platform powered by AI**

AI TaskMaster is a full-stack MERN application that revolutionizes personal productivity through AI-powered task management, intelligent suggestions, and real-time analytics.

[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=flat&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-47A248?style=flat&logo=mongodb)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?style=flat&logo=express)](https://expressjs.com/)

---

## Features

### 🤖 **AI-Powered Intelligence**
- **Smart Chat Assistant** - Conversational AI that understands your tasks and provides contextual help
- **Intelligent Task Analysis** - Mistral AI integration for task prioritization and insights
- **Motivational System** - Dynamic encouragement based on your productivity patterns

### **Comprehensive Task Management**
- Create, update, and organize tasks with ease
- Priority levels (High, Medium, Low)
- Status tracking (Todo, In Progress, Completed)
- Real-time task analytics and completion rates
- Task filtering and search capabilities

### **Beautiful User Interface**
- Modern, responsive design with glass-morphism effects
- Dark theme with purple gradient accents
- Smooth animations and transitions
- Mobile-first responsive layout
- Interactive visual feedback

### **Secure Authentication**
- JWT-based authentication system
- Secure password hashing with bcrypt
- Protected API routes
- User session management

### **Cloud-Ready Deployment**
- Vercel-optimized frontend
- MongoDB Atlas integration
- Environment-based configuration
- Production-ready error handling

---

## Tech Stack

### **Frontend**
- **React 18** - Modern UI library
- **React Router** - Client-side routing
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **React Hot Toast** - Elegant notifications
- **Axios** - HTTP client

### **Backend**
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - JSON Web Tokens for auth
- **bcryptjs** - Password hashing

### **AI Integration**
- **Mistral AI** - Advanced language model for task intelligence

---

## 📁 Project Structure

```
AI-TaskMaster/
├── frontend/                # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # React Context (Auth, etc.)
│   │   ├── pages/          # Page components
│   │   ├── App.jsx         # Main App component
│   │   ├── main.jsx        # Entry point
│   │   └── index.css       # Global styles
│   ├── public/             # Static assets
│   ├── vite.config.js      # Vite configuration
│   └── package.json
│
├── backend/                 # Express backend API
│   ├── routes/             # API routes
│   │   ├── auth.js         # Authentication routes
│   │   ├── tasks.js        # Task CRUD operations
│   │   └── ai.js           # AI integration routes
│   ├── models/             # Mongoose models
│   ├── middleware/         # Custom middleware (auth, etc.)
│   ├── services/           # Business logic
│   │   └── aiService.js    # AI integration service
│   ├── server.js           # Main server file
│   └── package.json
│
├── .env.example            # Environment variables template
└── README.md               # You are here!
```

---

## Getting Started

### **Prerequisites**

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn
- Mistral AI API key (for AI features)

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/Maheenrz/AI-TaskMaster.git
   cd AI-TaskMaster
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

   Create `.env` file:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   MISTRAL_API_KEY=your_mistral_api_key
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

   Create `.env` file:
   ```env
   VITE_API_URL=http://localhost:5000
   ```

---

## Running the Application

### **Development Mode**

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Server runs on `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
App runs on `http://localhost:5173`

### **Production Build**

**Frontend:**
```bash
cd frontend
npm run build
```

**Backend:**
```bash
cd backend
npm start
```

---

## API Endpoints

### **Authentication**
```http
POST   /api/auth/register    # Register new user
POST   /api/auth/login       # Login user
GET    /api/auth/me          # Get current user
```

### **Tasks**
```http
GET    /api/tasks            # Get all user tasks
POST   /api/tasks            # Create new task
PUT    /api/tasks/:id        # Update task
DELETE /api/tasks/:id        # Delete task
```

### **AI Features**
```http
POST   /api/ai/chat                    # Chat with AI assistant
POST   /api/ai/motivational-message   # Get motivational message
```

### **Health Check**
```http
GET    /                     # API status
GET    /api/health          # Health check
```

---

## Key Features Breakdown

### **AI Chat Assistant**
The AI assistant understands your task context and provides intelligent responses:
- Task-aware conversations
- Smart suggestions based on your task history
- Context retention within conversations

### **Motivational System**
Dynamic motivational messages based on your productivity:
- Personalized encouragement
- Completion rate tracking
- Progress-based emoji feedback

### **Task Analytics**
Real-time statistics and insights:
- Completion rates
- Task distribution by status
- Priority-based organization
- Recent task activity

---

## Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcrypt with salt rounds
- **Protected Routes** - Middleware-based auth checks
- **Input Validation** - Request sanitization
- **CORS Configuration** - Controlled origin access
- **Environment Variables** - Sensitive data protection

---

## Deployment

### **Frontend (Vercel)**
```bash
cd frontend
vercel deploy --prod
```

### **Backend (Vercel)**
- Set environment variables in platform dashboard
- Connect MongoDB Atlas
- Deploy backend separately
- Update `VITE_API_URL` in frontend

---


## Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taskmaster
JWT_SECRET=your_jwt_secret_min_32_chars
MISTRAL_API_KEY=your_mistral_api_key
NODE_ENV=production
FRONTEND_URL=https://your-frontend.vercel.app
```

### Frontend (.env)
```env
VITE_API_URL=https://your-backend-api.vercel.app
```

---

##  Known Issues & Troubleshooting

### MongoDB Connection
If you encounter connection issues:
```bash
# Check MongoDB URI format
# Ensure IP whitelist in MongoDB Atlas
# Verify credentials
```

### CORS Errors
Update `FRONTEND_URL` in backend `.env` to match your frontend domain.

### AI Features Not Working
Verify `MISTRAL_API_KEY` is correctly set in backend environment variables.

---

## Author

**Maheen Razzaq**
- GitHub: [@Maheenrz](https://github.com/Maheenrz)
- LinkedIn: [Maheen Razzaq](https://www.linkedin.com/in/maheen-razzaq-8aa854261)
- Email: maheenr826@gmail.com

---

## Acknowledgments

- Mistral AI for intelligent task analysis
- MongoDB Atlas for database hosting
- Vercel for seamless deployment
- React & Node.js communities



<div align="center">

**⭐ Star this repository if you found it helpful!**

Made with ❤️ and ☕ by Maheen Razzaq

</div>
