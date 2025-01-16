import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import UserModel from "../models/user.model";
import dotenv from "dotenv";

dotenv.config();

// JWT Secret Key from environment variables
const JWT_SECRET = process.env.JWT_SECRET || "r9j5$w2wQ2nd!Bk7d28ZdA8Gtf8$6%G98D85vpt2dF6d6vMy3K8p";

// Signup controller
export const signup = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const newUser = new UserModel({ email, password });
    await newUser.save();

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Error creating user" });
  }
};

// Login controller
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  console.log("yes");

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Using comparePassword which is now part of IUser interface
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Create JWT
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "1d", // Token expires in 1 day
    });

    return res.json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    return res.status(500).json({ error: "Error logging in" });
  }
};
