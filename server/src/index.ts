import express from 'express';
import cors from 'cors';
import { connectDB } from './db';
import { userRouter } from './routes/user.route';

const app = express();
app.use(express.json()); 

connectDB();

app.use(cors({
  origin: 'http://localhost:3000', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, 
}));

app.get("/health", (req, res) => {
  res.send("OK");
});

app.use('api/v1/user', userRouter);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});