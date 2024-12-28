import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();
const uri = "mongodb+srv://kevthummar178:kevinmongodb11@cluster0.cfsjm.mongodb.net/"
// const uri: string = process.env.MONGO_URI as string;
// console.log('MONGO_URI:', process.env.MONGO_URI);
const client = new MongoClient(uri);

async function connectDB() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
}

export { client, connectDB };