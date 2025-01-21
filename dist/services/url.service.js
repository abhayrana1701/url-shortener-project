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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUrl = exports.getUserUrls = exports.getUrlAnalytics = exports.trackAnalytics = exports.findOriginalUrl = exports.createShortUrl = void 0;
const url_model_1 = require("../models/url.model");
const crypto_1 = __importDefault(require("crypto"));
const axios_1 = __importDefault(require("axios"));
const useragent_1 = __importDefault(require("useragent"));
// Utility function to generate a unique hash for the URL
const generateShortHash = (length = 6) => {
    return crypto_1.default.randomBytes(length).toString("hex").slice(0, length);
};
// Service to create a shortened URL
const createShortUrl = (originalUrl, expirationDate, userId // Accept userId to associate the URL with a user
) => __awaiter(void 0, void 0, void 0, function* () {
    const shortHash = generateShortHash();
    const newUrl = new url_model_1.UrlModel({
        originalUrl,
        shortHash,
        expirationDate,
        userId, // Associate the URL with the user
    });
    yield newUrl.save();
    return newUrl;
});
exports.createShortUrl = createShortUrl;
// Service to find the original URL based on the short hash
const findOriginalUrl = (shortHash) => __awaiter(void 0, void 0, void 0, function* () {
    // Find the URL by its hash
    const url = yield url_model_1.UrlModel.findOne({ shortHash });
    if (!url) {
        return null; // URL not found
    }
    return url; // Return the URL to be redirected
});
exports.findOriginalUrl = findOriginalUrl;
// Function to track the analytics for a URL visit
const trackAnalytics = (urlId, ipAddress, userAgentString) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Increment the visit count by 1 (track the visit)
        const url = yield url_model_1.UrlModel.findById(urlId);
        if (url) {
            url.visitCount += 1;
            yield url.save(); // Save the updated visit count
        }
        // Parse the User-Agent string to get browser and device details
        const agent = useragent_1.default.parse(userAgentString);
        const browser = agent.toAgent(); // Browser name and version
        const device = agent.device.toString(); // Device name (mobile, tablet, etc.)
        // Get the visitor's location using the IP address
        const location = yield getLocationFromIP(ipAddress);
        // Store the analytics in the database
        const analytics = new url_model_1.UrlAnalytics({
            urlId,
            browser,
            device,
            location,
        });
        yield analytics.save(); // Save the analytics data
    }
    catch (err) {
        console.error("Error tracking analytics:", err);
    }
});
exports.trackAnalytics = trackAnalytics;
// Helper function to get location from the IP address (using ip-api)
const getLocationFromIP = (ipAddress) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.get(`http://ip-api.com/json/${ipAddress}`);
        if (response.data && response.data.city) {
            return response.data.city; // You can store more information like region, country, etc.
        }
        else {
            return "Unknown Location";
        }
    }
    catch (err) {
        console.error("Error getting location:", err);
        return "Unknown Location";
    }
});
// Service to get the analytics data for a URL
const getUrlAnalytics = (shortHash) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Find the original URL based on the short hash
        const url = yield url_model_1.UrlModel.findOne({ shortHash });
        if (!url) {
            return { error: "URL not found" }; // Return an error message if URL not found
        }
        // Fetch the analytics data for this URL
        const analyticsData = yield url_model_1.UrlAnalytics.find({ urlId: url._id });
        if (analyticsData.length === 0) {
            return { error: "No analytics data available for this URL" };
        }
        // Return the analytics data and visit count
        return {
            visitCount: url.visitCount,
            analytics: analyticsData,
        };
    }
    catch (err) {
        console.error("Error in getUrlAnalytics service:", err);
        return { error: "Error retrieving analytics data" };
    }
});
exports.getUrlAnalytics = getUrlAnalytics;
// Service to get all URLs for a specific user
const getUserUrls = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Find all URLs associated with the given userId
        const userUrls = yield url_model_1.UrlModel.find({ userId });
        if (userUrls.length === 0) {
            return { error: "No URLs found for this user" };
        }
        // Return the list of URLs
        return userUrls;
    }
    catch (err) {
        console.error("Error retrieving URLs for the user:", err);
        return { error: "Error retrieving user URLs" };
    }
});
exports.getUserUrls = getUserUrls;
// Service to delete a URL for a specific user by shortHash
const deleteUrl = (hash) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Find and delete the URL based on the shortHash alone (userId is handled by middleware)
        const deletedUrl = yield url_model_1.UrlModel.findOneAndDelete({ shortHash: hash });
        if (!deletedUrl) {
            return { error: "URL not found or you do not have permission to delete it" };
        }
        // Return success message
        return { success: "URL deleted successfully" };
    }
    catch (err) {
        console.error("Error deleting URL:", err);
        return { error: "Error deleting URL" };
    }
});
exports.deleteUrl = deleteUrl;
