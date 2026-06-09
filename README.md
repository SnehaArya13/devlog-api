# DevLog API

A REST API for developers to track their coding sessions, set daily goals, and visualize learning streaks and progress over time.

Built as a backend internship project using Node.js, Express, and MongoDB.

---

## Live Demo

Base URL: `https://devlog-api.onrender.com` *(added after deployment on Day 10)*

---

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB Atlas + Mongoose
- **Authentication:** JWT (JSON Web Tokens) + bcryptjs
- **Security:** Helmet, CORS
- **Logging:** Morgan
- **Validation:** express-validator
- **Deployment:** Render

---

## Features

- JWT-based user authentication (register & login)
- Log coding sessions with topic, duration, difficulty, and notes
- Filter sessions by topic or date
- Set and track daily coding goals
- Streak tracking — current streak and longest streak
- MongoDB aggregation for weekly, daily, and all-time stats
- Centralized error handling with proper HTTP status codes
- Input validation on all auth routes

---

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free tier)

### Installation

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/devlog-api.git
cd devlog-api

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Fill in your values in .env

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file in the root with:

```
PORT=3000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/devlog
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
```

---

## API Endpoints

### Auth
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register a new user | ❌ |
| POST | `/api/auth/login` | Login and get token | ❌ |
| GET | `/api/me` | Get logged-in user profile | ✅ |

### Sessions
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/sessions` | Log a new coding session | ✅ |
| GET | `/api/sessions` | Get all sessions (supports ?topic= and ?date= filters) | ✅ |
| GET | `/api/sessions/:id` | Get a single session | ✅ |
| PUT | `/api/sessions/:id` | Update a session | ✅ |
| DELETE | `/api/sessions/:id` | Delete a session | ✅ |

### Goals
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/goals` | Set a daily goal | ✅ |
| GET | `/api/goals` | Get goal + today's progress | ✅ |
| PUT | `/api/goals` | Update daily goal | ✅ |

### Streaks
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/streaks` | Get current and longest streak | ✅ |

### Stats
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/stats/weekly` | Weekly stats with topic breakdown | ✅ |
| GET | `/api/stats/summary` | All-time stats | ✅ |
| GET | `/api/stats/daily` | Stats for a specific day (?date=YYYY-MM-DD) | ✅ |

---

## Authentication

All protected routes require a Bearer token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

Get your token by calling `/api/auth/login` or `/api/auth/register`.

---

## Sample Requests

### Register
```json
POST /api/auth/register
{
  "name": "Sneha",
  "email": "sneha@example.com",
  "password": "123456"
}
```

### Log a session
```json
POST /api/sessions
Authorization: Bearer <token>
{
  "topic": "DSA",
  "durationMinutes": 90,
  "difficulty": "medium",
  "notes": "Practiced sliding window and two pointers"
}
```

### Get weekly stats
```
GET /api/stats/weekly
Authorization: Bearer <token>
```

---

## Project Structure

```
devlog-api/
├── controllers/        # Route logic
├── middleware/         # Auth + error handling
├── models/             # Mongoose schemas
├── routes/             # Express routers
├── utils/              # Helper functions
├── .env                # Environment variables (not committed)
├── .env.example        # Example env file
└── index.js            # Entry point
```

---

## Error Handling

All errors return consistent JSON:

```json
{
  "success": false,
  "message": "Error description here"
}
```

Common status codes used:
- `400` — Bad request / validation error
- `401` — Unauthorized (missing or invalid token)
- `403` — Forbidden (trying to access another user's data)
- `404` — Resource not found
- `500` — Internal server error

---

## Author

**Sneha** — MCA Student  
GitHub: [@SnehaArya13](https://github.com/SnehaArya13)
