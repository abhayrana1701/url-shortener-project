import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export class MongoService {
  static async connect(): Promise<void> {
    try {
      // Ensure connection is not already established
      if (mongoose.connection.readyState === 0) {
        console.log('Connecting to MongoDB...');
        
        // Attempt to connect to MongoDB using the connection string from environment variables
        await mongoose.connect("mongodb+srv://abhayimp17:cT5NPYVjU3ga3ywA@todo.qo6lv.mongodb.net/mydbv4?retryWrites=true&w=majority&appName=todo", {
      
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
