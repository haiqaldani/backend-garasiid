# Backend GarasiID

A Node.js REST API for image management with MySQL database.
This is for test Fullstack Developer for GarasiID

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm (Node Package Manager)

## Database Setup

1. Create MySQL database:

    CREATE DATABASE garasiid;
    USE garasiid;

    CREATE TABLE images (
        id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(100) NOT NULL,
        filename VARCHAR(255) NOT NULL UNIQUE,
        path VARCHAR(255) NOT NULL,
        original_name VARCHAR(255) NOT NULL,
        size INT NOT NULL,
        mimetype VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

## Installation

1. Clone the repository:
    git clone <repository-url>
    cd backend-garasiid

2. Install dependencies:
    npm install

3. Create environment file:
    cp .env.example .env

4. Configure your .env file with your MySQL credentials:

    # Server Configuration
    PORT=5002
    NODE_ENV=development

    # MySQL Configuration
    DB_HOST=localhost
    DB_PORT=3306
    DB_USER=root
    DB_PASSWORD=your_password
    DB_NAME=garasiid

    # File Upload Configuration
    MAX_FILE_SIZE=5242880  # 5MB in bytes
    ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif
    UPLOAD_PATH=/public/images

    # API Configuration
    API_URL=http://localhost:5002

5. Create required directories:
    mkdir -p public/images

## Running the Application

Start the server:
    npm start

The API will be available at http://localhost:5002

## API Endpoints

### Upload Images
POST /api/images

Curl example:
    curl --location 'http://localhost:5002/api/images' \
    --form 'titles="Image Title 1"' \
    --form 'titles="Image Title 2"' \
    --form 'files=@"/path/to/image1.jpg"' \
    --form 'files=@"/path/to/image2.jpg"'

### Get All Images
GET /api/images

Curl example:
    curl --location 'http://localhost:5002/api/images'

### Update Image Title
PUT /api/images/:id

Curl example:
    curl --location --request PUT 'http://localhost:5002/api/images/1' \
    --header 'Content-Type: application/json' \
    --data '{"title": "Updated Title"}'

### Delete Image
DELETE /api/images/:id

Curl example:
    curl --location --request DELETE 'http://localhost:5002/api/images/1'

## File Upload Specifications

- Maximum file size: 5MB
- Allowed file types: JPEG, PNG, GIF
- Maximum files per upload: 10
- Each file must have a corresponding title

## Response Formats

### Success Response
{
    "success": true,
    "message": "Operation successful",
    "data": {
        // Response data here
    }
}

### Error Response
{
    "success": false,
    "message": "Error message here",
    "error": "Detailed error information (development mode only)"
}

## Development

To run in development mode with nodemon:
    npm run dev

## Error Handling

The API includes comprehensive error handling for:
- File validation
- Database operations
- Server errors
- Invalid requests

