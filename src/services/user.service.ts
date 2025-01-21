import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import UserModel from "../models/user.model";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "r9j5$w2wQ2nd!Bk7d28ZdA8Gtf8$6%G98D85vpt2dF6d6vMy3K8p";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "rewr345cft5yby567nu67u867jn67u6h67";

// Define interface for the JWT payload
interface JwtPayloadWithId extends jwt.JwtPayload {
  _id: string;
}

/**
 * Helper function to generate an access token for a user.
 * @param {string} userId - The user ID to include in the JWT payload.
 * @returns {string} The generated access token.
 */
const generateAccessToken = (userId: string) => {
  return jwt.sign({ _id: userId }, JWT_SECRET, { expiresIn: "15m" });
};

/**
 * Helper function to generate a refresh token for a user.
 * @param {string} userId - The user ID to include in the JWT payload.
 * @returns {string} The generated refresh token.
 */
const generateRefreshToken = (userId: string) => {
  return jwt.sign({ _id: userId }, JWT_REFRESH_SECRET, { expiresIn: "7d" });
};

/**
 * Service to register a new user.
 * @param {string} email - The email of the user to register.
 * @param {string} password - The password of the user to register.
 * @returns {Promise<Object>} An object containing a success message or an error.
 */
export const signupUser = async (email: string, password: string) => {
  try {
    // Check if the user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return { error: "User already exists" };
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const newUser = new UserModel({ email, password: hashedPassword });
    await newUser.save();

    return { message: "User registered successfully" };
  } catch (error) {
    console.error("Error in signupUser:", error);
    return { error: "Error creating user" };
  }
};

/**
 * Service to log in a user.
 * @param {string} email - The email of the user attempting to log in.
 * @param {string} password - The password of the user attempting to log in.
 * @returns {Promise<Object>} An object containing a success message, access token, refresh token, or an error.
 */
export const loginUser = async (email: string, password: string) => {
  try {
    // Find user by email
    const user = await UserModel.findOne({ email });
    if (!user) {
      return { error: "Invalid email or password" };
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return { error: "Invalid email or password" };
    }

    // Generate both access and refresh tokens
    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    return { message: "Login successful", accessToken, refreshToken };
  } catch (error) {
    console.error("Error in loginUser:", error);
    return { error: "Error logging in" };
  }
};

/**
 * Service to refresh the access token using the refresh token.
 * @param {string} refreshToken - The refresh token to be verified.
 * @returns {Promise<Object>} An object containing the new access token or an error message.
 */
export const refreshAccessToken = async (refreshToken: string) => {
  try {
    // Verify the refresh token and typecast to JwtPayloadWithId
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as JwtPayloadWithId;

    // Now you can safely access _id
    const user = await UserModel.findById(decoded._id);
    if (!user) {
      return { error: "Invalid refresh token" };
    }

    // Generate a new access token
    const newAccessToken = generateAccessToken(user._id.toString());

    return { newAccessToken };
  } catch (error) {
    console.error("Error in refreshAccessToken:", error);
    return { error: "Invalid or expired refresh token" };
  }
};
