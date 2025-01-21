"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const urlController = __importStar(require("../controllers/url.controller")); // Controller functions for URLs
const url_validator_middleware_1 = require("../middlewares/url.validator.middleware"); // Import the validation middleware
const isowner_middleware_1 = require("../middlewares/isowner.middleware"); // Import the isOwner middleware
const auth_middleware_1 = require("../middlewares/auth.middleware"); // Your new authMiddleware
const router = (0, express_1.Router)();
// Wrapper function to handle async routes
const asyncHandler = (fn) => (req, res, next) => {
    return Promise.resolve(fn(req, res, next)).catch(next);
};
/**
 * @openapi
 * /api/manage/urls:
 *   get:
 *     summary: Get all URLs owned by the authenticated user
 *     description: Retrieves a list of all shortened URLs owned/created by the authenticated user.
 *     tags:
 *       - URL Management
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of URLs created by the user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userUrls:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       shortUrl:
 *                         type: string
 *                         description: The shortened URL.
 *                         example: "http://localhost:3000/abc123"
 *                       originalUrl:
 *                         type: string
 *                         description: The original URL before shortening.
 *                         example: "http://example.com"
 *       404:
 *         description: No URLs found for this user.
 *       401:
 *         description: Unauthorized. User needs to be authenticated.
 *       500:
 *         description: Internal server error while retrieving URLs.
 */
router.get("/manage/urls", asyncHandler(auth_middleware_1.authMiddleware), asyncHandler(isowner_middleware_1.isOwner), asyncHandler(urlController.getUserUrlsController));
/**
 * @openapi
 * /api/manage/{hash}:
 *   delete:
 *     summary: Delete a specific shortened URL by hash
 *     description: Deletes a shortened URL identified by its hash, but only if the user is the owner of the URL.
 *     tags:
 *       - URL Management
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: hash
 *         required: true
 *         description: The hash representing the shortened URL to delete.
 *         schema:
 *           type: string
 *           example: "abc123"
 *     responses:
 *       200:
 *         description: URL successfully deleted.
 *       404:
 *         description: URL not found or you do not have permission to delete it.
 *       401:
 *         description: Unauthorized. User needs to be authenticated.
 *       500:
 *         description: Internal server error while deleting the URL.
 */
router.delete("/manage/:hash", asyncHandler(auth_middleware_1.authMiddleware), asyncHandler(isowner_middleware_1.isOwner), asyncHandler(urlController.deleteUrlController));
/**
 * @openapi
 * /api/url/shorten:
 *   post:
 *     summary: Shorten a URL
 *     description: Given a valid URL, shorten it and return the shortened URL.
 *     tags:
 *       - URL Shortening
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               originalUrl:
 *                 type: string
 *                 description: The URL to shorten.
 *                 example: "http://example.com"
 *               expirationDate:
 *                 type: string
 *                 format: date-time
 *                 description: Optional expiration date of the shortened URL.
 *                 example: "2023-12-31T23:59:59Z"
 *     responses:
 *       200:
 *         description: The shortened URL has been created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 shortUrl:
 *                   type: string
 *                   description: The shortened URL.
 *                   example: "http://localhost:3000/abc123"
 *       400:
 *         description: Invalid or missing original URL.
 *       401:
 *         description: Authentication required. User must be logged in.
 *       500:
 *         description: Internal server error.
 */
router.post('/shorten', asyncHandler(auth_middleware_1.authMiddleware), asyncHandler(url_validator_middleware_1.validateUrl), asyncHandler(urlController.shortenUrl));
/**
 * @openapi
 * /api/url/{hash}:
 *   get:
 *     summary: Redirect to the original URL
 *     description: Redirects to the original URL based on the short hash.
 *     tags:
 *       - URL Shortening
 *     parameters:
 *       - in: path
 *         name: hash
 *         required: true
 *         description: The hash representing the shortened URL.
 *         schema:
 *           type: string
 *           example: "abc123"
 *     responses:
 *       301:
 *         description: Successfully redirected to the original URL.
 *       404:
 *         description: URL not found with the provided hash.
 *       410:
 *         description: The URL has expired and is no longer valid.
 *       500:
 *         description: Internal server error while processing the URL.
 */
router.get('/:hash', asyncHandler(urlController.redirectUrl));
/**
 * @openapi
 * /api/url/analytics/{hash}:
 *   get:
 *     summary: Get analytics for a shortened URL
 *     description: Retrieves the analytics (visit count, browser, device, location) for a specific shortened URL. Only the owner of the URL can access the data.
 *     tags:
 *       - URL Analytics
 *     parameters:
 *       - in: path
 *         name: hash
 *         required: true
 *         description: The hash representing the shortened URL.
 *         schema:
 *           type: string
 *           example: "abc123"
 *     responses:
 *       200:
 *         description: The analytics data for the shortened URL.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 visitCount:
 *                   type: integer
 *                   description: Total number of visits to the shortened URL.
 *                   example: 150
 *                 analytics:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       browser:
 *                         type: string
 *                         description: The browser used by the visitor.
 *                         example: "Chrome/92.0.4515.159"
 *                       device:
 *                         type: string
 *                         description: The device type used by the visitor (e.g., mobile, desktop).
 *                         example: "Mobile"
 *                       location:
 *                         type: string
 *                         description: The location of the visitor based on their IP address.
 *                         example: "New York"
 *       403:
 *         description: Forbidden. The user must be the owner of the URL to access analytics.
 *       404:
 *         description: URL not found.
 *       500:
 *         description: Internal server error while retrieving analytics data.
 */
router.get('/analytics/:hash', asyncHandler(auth_middleware_1.authMiddleware), asyncHandler(isowner_middleware_1.isOwner), asyncHandler(urlController.getUrlAnalyticsController));
exports.default = router;
