import { Request, Response, NextFunction } from "express";

// Middleware to validate the URL format
export const validateUrl = (req: Request, res: Response, next: NextFunction) => {
  const { originalUrl } = req.body;

  if (!originalUrl) {
    return res.status(400).json({ error: "Original URL is required" });
  }

  // Check if the original URL is a valid URL using the URL constructor
  try {
    new URL(originalUrl); // The URL constructor throws an error if the URL is invalid
  } catch (err) {
    return res.status(400).json({ error: "Invalid URL format" });
  }

  // Optionally, you can add additional validation rules here (e.g., URL length, domain checks, etc.)

  next(); // Proceed to the next middleware or route handler
};
