import { Request, Response } from "express";
import { createShortUrl, findOriginalUrl, trackAnalytics, getUrlAnalytics } from "../services/url.service";
import * as urlService from "../services/url.service"; // Import the service layer
import { getUserUrls, deleteUrl  } from '../services/url.service'; // Import the service you wrote

// Controller to handle URL shortening
export const shortenUrl = async (req: Request, res: Response) => {
  const { originalUrl, expirationDate } = req.body;

  // Extract the userId from the authenticated user (assuming you're using JWT)
  const userId = req.userId;

  if (!originalUrl) {
    return res.status(400).json({ error: "Original URL is required" });
  }

  try {
    // Call the service to create the shortened URL
    const newUrl = await createShortUrl(originalUrl, expirationDate, userId!);

    // Return the full short URL (base URL + short hash)
    return res.json({
      shortUrl: `http://localhost:3000/${newUrl.shortHash}`,
    });
  } catch (err) {
    console.error("Error creating shortened URL:", err);
    return res.status(500).json({ error: "Error creating shortened URL" });
  }
};

// Controller to handle URL redirection
export const redirectUrl = async (req: Request, res: Response) => {
  const { hash } = req.params;
  const ipAddress = req.ip as string; // Get the IP address of the client
  const userAgentString = req.get("User-Agent") || ""; // Get the User-Agent string from the request

  try {
    // Find the original URL based on the hash
    const url = await findOriginalUrl(hash);

    if (!url) {
      return res.status(404).json({ error: "URL not found" });
    }

    // Check if the URL has expired
    if (url.expirationDate && new Date() > new Date(url.expirationDate)) {
      return res.status(410).json({ error: "URL has expired" });
    }

    // Track analytics (visit count, browser, device, location)
    await trackAnalytics(url._id, ipAddress, userAgentString);

    // Redirect to the original URL
    return res.redirect(url.originalUrl);
  } catch (err) {
    return res.status(500).json({ error: "Error processing the URL" });
  }
};

// Get analytics data for a specific URL
export const getUrlAnalyticsController = async (req: Request, res: Response) => {
  const { hash } = req.params;

  try {
    // Call the service to get the URL analytics
    const analyticsResult = await getUrlAnalytics(hash);

    // Check if there's an error in the result
    if (analyticsResult.error) {
      return res.status(404).json({ error: analyticsResult.error });
    }

    // Return the analytics data
    return res.json(analyticsResult);
  } catch (err) {
    return res.status(500).json({ error: "Error retrieving analytics data" });
  }
};

// Middleware to fetch URLs for a specific user
export const getUserUrlsController = async (req: Request, res: Response) => {
  // Extract the userId from the authenticated user (assumed to be set in req.user after JWT auth)
  const userId = req.userId;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    // Call the service to get URLs for the user
    const userUrls = await getUserUrls(userId);

    // Check if the service returned an error (response structure from getUserUrls)
    if ('error' in userUrls) {
      return res.status(404).json(userUrls); // If there was an error, respond with it
    }

    // Return the user's URLs if they are found
    return res.json({
      userUrls, // Send back the list of URLs
    });
  } catch (err) {
    console.error("Error fetching user URLs:", err);
    return res.status(500).json({ error: "Error fetching user URLs" });
  }
};

// Controller method for deleting a URL
export const deleteUrlController = async (req: Request, res: Response) => {
  const { hash } = req.params;  // Extract the short hash of the URL to delete

  try {
    // Call the deleteUrl service to delete the URL
    const result = await deleteUrl(hash);

    // Check if the service returned an error
    if ('error' in result) {
      return res.status(404).json(result);  // Respond with the error if URL not found or deletion failed
    }

    // Return the success message if the URL is deleted
    return res.status(200).json(result);  // Status 200 for successful deletion
  } catch (err) {
    console.error("Error deleting URL:", err);
    return res.status(500).json({ error: "Error deleting URL" });
  }
};
