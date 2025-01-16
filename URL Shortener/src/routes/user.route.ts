import express, { Router } from "express";
import { signup, login } from "../controllers/auth.controller"; // Import your controllers

const router = Router();

// Define route handler types
type RouteHandler = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => Promise<any> | any;

// Wrapper function to handle async routes
const asyncHandler = (fn: RouteHandler) => (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  return Promise.resolve(fn(req, res, next)).catch(next);
};

// Route for user signup
/**
 * @swagger
 * /api/user/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User successfully registered
 *       400:
 *         description: User already exists
 *       500:
 *         description: Error creating user
 */
router.post("/signup", asyncHandler(signup));

// Route for user login
/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: Login a user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful, returns a JWT token
 *       400:
 *         description: Invalid email or password
 *       500:
 *         description: Error logging in
 */
router.post("/login", asyncHandler(login));

export default router;
