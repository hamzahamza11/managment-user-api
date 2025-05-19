# User Management API

A NestJS-based API for managing users, applications, and permissions with PostgreSQL database.

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd management-user-api
```

2. Install dependencies:
```bash
npm install
```

## Database Setup

1. Create a PostgreSQL database:
```bash
 docker-compose up -d
```
The application uses the following default database configuration:
- Host: localhost
- Port: 5432
- Username: postgres
- Password: postgres
- Database: management_app

You can modify these settings in `src/app.module.ts` if needed.

## Running the Application

1. Start the development server:
```bash
npm run start
```

The server will start on `http://localhost:4001`

## API Endpoints

### Authentication
- `POST /auth/login` - Login with email and password
- `POST /auth/signup` - Register a new user

### Users
- `GET /users` - List all users
- `GET /users/:id` - Get user details
- `POST /users` - Create a new user (admin only)
- `PUT /users/:id` - Update a user (admin only)
- `DELETE /users/:id` - Delete a user (admin only)

### Applications
- `GET /applications` - List all applications
- `GET /applications/:id` - Get application details
- `POST /applications` - Create a new application (admin only)
- `PUT /applications/:id` - Update an application (admin only)
- `DELETE /applications/:id` - Delete an application (admin only)

### Permissions
- `GET /users/:userId/permissions` - List user permissions
- `POST /users/:userId/permissions` - Add/modify user permission
- `DELETE /users/:userId/permissions/:applicationId` - Remove user permission

## Initial Setup

After starting the application, the following will be automatically created:
1. Admin user (email: admin@example.com, password: admin123)
2. Management application
3. Admin permissions for the management application

## Scripts

- `npm run start:dev` - Start development server
- `npm run build` - Build the application
- `npm run start:prod` - Start production server
- `npm run lint` - Run linting
- `npm run test` - Run tests

## Security

- All endpoints (except login and signup) require JWT authentication
- Passwords are hashed using bcrypt
- Role-based access control is implemented
- Permissions are checked for each application

## Error Handling

The API uses standard HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Development

### Project Structure
```
src/
├── auth/           # Authentication module
├── users/          # Users module
├── applications/   # Applications module
├── permissions/    # Permissions module
├── database/       # Database configuration
└── scripts/        # Utility scripts
```

