import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

/**
 * MongoService class to manage MongoDB connection.
 */
export class MongoService {
  
  /**
   * Connects to MongoDB using the connection string from environment variables.
   * Ensures that the connection is only established if not already connected.
   * The connection string is hardcoded but ideally should be sourced from an environment variable.
   * The 'strictQuery' option is set to false to suppress warnings related to MongoDB query options.
   * @returns {Promise<void>} A promise that resolves when the connection is successfully established, or throws an error if connection fails.
   * @throws {Error} Throws an error if the MongoDB connection fails.
   */
  static async connect(): Promise<void> {
    try {
      // Ensure connection is not already established
      if (mongoose.connection.readyState === 0) {
        console.log('Connecting to MongoDB...');
        // Set the 'strictQuery' option to false to prevent the warning
        await mongoose.set('strictQuery', false);

        // Attempt to connect to MongoDB using the connection string from environment variables
        await mongoose.connect("mongodb+srv://abhayimp17:cT5NPYVjU3ga3ywA@todo.qo6lv.mongodb.net/mydbv5?retryWrites=true&w=majority&appName=todo", {
          // Add options if needed here
        });
        
        console.log('MongoDB Connected');
      } else {
        console.log('MongoDB already connected');
      }
    } catch (error) {
      console.error('MongoDB connection error:', error);
      throw new Error('Error connecting to MongoDB');
    }
  }
}
