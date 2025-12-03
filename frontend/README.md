# GoPlanner Frontend

React frontend application for GoPlanner travel planning.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

3. Start development server:
```bash
npm run dev
```

The app will run on `http://localhost:5173`

## Build

```bash
npm run build
```

## Important Notes

- Make sure backend server is running on port 5000
- Google OAuth requires `VITE_GOOGLE_CLIENT_ID` in `.env`
- API calls are proxied through Vite dev server to backend

