import express from "express";
import cors from "cors";
import { connectDB } from "./db";
import { userRouter } from "./routes/user.route";
import { taskRouter } from "./routes/task.route";

const app = express();
app.use(express.json());

connectDB();

app.use(cors());

app.get("/health", (req, res) => {
  res.send("OK");
});

app.use("/api/v1/user", userRouter);
app.use("/api/v1/task", taskRouter);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
