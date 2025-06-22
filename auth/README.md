# Authentication System

This authentication system provides secure user registration, login, and profile management for the Oromia Hinlala API.

## Features

- User registration with profile picture upload
- Secure login with JWT tokens
- Password hashing with bcrypt
- Role-based access control
- Profile management
- Password change functionality
- Token-based authentication middleware

## API Endpoints

### Public Routes (No Authentication Required)

#### 1. Register User
- **POST** `/api/auth/register`
- **Description**: Register a new user account
- **Content-Type**: `multipart/form-data`
- **Body**:
  ```json
  {
    "name": "John",
    "surname": "Doe",
    "country": "Ethiopia",
    "phone_number": "+251912345678",
    "password": "password123",
    "role": "tourist", // Optional, defaults to "tourist"
    "profile_picture": "file" // Optional
  }
  ```
- **Response**:
  ```json
  {
    "message": "User registered successfully",
    "user": {
      "id": 1,
      "name": "John",
      "surname": "Doe",
      "country": "Ethiopia",
      "phone_number": "+251912345678",
      "role": "tourist",
      "profile_picture_id": null,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
  ```

#### 2. Login User
- **POST** `/api/auth/login`
- **Description**: Authenticate user and get JWT token
- **Content-Type**: `application/json`
- **Body**:
  ```json
  {
    "phone_number": "+251912345678",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Login successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "John",
      "surname": "Doe",
      "country": "Ethiopia",
      "phone_number": "+251912345678",
      "role": "tourist",
      "profile_picture_id": null,
      "checked_out": false,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
  ```

### Protected Routes (Authentication Required)

All protected routes require the `Authorization` header with the JWT token:
```
Authorization: Bearer <your-jwt-token>
```

#### 3. Get User Profile
- **GET** `/api/auth/profile`
- **Description**: Get current user's profile information
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "id": 1,
    "name": "John",
    "surname": "Doe",
    "country": "Ethiopia",
    "phone_number": "+251912345678",
    "role": "tourist",
    "profile_picture_id": null,
    "checked_out": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
  ```

#### 4. Update User Profile
- **PUT** `/api/auth/profile`
- **Description**: Update current user's profile information
- **Headers**: `Authorization: Bearer <token>`
- **Content-Type**: `multipart/form-data`
- **Body**:
  ```json
  {
    "name": "Updated Name",
    "surname": "Updated Surname",
    "country": "Updated Country",
    "profile_picture": "file" // Optional
  }
  ```
- **Response**: Updated user object (without password)

#### 5. Change Password
- **POST** `/api/auth/change-password`
- **Description**: Change user's password
- **Headers**: `Authorization: Bearer <token>`
- **Content-Type**: `application/json`
- **Body**:
  ```json
  {
    "currentPassword": "oldpassword123",
    "newPassword": "newpassword123"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Password changed successfully"
  }
  ```

#### 6. Logout
- **POST** `/api/auth/logout`
- **Description**: Logout user (client-side token removal)
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "message": "Logged out successfully"
  }
  ```

## User Roles

The system supports the following user roles:

- **admin**: Full access to all features
- **tourist**: Regular user with limited access
- **employee**: Staff member with specific permissions
- **guide**: Tour guide with specialized access

## Middleware Functions

### Authentication Middleware

```javascript
const { authenticateToken, requireRole, requireAdmin } = require('./auth/authMiddleware');

// Protect route with authentication
router.get('/protected', authenticateToken, (req, res) => {
  // Route logic here
});

// Protect route with specific role
router.get('/admin-only', authenticateToken, requireAdmin, (req, res) => {
  // Admin only logic here
});

// Protect route with multiple roles
router.get('/staff-only', authenticateToken, requireRole(['admin', 'employee']), (req, res) => {
  // Staff only logic here
});
```

### Available Middleware Functions

- `authenticateToken`: Verifies JWT token and adds user info to request
- `requireRole(roles)`: Checks if user has specific role(s)
- `requireAdmin`: Checks if user is admin
- `requireGuide`: Checks if user is admin or guide
- `requireEmployee`: Checks if user is admin or employee
- `requireTourist`: Checks if user is admin or tourist
- `optionalAuth`: Optional authentication (doesn't fail if no token)

## Environment Variables

Add the following to your `.env` file:

```env
JWT_SECRET=your-super-secret-jwt-key-here
```

## Security Features

1. **Password Hashing**: All passwords are hashed using bcrypt with salt rounds of 10
2. **JWT Tokens**: Secure token-based authentication with 24-hour expiration
3. **Role-based Access Control**: Different permissions based on user roles
4. **File Upload Security**: Image files only, with size limits and type validation
5. **Input Validation**: Server-side validation for all inputs

## Error Handling

The authentication system provides detailed error messages:

- `400`: Bad Request (validation errors, user already exists)
- `401`: Unauthorized (invalid credentials, missing token, expired token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found (user not found)
- `500`: Internal Server Error

## Usage Examples

### Frontend Integration

```javascript
// Login
const loginResponse = await fetch('/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    phone_number: '+251912345678',
    password: 'password123'
  })
});

const { token, user } = await loginResponse.json();

// Store token
localStorage.setItem('token', token);

// Use token for authenticated requests
const profileResponse = await fetch('/api/auth/profile', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

### File Upload Example

```javascript
// Register with profile picture
const formData = new FormData();
formData.append('name', 'John');
formData.append('surname', 'Doe');
formData.append('country', 'Ethiopia');
formData.append('phone_number', '+251912345678');
formData.append('password', 'password123');
formData.append('profile_picture', fileInput.files[0]);

const registerResponse = await fetch('/api/auth/register', {
  method: 'POST',
  body: formData
});
``` 