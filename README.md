# Football Fantasy Manager

A full-stack web application for managing football fantasy teams, built with React, TypeScript, Node.js, Express, and MongoDB.

## Features

- **User Authentication**: Single flow for login/registration
- **Team Management**: Automatic team creation with 20 players and $5,000,000 budget
- **Transfer Market**: Buy and sell players with filtering capabilities
- **Real-time Updates**: Live budget and team updates
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling and development server
- Tailwind CSS for styling
- React Router for navigation
- React Hook Form for form handling
- Axios for API calls
- React Hot Toast for notifications

### Backend
- Node.js with Express
- TypeScript
- MongoDB with Mongoose ODM
- JWT authentication
- bcryptjs for password hashing
- Express validation and rate limiting

## Project Structure

```
football-manager/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context
│   │   ├── services/       # API services
│   │   ├── types/          # TypeScript types
│   │   └── utils/          # Utility functions
│   └── package.json
├── server/                 # Node.js backend
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── types/          # TypeScript types
│   │   ├── utils/          # Utility functions
│   │   └── config/         # Configuration files
│   └── package.json
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account (cloud database)
- npm or yarn

### 1. Clone the Repository
```bash
git clone <repository-url>
cd football-manager
```

### 2. Backend Setup
```bash
cd server
npm install
```

Create a `.env` file in the server directory:
```env
# Database (MongoDB Atlas)
MONGODB_URI=mongodb+srv://zeyadbelal:Zz70077007lol2000@cluster0.t8lkhb2.mongodb.net/football-manager?retryWrites=true&w=majority&appName=Cluster0

# JWT
JWT_SECRET=football-manager-super-secret-jwt-key-2024
JWT_EXPIRES_IN=7d

# Server
PORT=5000
NODE_ENV=development

# CORS
CLIENT_URL=http://localhost:5173
```

### 3. Frontend Setup
```bash
cd ../client
npm install
```

### 4. Database Setup
This project uses MongoDB Atlas (cloud database). The connection string is already configured in the `.env` file. No local MongoDB installation is required.

### 5. Run the Application

Start the backend server:
```bash
cd server
npm run dev
```

In a new terminal, start the frontend:
```bash
cd client
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173 (Vite dev server)
- Backend API: http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/auth/login-register` - Login or register user
- `GET /api/auth/profile` - Get user profile

### Transfers
- `GET /api/transfers/market` - Get transfer market with filters
- `POST /api/transfers/list` - Add player to transfer list
- `DELETE /api/transfers/list/:playerId` - Remove player from transfer list
- `POST /api/transfers/buy/:playerId` - Buy a player

## Usage

1. **Registration/Login**: Visit the app and enter your email and password. New users will automatically get a team.

2. **Team Management**: View your team on the dashboard, see player statistics, and manage your squad.

3. **Transfer Market**: Browse available players, filter by position, team, or price range, and buy players at 95% of asking price.

4. **Selling Players**: List your players for transfer by setting an asking price.

## Business Rules

- Teams must have between 15-25 players at all times
- Initial team composition: 3 Goalkeepers, 6 Defenders, 6 Midfielders, 5 Attackers
- Players are purchased at 95% of the asking price
- Team creation happens asynchronously after user registration

## Time Report

### Backend Development (8 hours)
- Project setup and configuration: 1 hour
- Database models and schemas: 1.5 hours
- Authentication system: 1.5 hours
- Transfer system logic: 2 hours
- API endpoints and validation: 1.5 hours
- Error handling and middleware: 0.5 hours

### Frontend Development (6 hours)
- Project setup and configuration: 0.5 hours
- Component architecture: 1 hour
- Authentication flow: 1 hour
- Dashboard and team management: 1.5 hours
- Transfer market interface: 1.5 hours
- Styling and responsive design: 0.5 hours

### Testing and Documentation (1 hour)
- Manual testing: 0.5 hours
- Documentation: 0.5 hours

**Total Time: 15 hours**

## Future Enhancements

- Player statistics and performance tracking
- League system with multiple divisions
- Match simulation
- Player contracts and wages
- Advanced analytics dashboard
- Real-time notifications
- Mobile app

