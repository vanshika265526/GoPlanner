# 🌍 GoPlanner – Full Stack Travel Planning App

GoPlanner is a comprehensive travel planning application that enables users to create, manage, and share trips effortlessly. With a strong focus on user experience and secure authentication, GoPlanner helps travelers organize their itineraries, track budgets, and collaborate with friends or the public seamlessly.

---

## 🚀 Features

GoPlanner offers a full suite of features for travelers. Users can register and log in using either email/password or Google OAuth authentication, with email verification ensuring secure access. Once logged in, users can create trips, update details, plan daily itineraries, and manage budgets and interests. Trips can be set as public or private, and users can also share trips with others. Preferences like currency, language, and theme are stored to provide a personalized experience.

The app includes JWT-based authentication to protect sensitive routes, ensuring that only authorized users can access or modify their trips. A health check endpoint is also available to monitor server status.

---

## 🛠 Tech Stack

GoPlanner is built using modern and scalable technologies. The backend uses **Node.js** with **Express.js** for building RESTful APIs, **MongoDB** for data storage, and **Mongoose** as the ODM. Authentication is implemented with **JWT** and **bcryptjs** for password security, and Google OAuth is integrated for seamless social login.  

The frontend is built with **React.js** and **Vite**, offering a fast and interactive user interface, with OAuth integration to authenticate users with their Google accounts.

---

## ⚙️ Setting Up the Backend

To run the backend server, navigate to the `backend` directory, install dependencies, and configure environment variables:

```bash
cd backend
npm install
cp .env.example .env
```

You need to set up the following in the .env file: MONGODB_URI, JWT_SECRET, FRONTEND_URL, GOOGLE_CLIENT_ID, and NODE_ENV. If using a local MongoDB instance, make sure the database is running before starting the server.

The server can be started in development mode with auto-reload using:
```bash
npm run dev
```
or in production mode using:
```bash
npm start
```
By default, the backend server runs at http://localhost:5000.

---

## Setting Up the Frontend

Navigate to the frontend directory, install dependencies, and configure the environment file:
```bash
cd frontend
npm install
```

Create a .env file with the following variables:
```bash
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

```
Start the frontend development server with:
```bash
npm run dev
```

The frontend will run on http://localhost:5173.

🔑 API Endpoints

GoPlanner’s backend exposes a set of RESTful endpoints. Authentication routes allow users to register, log in, verify emails, and authenticate via Google OAuth. Protected routes use JWT tokens, ensuring that only authorized users can manage trips and view their own data.

Trip endpoints allow users to create, update, delete, and fetch trips, whether public or private. The application also provides a health check endpoint to ensure the server is running properly.


---

## 🚀 Production Notes

For production deployment, ensure that NODE_ENV is set to production, use a strong JWT_SECRET, and connect to a production-grade database like MongoDB Atlas. Proper CORS settings should be configured, and a process manager such as PM2 is recommended to keep the server running reliably.

GoPlanner is designed to be scalable, secure, and user-friendly, making it a reliable solution for travelers looking to plan and organize their trips efficiently.
