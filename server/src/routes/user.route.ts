import express, { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import { authenticate , AuthenticatedRequest} from "../middleware/auth";

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}
// Register User
router.post("/register", async (req: Request, res: Response) : Promise<any> => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, firstName, lastName },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    const userResponse: User = {
      id: newUser._id.toString(),
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
    };

    res.status(201).json({ message: "User registered successfully", token, user: userResponse });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
});

// Login User
router.post("/login", async (req: Request, res: Response) : Promise<any> => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    const userResponse: User = {
      id: user._id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    res.status(200).json({ message: "Login successful", token, user: userResponse });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
});

// Get User Details (Protected Route)
router.get("/me", authenticate, async (req: AuthenticatedRequest, res: Response) : Promise<any> => {
  try {
    const userId = req.user?.id;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userResponse: User = {
      id: user._id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    res.status(200).json(userResponse);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
});

// Delete User (Protected Route)
router.delete("/delete", authenticate, async (req: AuthenticatedRequest, res: Response) : Promise<any> => {
  try {
    const userId = req.user?.id;
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
});


export const userRouter: Router = router;
