import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const uri : string = process.env.MONGODB_URI!;
if (!uri) {
  throw new Error("MONGODB_URI is not defined in the environment variables");
}

mongoose.set('strictQuery', false);  // To avoid deprecation warning

async function connectDB() {
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);  
  }
}

export { connectDB };
