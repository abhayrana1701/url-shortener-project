"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUrlController = exports.getUserUrlsController = exports.getUrlAnalyticsController = exports.redirectUrl = exports.shortenUrl = void 0;
const url_service_1 = require("../services/url.service");
const url_service_2 = require("../services/url.service"); // Import the service you wrote
// Controller to handle URL shortening
const shortenUrl = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { originalUrl, expirationDate } = req.body;
    // Extract the userId from the authenticated user (assuming you're using JWT)
    const userId = req.userId;
    if (!originalUrl) {
        return res.status(400).json({ error: "Original URL is required" });
    }
    try {
        // Call the service to create the shortened URL
        const newUrl = yield (0, url_service_1.createShortUrl)(originalUrl, expirationDate, userId);
        // Return the full short URL (base URL + short hash)
        return res.json({
            shortUrl: `http://localhost:3000/${newUrl.shortHash}`,
        });
    }
    catch (err) {
        console.error("Error creating shortened URL:", err);
        return res.status(500).json({ error: "Error creating shortened URL" });
    }
});
exports.shortenUrl = shortenUrl;
// Controller to handle URL redirection
const redirectUrl = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { hash } = req.params;
    const ipAddress = req.ip; // Get the IP address of the client
    const userAgentString = req.get("User-Agent") || ""; // Get the User-Agent string from the request
    try {
        // Find the original URL based on the hash
        const url = yield (0, url_service_1.findOriginalUrl)(hash);
        if (!url) {
            return res.status(404).json({ error: "URL not found" });
        }
        // Check if the URL has expired
        if (url.expirationDate && new Date() > new Date(url.expirationDate)) {
            return res.status(410).json({ error: "URL has expired" });
        }
        // Track analytics (visit count, browser, device, location)
        yield (0, url_service_1.trackAnalytics)(url._id, ipAddress, userAgentString);
        // Redirect to the original URL
        return res.redirect(url.originalUrl);
    }
    catch (err) {
        return res.status(500).json({ error: "Error processing the URL" });
    }
});
exports.redirectUrl = redirectUrl;
// Get analytics data for a specific URL
const getUrlAnalyticsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { hash } = req.params;
    try {
        // Call the service to get the URL analytics
        const analyticsResult = yield (0, url_service_1.getUrlAnalytics)(hash);
        // Check if there's an error in the result
        if (analyticsResult.error) {
            return res.status(404).json({ error: analyticsResult.error });
        }
        // Return the analytics data
        return res.json(analyticsResult);
    }
    catch (err) {
        return res.status(500).json({ error: "Error retrieving analytics data" });
    }
});
exports.getUrlAnalyticsController = getUrlAnalyticsController;
// Middleware to fetch URLs for a specific user
const getUserUrlsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Extract the userId from the authenticated user (assumed to be set in req.user after JWT auth)
    const userId = req.userId;
    if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
    }
    try {
        // Call the service to get URLs for the user
        const userUrls = yield (0, url_service_2.getUserUrls)(userId);
        // Check if the service returned an error (response structure from getUserUrls)
        if ('error' in userUrls) {
            return res.status(404).json(userUrls); // If there was an error, respond with it
        }
        // Return the user's URLs if they are found
        return res.json({
            userUrls, // Send back the list of URLs
        });
    }
    catch (err) {
        console.error("Error fetching user URLs:", err);
        return res.status(500).json({ error: "Error fetching user URLs" });
    }
});
exports.getUserUrlsController = getUserUrlsController;
// Controller method for deleting a URL
const deleteUrlController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { hash } = req.params; // Extract the short hash of the URL to delete
    try {
        // Call the deleteUrl service to delete the URL
        const result = yield (0, url_service_2.deleteUrl)(hash);
        // Check if the service returned an error
        if ('error' in result) {
            return res.status(404).json(result); // Respond with the error if URL not found or deletion failed
        }
        // Return the success message if the URL is deleted
        return res.status(200).json(result); // Status 200 for successful deletion
    }
    catch (err) {
        console.error("Error deleting URL:", err);
        return res.status(500).json({ error: "Error deleting URL" });
    }
});
exports.deleteUrlController = deleteUrlController;
