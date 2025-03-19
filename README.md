# Brew and Clay - Artisan Mugs E-commerce

## Setup Instructions

### MongoDB Atlas Setup

1. **Create a MongoDB Atlas Account**:

   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign up for a free account
   - Create a new project and cluster (the free tier is sufficient)

2. **Configure Database Access**:

   - In the Security tab, create a new database user with a username and password
   - Make sure to give this user read and write permissions

3. **Configure Network Access**:

   - In the Network Access tab, add your IP address or allow access from anywhere (for development)

4. **Get Your Connection String**:

   - Click on "Connect" on your cluster
   - Select "Connect your application"
   - Copy the connection string

5. **Update Your .env File**:
   - Open the `.env` file in the project root
   - Replace the placeholder in `MONGODB_URI` with your actual connection string
   - Replace `<username>` and `<password>` with your database user credentials

### Running the Application

1. **Install Dependencies**:

   ```
   npm install
   ```

2. **Start the Server**:

   ```
   npm start
   ```

3. **Access the Website**:
   - Open your browser and go to `http://localhost:3000`

## Features

- User authentication (signup/login)
- Product browsing and filtering
- Shopping cart functionality
- Wishlist management
- Responsive design for all devices

## Technologies Used

- Frontend: HTML, CSS, JavaScript, Tailwind CSS
- Backend: Node.js, Express.js
- Database: MongoDB Atlas
- Authentication: JWT (JSON Web Tokens)
