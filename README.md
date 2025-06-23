# Agile Accounting Application

A comprehensive accounting **REST API** built with Node.js, Express.js, and MongoDB, featuring user authentication, account management, transaction tracking, and financial reporting capabilities.

> **Note**: This is a backend API only. No frontend is included in this project.

## 📁 Project Structure

```
agile-accounting-application/
├── middleware/
│   └── auth.js                 # Authentication middleware
├── models/
│   ├── Account.js             # Account data model
│   ├── Customer.js            # Customer data model
│   ├── Invoice.js             # Invoice data model
│   ├── Transaction.js         # Transaction data model
│   └── User.js                # User data model
├── routes/
│   ├── accounts.js            # Account management routes
│   ├── auth.js                # Authentication routes
│   └── transactions.js        # Transaction routes
├── .dockerignore              # Docker ignore file
├── .env                       # Environment variables
├── docker-compose.yml         # Docker Compose configuration
├── Dockerfile.backend         # Backend Docker configuration
├── Dockerfile.database        # Database Docker configuration
├── Dockerfile.frontend        # Frontend Docker configuration
├── mongo-init.js              # MongoDB initialization script
├── nginx.conf                 # Nginx configuration
├── package.json               # Node.js dependencies
└── server.js                  # Main server file
```

## 📋 Project Description

The Agile Accounting Application is a modern, RESTful API-based accounting system designed to handle:

- **User Management**: Secure user registration and authentication
- **Account Management**: Chart of accounts with different account types
- **Transaction Processing**: Double-entry bookkeeping system
- **Customer & Supplier Management**: Contact and relationship management
- **Invoice Management**: Invoice creation and tracking
- **Financial Reporting**: Real-time financial reports and analytics
- **Security**: JWT-based authentication, rate limiting, and data validation

## 🛠️ Tech Stack

### Backend API
- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.18+
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet, CORS, bcryptjs, express-rate-limit
- **Validation**: express-validator
- **Date Handling**: Moment.js

### DevOps & Deployment
- **Containerization**: Docker & Docker Compose
- **Environment Management**: dotenv

### Development Tools
- **Process Manager**: Nodemon (development)
- **Testing**: Jest
- **Package Manager**: npm

## 🔌 Ports Used

| Service | Port | Description |
|---------|------|-------------|
| Backend API | 3000 | Express.js REST API server |
| MongoDB | 27017 | Database server |

## 📋 Prerequisites

### For Local Development
- **Node.js**: Version 18 or higher
- **npm**: Version 8 or higher
- **MongoDB**: Version 5.0 or higher (local installation or MongoDB Atlas)
- **Git**: For version control

### For Docker Deployment
- **Docker**: Version 20.10 or higher
- **Docker Compose**: Version 2.0 or higher

## 🚀 Local Development Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd agile-accounting-application
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory:
```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/agile_accounting
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=24h
```

### 4. Start MongoDB
Ensure MongoDB is running on your local machine:
```bash
# On Windows (if installed as service)
net start MongoDB

# On macOS (using Homebrew)
brew services start mongodb-community

# On Linux (using systemd)
sudo systemctl start mongod
```

### 5. Initialize Database
The application will automatically create the database and collections on first run.

### 6. Start the Application
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The API will be available at `http://localhost:3000`

### 7. Health Check
Verify the application is running:
```bash
curl http://localhost:3000/api/health
```

## 🐳 Docker Deployment

### Quick Start with Docker Compose
```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### Manual Docker Build
```bash
# Build backend image
docker build -f Dockerfile.backend -t agile-accounting-backend .

# Build database image
docker build -f Dockerfile.database -t agile-accounting-db .

# Build frontend image
docker build -f Dockerfile.frontend -t agile-accounting-frontend .
```

### Docker Services
- **Database**: MongoDB with initialization script
- **Backend**: Node.js REST API server

> **Note**: The docker-compose.yml references a frontend service, but no frontend code exists in this project.

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Accounts
- `GET /api/accounts` - List all accounts
- `POST /api/accounts` - Create new account
- `PUT /api/accounts/:id` - Update account
- `DELETE /api/accounts/:id` - Delete account

### Transactions
- `GET /api/transactions` - List transactions
- `POST /api/transactions` - Create transaction
- `GET /api/transactions/:id` - Get transaction details

### Health Check
- `GET /api/health` - Application health status

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Rate limiting (100 requests per 15 minutes)
- CORS protection
- Helmet security headers
- Input validation and sanitization
- Environment variable protection

## 📊 Monitoring

The application includes:
- Health check endpoint for monitoring
- Structured error handling
- Request logging
- Uptime tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

**MongoDB Connection Error**
- Ensure MongoDB is running
- Check the MONGODB_URI in your .env file
- Verify network connectivity

**Port Already in Use**
- Change the PORT in .env file
- Kill existing processes using the port

**Docker Issues**
- Ensure Docker daemon is running
- Check Docker Compose version compatibility
- Verify port availability

### Support
For issues and questions, please create an issue in the repository.