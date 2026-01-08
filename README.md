# CipherCanvas Backend

A professional Node.js/Express backend with MongoDB and JWT authentication.

## Features

- 🔐 **JWT Authentication** - Secure user authentication with JSON Web Tokens
- 🗄️ **MongoDB Integration** - Using Mongoose ODM for data modeling
- 🔒 **Password Hashing** - Secure password storage with bcrypt
- 🛡️ **Protected Routes** - Middleware-based route protection
- ⚡ **Modern Architecture** - Clean code structure with MVC pattern
- 🔄 **Auto-reload** - Development server with nodemon

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally or remote connection)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cipherCanvas-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and configure your settings:
   - `PORT` - Server port (default: 5000)
   - `MONGODB_URI` - MongoDB connection string
   - `JWT_SECRET` - Secret key for JWT (use a strong random string)
   - `JWT_EXPIRE` - Token expiration time (default: 7d)
   - `CORS_ORIGIN` - Allowed CORS origin

4. **Start MongoDB**
   
   Make sure MongoDB is running locally:
   ```bash
   # On macOS with Homebrew
   brew services start mongodb-community
   
   # Or run directly
   mongod
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/profile` | Get user profile | Yes |

### Request Examples

**Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

**Get Profile:**
```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer <your-jwt-token>"
```

## Project Structure

```
cipherCanvas-backend/
├── src/
│   ├── config/
│   │   ├── database.js      # MongoDB connection configuration
│   │   └── jwt.js           # JWT utility functions
│   ├── controllers/
│   │   └── authController.js # Authentication logic
│   ├── middleware/
│   │   └── auth.js          # JWT verification middleware
│   ├── models/
│   │   └── User.js          # User schema and model
│   ├── routes/
│   │   └── auth.js          # Authentication routes
│   └── index.js             # Application entry point
├── .env                      # Environment variables (not in git)
├── .env.example              # Environment variables template
├── .gitignore                # Git ignore rules
├── package.json              # Project dependencies
└── README.md                 # Project documentation
```

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with auto-reload

## Security Best Practices

- Never commit `.env` file
- Use strong JWT secrets in production
- Enable HTTPS in production
- Implement rate limiting for authentication endpoints
- Add input validation and sanitization
- Keep dependencies updated

## License

MIT
