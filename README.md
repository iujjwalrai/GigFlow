# GigFlow - Freelance Marketplace Platform

A full-stack mini-freelance marketplace platform where Clients can post jobs (Gigs) and Freelancers can apply for them (Bids).

## Features

- ✅ User Authentication (Sign-up/Login with JWT & HttpOnly cookies)
- ✅ Gig Management (Create, Browse, Search/Filter)
- ✅ Bidding System (Submit bids on open gigs)
- ✅ Hiring Logic with Transactional Integrity (Atomic updates using MongoDB transactions)
- ✅ Real-time Notifications (Socket.io integration)
- ✅ Responsive UI with Tailwind CSS

## Tech Stack

### Frontend
- React.js (Vite)
- Tailwind CSS
- Redux Toolkit (State Management)
- React Router (Routing)
- Socket.io Client (Real-time updates)
- Axios (HTTP Client)

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication (HttpOnly cookies)
- Socket.io (Real-time notifications)
- Bcrypt (Password hashing)

## Project Structure

```
GigFlow/
├── backend/
│   ├── models/          # MongoDB models (User, Gig, Bid)
│   ├── routes/          # API routes (auth, gigs, bids)
│   ├── middleware/      # Authentication middleware
│   └── server.js        # Express server setup
├── client/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/      # Page components
│   │   ├── store/      # Redux store and slices
│   │   └── utils/      # Utility functions
│   └── ...
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/gigflow
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

4. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the client directory (optional):
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Gigs
- `GET /api/gigs` - Get all open gigs (with optional search query)
- `GET /api/gigs/:id` - Get single gig
- `POST /api/gigs` - Create new gig (authenticated)

### Bids
- `POST /api/bids` - Submit a bid (authenticated)
- `GET /api/bids/:gigId` - Get all bids for a gig (owner only)
- `PATCH /api/bids/:bidId/hire` - Hire a freelancer (atomic update)

## Database Schema

### User
- `name` (String, required)
- `email` (String, required, unique)
- `password` (String, required, hashed)

### Gig
- `title` (String, required)
- `description` (String, required)
- `budget` (Number, required)
- `ownerId` (ObjectId, ref: User)
- `status` (String, enum: ['open', 'assigned'])

### Bid
- `gigId` (ObjectId, ref: Gig)
- `freelancerId` (ObjectId, ref: User)
- `message` (String, required)
- `price` (Number, required)
- `status` (String, enum: ['pending', 'hired', 'rejected'])

## Key Features Implementation

### 1. Transactional Integrity (Bonus 1)
The hiring logic uses MongoDB transactions to ensure atomic updates:
- When a client hires a freelancer, all operations (updating gig status, hiring bid, rejecting other bids) happen in a single transaction
- This prevents race conditions where multiple hires could occur simultaneously

### 2. Real-time Notifications (Bonus 2)
- Socket.io integration for real-time updates
- When a freelancer is hired, they receive an instant notification
- Notifications appear as toast messages in the UI

## Usage

1. **Register/Login**: Create an account or login
2. **Browse Gigs**: View all open gigs on the home page
3. **Search**: Use the search bar to filter gigs by title or description
4. **Post a Gig**: Click "Post a Gig" to create a new job posting
5. **Submit Bids**: Click on any open gig to view details and submit a bid
6. **Hire Freelancers**: As a gig owner, view all bids and hire a freelancer
7. **Real-time Updates**: Receive instant notifications when hired

## Development

### Backend Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

### Frontend Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Security Features

- Password hashing with bcrypt
- JWT tokens stored in HttpOnly cookies
- CORS configuration
- Input validation
- Authentication middleware

## License

ISC

## Author

Built as a full-stack development assignment.
