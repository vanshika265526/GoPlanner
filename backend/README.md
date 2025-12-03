# GoPlanner Backend API

Backend API server for the GoPlanner travel planning application.

## Features

- User authentication (register, login, email verification)
- Google OAuth authentication
- Trip management (create, read, update, delete)
- Itinerary management
- JWT-based authentication
- MongoDB database
- RESTful API design

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## Installation

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
- Set `MONGODB_URI` (local MongoDB or MongoDB Atlas)
- Set `JWT_SECRET` (use a strong random string)
- Set `FRONTEND_URL` (your frontend URL)
- Set `GOOGLE_CLIENT_ID` (for Google OAuth - get from Google Cloud Console)

5. Start MongoDB (if using local MongoDB):
```bash
# Make sure MongoDB is running on your system
```

6. Run the server:
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client ID
5. Configure consent screen
6. Add authorized JavaScript origins:
   - `http://localhost:5173` (development)
   - Your production frontend URL
7. Add authorized redirect URIs:
   - `http://localhost:5173` (development)
   - Your production frontend URL
8. Copy the Client ID and add to `.env` as `GOOGLE_CLIENT_ID`
9. Also add `VITE_GOOGLE_CLIENT_ID` to frontend `.env` file

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/google` - Google OAuth authentication
- `GET /api/auth/verify-email/:token` - Verify email
- `POST /api/auth/resend-verification` - Resend verification email
- `GET /api/auth/me` - Get current user (protected)

### Trips
- `GET /api/trips/public` - Get public trips
- `GET /api/trips` - Get user's trips (protected)
- `POST /api/trips` - Create new trip (protected)
- `GET /api/trips/:id` - Get single trip (protected)
- `PUT /api/trips/:id` - Update trip (protected)
- `DELETE /api/trips/:id` - Delete trip (protected)

### Health Check
- `GET /api/health` - Server health check

## Authentication

Protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Database Models

### User
- name, email, password
- googleId (for Google OAuth users)
- emailVerified, emailVerificationToken
- preferences (currency, language, theme)

### Trip
- user, destination, startDate, endDate
- budget, interests
- itinerary (array of days with activities)
- status, isPublic, sharedWith

## Environment Variables

See `.env.example` for all available environment variables.

## Development

The server runs on `http://localhost:5000` by default.

Use `npm run dev` for development with auto-reload (requires nodemon).

## Production

1. Set `NODE_ENV=production` in `.env`
2. Use a strong `JWT_SECRET`
3. Use MongoDB Atlas or a production MongoDB instance
4. Configure proper CORS settings
5. Use a process manager like PM2

## Project Structure

```
backend/
├── config/          # Configuration files
│   ├── database.js  # MongoDB connection
│   └── jwt.js       # JWT utilities
├── controllers/     # Route controllers
│   ├── auth.controller.js
│   └── trip.controller.js
├── middleware/      # Custom middleware
│   ├── auth.middleware.js
│   └── error.middleware.js
├── models/          # Mongoose models
│   ├── User.model.js
│   └── Trip.model.js
├── routes/          # API routes
│   ├── auth.routes.js
│   ├── user.routes.js
│   ├── trip.routes.js
│   └── itinerary.routes.js
├── server.js        # Main server file
├── package.json
└── .env.example
```

## License

ISC
