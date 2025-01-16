import express from 'express';
import dotenv from 'dotenv';
import { MongoService } from './services/database.service';  // Import MongoDB service
import apiRoutes from './routes';  // Import the central router
import { Request } from 'express';
import { setupSwagger } from './swagger';

// Define the User interface according to your authentication system
interface User {
  id: string;

}

declare module 'express-serve-static-core' {
  interface Request {
    user?: User
    userId?: string; // Or number, or whatever type your userId is
  }
}


// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();

// Load port and base URL from .env, with fallback defaults
const port = process.env.PORT || 3000;  // Default to 3000 if not defined in .env
const baseUrl = process.env.BASE_URL || '/api';  // Default to '/api' if not defined

// Middleware setup
app.use(express.json());  // Body parsing middleware

// Use Swagger
setupSwagger(app);  // Add Swagger UI

// Use the MongoDB connection service before starting the server
const startServer = async () => {
  try {
    // Wait for MongoDB connection
    await MongoService.connect();  // Ensure MongoDB is connected before starting the server
    console.log('MongoDB Initialized');

    // Use the central router for all API routes
    app.use(baseUrl, apiRoutes);  // Use dynamic base URL for routes

    // Start the Express server after MongoDB is connected
    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

startServer();
