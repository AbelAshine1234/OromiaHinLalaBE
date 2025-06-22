# Checkout API Documentation

## Overview
The Checkout API provides comprehensive functionality for managing tourist checkouts in the Oromia Hinlala system. It includes validation, unique key constraints, file uploads for passport images, and search capabilities.

## Base URL
```
http://localhost:3000/api/checkouts
```

## Authentication
Currently, the checkout endpoints don't require authentication, but this can be added in the future.

## Endpoints

### 1. Get All Checkouts
**GET** `/api/checkouts`

Retrieves all checkout records with their associated passport images.

**Response:**
```json
[
  {
    "id": 1,
    "name": "John",
    "country": "Ethiopia",
    "surname": "Doe",
    "accomodation": "Hotel Addis",
    "phone_number": "+251912345678",
    "has_paid": false,
    "no_of_guests": 2,
    "passport": 1,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "passportImage": {
      "id": 1,
      "image_url": "/uploads/passport_123.jpg"
    }
  }
]
```

### 2. Get Checkout by ID
**GET** `/api/checkouts/:id`

Retrieves a specific checkout by its ID.

**Parameters:**
- `id` (integer, required): The checkout ID

**Response:**
```json
{
  "id": 1,
  "name": "John",
  "country": "Ethiopia",
  "surname": "Doe",
  "accomodation": "Hotel Addis",
  "phone_number": "+251912345678",
  "has_paid": false,
  "no_of_guests": 2,
  "passport": 1,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "passportImage": {
    "id": 1,
    "image_url": "/uploads/passport_123.jpg"
  }
}
```

### 3. Create Checkout
**POST** `/api/checkouts`

Creates a new checkout record.

**Content-Type:** `multipart/form-data`

**Form Data:**
- `name` (string, required, 2-50 chars): Customer's first name
- `email` (string, required, unique): Customer's email address
- `country` (string, required, 2-50 chars): Customer's country
- `surname` (string, optional, 2-50 chars): Customer's surname
- `accomodation` (string, optional, 2-100 chars): Accommodation details
- `phone_number` (string, required, unique): Phone number in international format
- `no_of_guests` (integer, required, 1-20): Number of guests
- `has_paid` (boolean, optional): Payment status (defaults to false)
- `passport` (file, optional): Passport image file

**Validation Rules:**
- Phone number must be in international format (e.g., +251912345678)
- Phone number must be unique across all checkouts
- Email must be a valid format and unique
- Number of guests must be between 1 and 20
- Name and country are required fields

**Success Response (201):**
```json
{
  "checkout": {
    "id": 1,
    "name": "John",
    "email": "john.doe@example.com",
    "country": "Ethiopia",
    "surname": "Doe",
    "accomodation": "Hotel Addis",
    "phone_number": "+251912345678",
    "has_paid": false,
    "no_of_guests": 2,
    "passport": 1,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "passportImage": {
      "id": 1,
      "image_url": "/uploads/passport_123.jpg"
    }
  },
  "successUrl": "http://localhost:3000/api/checkouts/success/john.doe%40example.com"
}
```

**Error Responses:**
- `400 Bad Request`: Validation errors, duplicate phone number or email
- `500 Internal Server Error`: Server errors

### 4. Update Checkout
**PUT** `/api/checkouts/:id`

Updates an existing checkout record.

**Parameters:**
- `id` (integer, required): The checkout ID

**Content-Type:** `multipart/form-data`

**Form Data:** Same as create checkout (all fields optional for updates)

**Success Response (200):**
```json
{
  "id": 1,
  "name": "John Updated",
  "country": "Ethiopia",
  "surname": "Doe Updated",
  "accomodation": "Updated Hotel",
  "phone_number": "+251912345679",
  "has_paid": true,
  "no_of_guests": 3,
  "passport": 2,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "passportImage": {
    "id": 2,
    "image_url": "/uploads/passport_456.jpg"
  }
}
```

### 5. Delete Checkout
**DELETE** `/api/checkouts/:id`

Deletes a checkout record and its associated passport image.

**Parameters:**
- `id` (integer, required): The checkout ID

**Success Response (204):** No content

**Error Response (404):** Checkout not found

### 6. Verify Checkout Success
**GET** `/api/checkouts/success/:email`

This endpoint is intended to be accessed by scanning the QR code generated upon successful checkout. It displays a confirmation page with the checkout details.

**Parameters:**
- `email` (string, required): The user's email from the QR code URL.

**Response:**
An HTML page confirming the successful checkout.

### 7. Get Checkouts by Payment Status
**GET** `/api/checkouts/payment-status`

Filters checkouts by payment status.

**Query Parameters:**
- `has_paid` (boolean, required): Payment status to filter by

**Example:**
```
GET /api/checkouts/payment-status?has_paid=true
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "John",
    "country": "Ethiopia",
    "phone_number": "+251912345678",
    "has_paid": true,
    "no_of_guests": 2,
    "passportImage": {
      "id": 1,
      "image_url": "/uploads/passport_123.jpg"
    }
  }
]
```

### 8. Search Checkouts
**GET** `/api/checkouts/search`

Searches checkouts by name, country, surname, or accommodation.

**Query Parameters:**
- `q` (string, required): Search query

**Example:**
```
GET /api/checkouts/search?q=Hotel
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "John",
    "country": "Ethiopia",
    "surname": "Doe",
    "phone_number": "+251912345678",
    "has_paid": false,
    "no_of_guests": 2,
    "passportImage": {
      "id": 1,
      "image_url": "/uploads/passport_123.jpg"
    }
  }
]
```

## Validation Rules

### Required Fields
- `name`: String, 2-50 characters
- `email`: String, valid email format, unique
- `country`: String, 2-50 characters
- `phone_number`: String, international format, unique
- `no_of_guests`: Integer, 1-20

### Optional Fields
- `surname`: String, 2-50 characters
- `accomodation`: String, 2-100 characters
- `has_paid`: Boolean (defaults to false)
- `passport`: File upload

### Email Format
- Must be a valid email format
- Must be unique across all checkouts

### Phone Number Format
- Must be in international format
- Examples: `+251912345678`, `+1234567890`
- Must be unique across all checkouts

## Error Handling

### Validation Errors (400)
```json
{
  "error": "Validation error",
  "details": "phone_number must be a valid phone number"
}
```

### Duplicate Phone Number or Email (400)
```json
{
  "error": "Email already exists",
  "details": "A checkout with this email already exists"
}
```

### Not Found (404)
```json
{
  "error": "Checkout not found"
}
```

### Server Error (500)
```json
{
  "error": "Internal server error"
}
```

## File Upload

### Passport Images
- Supported formats: JPG, PNG, GIF
- File size limit: 5MB
- Stored in `/uploads` directory
- Automatically deleted when checkout is deleted or updated

### Upload Example
```bash
curl -X POST \
  -F "name=John" \
  -F "email=john.doe@example.com" \
  -F "country=Ethiopia" \
  -F "phone_number=+251912345678" \
  -F "no_of_guests=2" \
  -F "passport=@/path/to/passport.jpg" \
  http://localhost:3000/api/checkouts
```

## Database Schema

### Checkout Table
```sql
CREATE TABLE "Checkouts" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL,
  "country" VARCHAR(255) NOT NULL,
  "surname" VARCHAR(255),
  "email" VARCHAR(255) UNIQUE NOT NULL,
  "accomodation" VARCHAR(255),
  "phone_number" VARCHAR(255) UNIQUE NOT NULL,
  "has_paid" BOOLEAN DEFAULT false,
  "no_of_guests" INTEGER NOT NULL,
  "passport" INTEGER REFERENCES "Images"("id") ON DELETE SET NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL
);
```

## Testing with Postman

Import the provided `OromiaHinlala.postman_collection.json` file into Postman to test all endpoints with pre-configured requests.

### Environment Variables
Set up these environment variables in Postman:
- `baseUrl`: `http://localhost:3000/api`

### Test Scenarios
1. **Valid Checkout Creation**: Test with all required fields
2. **Duplicate Phone Number**: Test unique constraint
3. **Invalid Phone Format**: Test validation
4. **File Upload**: Test passport image upload
5. **Payment Status Filtering**: Test payment status queries
6. **Search Functionality**: Test name/country search

## Security Considerations

1. **Input Validation**: All inputs are validated using Joi schemas
2. **File Upload Security**: File types and sizes are restricted
3. **SQL Injection Protection**: Using Sequelize ORM with parameterized queries
4. **Unique Constraints**: Database-level unique constraints on phone numbers
5. **Error Handling**: Proper error responses without exposing sensitive information

## Future Enhancements

1. **Authentication**: Add JWT-based authentication
2. **Authorization**: Role-based access control
3. **Rate Limiting**: Prevent abuse
4. **Logging**: Comprehensive request/response logging
5. **Caching**: Redis-based caching for frequently accessed data
6. **Pagination**: Add pagination for large datasets
7. **Export**: CSV/Excel export functionality
8. **Notifications**: Email/SMS notifications for payment status changes 