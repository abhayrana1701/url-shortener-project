import { body, param } from 'express-validator';

/**
 * Validator for creating a shortened URL.
 */
export const createShortUrlValidator = [
  body('originalUrl')
    .notEmpty().withMessage('originalUrl is required')
    .isURL().withMessage('originalUrl must be a valid URL'),

  body('expirationDate')
    .optional()
    .isISO8601().withMessage('expirationDate must be a valid date in ISO 8601 format'),

  body('userId')
    .notEmpty().withMessage('userId is required')
    .isString().withMessage('userId must be a string'), // Removed isMongoId validation
];

/**
 * Validator for deleting a shortened URL.
 * We validate the shortHash parameter here.
 */
export const deleteShortUrlValidator = [
  param('shortHash')
    .notEmpty().withMessage('shortHash is required')
    .isString().withMessage('shortHash must be a string'),
];

/**
 * Validator for retrieving analytics of a shortened URL.
 * We validate the shortHash parameter here.
 */
export const getUrlAnalyticsValidator = [
  param('shortHash')
    .notEmpty().withMessage('shortHash is required')
    .isString().withMessage('shortHash must be a string'),
];
