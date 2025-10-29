# Movie & TV Show Management - Backend API

Backend API for managing movies and TV shows with user authentication.

## Features

- User authentication (Register, Login, JWT)
- CRUD operations for movies and TV shows
- Pagination and infinite scroll support
- Search and filter functionality
- Image upload for movie/show posters
- Input validation using Yup
- MongoDB database with Mongoose ODM

## Tech Stack

- Node.js & Express
- MongoDB & Mongoose
- JWT Authentication
- Yup validation
- Multer for file uploads
- bcryptjs for password hashing

## Setup

1. Install dependencies:

```bash
npm install
```

2. Make sure MongoDB is running locally or update the `MONGODB_URI` in `.env`

3. Configure environment variables in `.env` file (see `.env.example`)

4. Start the development server:

```bash
npm run dev
```

The server will run on `http://localhost:5000`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Movies & TV Shows

- `GET /api/movies` - Get all movies/shows (protected, supports pagination, search, filter)
- `POST /api/movies` - Create new movie/show (protected)
- `GET /api/movies/:id` - Get single movie/show (protected)
- `PUT /api/movies/:id` - Update movie/show (protected)
- `DELETE /api/movies/:id` - Delete movie/show (protected)

### Query Parameters for GET /api/movies

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `search` - Search by title, director, or genre
- `type` - Filter by type (Movie or TV Show)
- `sortBy` - Sort field (default: -createdAt)

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── db.js           # Database connection
│   ├── controllers/
│   │   ├── authController.js
│   │   └── movieShowController.js
│   ├── middleware/
│   │   ├── auth.js         # JWT authentication middleware
│   │   └── upload.js       # Multer file upload middleware
│   ├── models/
│   │   ├── User.js
│   │   └── MovieShow.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── movieShowRoutes.js
│   ├── utils/
│   │   ├── generateToken.js
│   │   └── validation.js   # Yup validation schemas
│   └── server.js           # Entry point
├── uploads/                # Uploaded images
├── .env                    # Environment variables
├── .gitignore
└── package.json
```
