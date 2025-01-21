import { UrlModel, UrlAnalytics } from "../models/url.model";
import crypto from "crypto";
import axios from "axios";
import useragent from "useragent";

/**
 * Utility function to generate a unique hash for the URL.
 * @param {number} length - The length of the hash to generate (default is 6).
 * @returns {string} The generated hash.
 */
const generateShortHash = (length: number = 6): string => {
  return crypto.randomBytes(length).toString("hex").slice(0, length);
};

/**
 * Service to create a shortened URL.
 * @param {string} originalUrl - The original URL to shorten.
 * @param {Date | null} expirationDate - The expiration date for the shortened URL, if any.
 * @param {string} userId - The ID of the user creating the shortened URL.
 * @returns {Promise<Object>} The created shortened URL object.
 */
export const createShortUrl = async (
  originalUrl: string,
  expirationDate: Date | null,
  userId: string // Accept userId to associate the URL with a user
) => {
  const shortHash = generateShortHash();

  const newUrl = new UrlModel({
    originalUrl,
    shortHash,
    expirationDate,
    userId, // Associate the URL with the user
  });

  await newUrl.save();
  return newUrl;
};

/**
 * Service to find the original URL based on the short hash.
 * @param {string} shortHash - The shortened hash to lookup.
 * @returns {Promise<Object | null>} The original URL object or null if not found.
 */
export const findOriginalUrl = async (shortHash: string) => {
  // Find the URL by its hash
  const url = await UrlModel.findOne({ shortHash });

  if (!url) {
    return null; // URL not found
  }

  return url; // Return the URL to be redirected
};

/**
 * Function to track the analytics for a URL visit.
 * @param {string} urlId - The ID of the URL being visited.
 * @param {string} ipAddress - The IP address of the visitor.
 * @param {string} userAgentString - The User-Agent string of the visitor.
 * @returns {Promise<void>} A promise that resolves when the tracking is complete.
 */
export const trackAnalytics = async (urlId: string, ipAddress: string, userAgentString: string) => {
  try {
    // Increment the visit count by 1 (track the visit)
    const url = await UrlModel.findById(urlId);
    if (url) {
      url.visitCount += 1;
      await url.save(); // Save the updated visit count
    }

    // Parse the User-Agent string to get browser and device details
    const agent = useragent.parse(userAgentString);
    const browser = agent.toAgent();  // Browser name and version
    const device = agent.device.toString(); // Device name (mobile, tablet, etc.)

    // Get the visitor's location using the IP address
    const location = await getLocationFromIP(ipAddress);

    // Store the analytics in the database
    const analytics = new UrlAnalytics({
      urlId,
      browser,
      device,
      location,
    });
    await analytics.save(); // Save the analytics data
  } catch (err) {
    console.error("Error tracking analytics:", err);
  }
};

/**
 * Helper function to get location from the IP address.
 * @param {string} ipAddress - The IP address of the visitor.
 * @returns {Promise<string>} The location of the visitor as a string (city, region, etc.).
 */
const getLocationFromIP = async (ipAddress: string): Promise<string> => {
  try {
    const response = await axios.get(`http://ip-api.com/json/${ipAddress}`);
    if (response.data && response.data.city) {
      return response.data.city;  // You can store more information like region, country, etc.
    } else {
      return "Unknown Location";
    }
  } catch (err) {
    console.error("Error getting location:", err);
    return "Unknown Location";
  }
};

/**
 * Service to get the analytics data for a URL.
 * @param {string} shortHash - The short hash of the URL to fetch analytics for.
 * @returns {Promise<Object>} An object containing visit count and analytics data, or an error message.
 */
export const getUrlAnalytics = async (shortHash: string) => {
  try {
    // Find the original URL based on the short hash
    const url = await UrlModel.findOne({ shortHash });

    if (!url) {
      return { error: "URL not found" }; // Return an error message if URL not found
    }

    // Fetch the analytics data for this URL
    const analyticsData = await UrlAnalytics.find({ urlId: url._id });

    if (analyticsData.length === 0) {
      return { error: "No analytics data available for this URL" };
    }

    // Return the analytics data and visit count
    return {
      visitCount: url.visitCount,
      analytics: analyticsData,
    };
  } catch (err) {
    console.error("Error in getUrlAnalytics service:", err);
    return { error: "Error retrieving analytics data" };
  }
};

/**
 * Service to get all URLs for a specific user.
 * @param {string} userId - The ID of the user to fetch URLs for.
 * @returns {Promise<Object[]>} A list of URLs associated with the user, or an error message.
 */
export const getUserUrls = async (userId: string) => {
  try {
    // Find all URLs associated with the given userId
    const userUrls = await UrlModel.find({ userId });

    if (userUrls.length === 0) {
      return { error: "No URLs found for this user" };
    }

    // Return the list of URLs
    return userUrls;
  } catch (err) {
    console.error("Error retrieving URLs for the user:", err);
    return { error: "Error retrieving user URLs" };
  }
};

/**
 * Service to delete a URL for a specific user by shortHash.
 * @param {string} hash - The short hash of the URL to delete.
 * @returns {Promise<Object>} A success or error message based on the outcome of the deletion.
 */
export const deleteUrl = async (hash: string) => {
  try {
    // Find and delete the URL based on the shortHash alone (userId is handled by middleware)
    const deletedUrl = await UrlModel.findOneAndDelete({ shortHash: hash });

    if (!deletedUrl) {
      return { error: "URL not found or you do not have permission to delete it" };
    }

    // Return success message
    return { success: "URL deleted successfully" };
  } catch (err) {
    console.error("Error deleting URL:", err);
    return { error: "Error deleting URL" };
  }
};
