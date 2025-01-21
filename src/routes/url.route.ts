import express, { Router } from "express";
import * as urlController from "../controllers/url.controller"; // Controller functions for URLs
import { validateUrl } from "../middlewares/url.validator.middleware"; // Import the validation middleware
import { isOwner } from "../middlewares/isowner.middleware"; // Import the isOwner middleware
import { authMiddleware } from "../middlewares/auth.middleware"; // Your new authMiddleware
import createRateLimiter from '../middlewares/ratelimiter.middleware'; 
import {createShortUrlValidator, deleteShortUrlValidator,  getUrlAnalyticsValidator} from '../validation/url.validation';

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

const authRateLimiter = createRateLimiter(); // Create a rate limiter instance for url routes

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
router.get(
  "/manage/urls",
  authRateLimiter,
  asyncHandler(authMiddleware),
  asyncHandler(isOwner),
  asyncHandler(urlController.getUserUrlsController)
);

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
router.delete(
  "/manage/:hash",
  authRateLimiter,
  deleteShortUrlValidator,
  asyncHandler(authMiddleware),
  asyncHandler(isOwner),
  asyncHandler(urlController.deleteUrlController)
);


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
router.post(
  '/shorten',
  authRateLimiter,
  createShortUrlValidator,
  asyncHandler(authMiddleware),
  asyncHandler(validateUrl),
  asyncHandler(urlController.shortenUrl)
);

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
router.get('/:hash', authRateLimiter, asyncHandler(urlController.redirectUrl));

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
router.get(
  '/analytics/:hash',
  authRateLimiter,
  getUrlAnalyticsValidator,
  asyncHandler(authMiddleware),
  asyncHandler(isOwner),
  asyncHandler(urlController.getUrlAnalyticsController)
);

export default router;
