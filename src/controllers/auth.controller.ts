import { Request, Response } from "express";
import { signupUser, loginUser } from "../services/user.service";

/**
 * Signup controller to handle user registration.
 * 
 * @async
 * @function signup
 * @param {Request} req - The request object containing the user details (email, password) in the body.
 * @param {Response} res - The response object used to send the response back to the client.
 * @returns {Promise<Response>} - A response with a status code and message indicating the result of the signup process.
 */
export const signup = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Call signup service to create a new user
  const result = await signupUser(email, password);

  // Check if there was an error during the signup process
  if (result.error) {
    return res.status(400).json({ error: result.error });
  }

  // If signup was successful, return a success message
  return res.status(201).json({ message: result.message });
};

/**
 * Login controller to handle user authentication and token generation.
 * 
 * @async
 * @function login
 * @param {Request} req - The request object containing the user credentials (email, password) in the body.
 * @param {Response} res - The response object used to send the response back to the client.
 * @returns {Promise<Response>} - A response containing an access token, refresh token, and a message indicating the result of the login process.
 */
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Call login service to authenticate user and generate tokens
  const result = await loginUser(email, password);

  // If there was an error, return it
  if (result.error) {
    return res.status(400).json({ error: result.error });
  }

  // If login was successful, return both access and refresh tokens
  return res.json({
    message: result.message,
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
  });
};
