# Football Fantasy Manager

> **Note**: This project includes an additional visual field formation component (FieldView.tsx) that wasn't part of the original requirements. You can ignore this file if focusing on core functionality only.

A full-stack web application for managing football fantasy teams, built with React, TypeScript, Node.js, Express, and MongoDB.

## Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **React Router** - Navigation
- **React Hook Form** - Form handling
- **Axios** - HTTP client
- **React Hot Toast** - Notifications

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **TypeScript** - Type safety
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Zod** - Validation
- **Helmet** - Security middleware

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or Atlas cloud database)
- npm or yarn

### 1. Clone and Install
```bash
git clone <repository-url>
cd football-manager

# Backend setup
cd server
npm install

# Frontend setup
cd ../client
npm install
```

### 2. Environment Configuration

Create `.env` file in the server directory:
```env
# For local MongoDB
MONGODB_URI=mongodb://localhost:27017/football-manager
# For MongoDB Atlas (cloud)
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/football-manager

JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```



### 3. Run the Application

Start backend server:
```bash
cd server
npm run dev
```

Start frontend (in new terminal):
```bash
cd client
npm run dev
```

**Access the application:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## Time Report 

| Section | Time Spent |
|---------|------------|
| **Backend Development** | **6 hours** |
| - Project setup and configuration | 30 min |
| - Database models and schemas | 1.5 hours |
| - Authentication system | 1.5 hours |
| - Transfer system logic | 1 hours |
| - API endpoints and validation | 1 hours |
| - Error handling and middleware | 30 min |
| **Frontend Development** | **6 hours** |
| - Project setup and configuration | 30 min |
| - Component architecture | 1 hour |
| - Authentication flow | 1 hour |
| - Dashboard and team management | 1.5 hours |
| - Transfer market interface | 1.5 hours |
| - Styling and responsive design | 30 min |
| **Testing and Documentation** | **1 hour** |
| - Manual testing | 30 min |
| - Documentation | 30 min |
| **Total Time** | **13 hours** |



![alt text](image.png)
