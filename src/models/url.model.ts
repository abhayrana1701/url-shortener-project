import mongoose, { Schema, Document } from "mongoose";

// Define the URL schema with the added userId field
const urlSchema = new Schema({
  originalUrl: { type: String, required: true, unique: true },
  shortHash: { type: String, required: true, unique: true },
  expirationDate: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
  visitCount: { type: Number, default: 0 }, // Track visit count
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },  // New userId field
});

// Create and export the model for URLs 
const UrlModel = mongoose.model<UrlDocument>("Url", urlSchema);

// Define the schema for analytics (to track visits)
const urlAnalyticsSchema = new Schema(
  {
    urlId: { type: mongoose.Schema.Types.ObjectId, ref: "Url", required: true }, // Reference to the URL
    visitedAt: { type: Date, default: Date.now }, // Time of the visit
    browser: { type: String }, // Browser used for the visit
    device: { type: String }, // Device type (mobile, desktop, etc.)
    location: { type: String }, // Location (e.g., city, country)
  },
  { timestamps: true }
);

// Create and export the model for URL analytics
const UrlAnalytics = mongoose.model<UrlAnalyticsDocument>("UrlAnalytics", urlAnalyticsSchema);

// Interfaces for documents
export interface UrlDocument extends Document {
  originalUrl: string;
  shortHash: string;
  expirationDate: Date | null;
  createdAt: Date;
  visitCount: number; // Store visit count directly in the URL
  userId: mongoose.Schema.Types.ObjectId; // Reference to the User model
}

export interface UrlAnalyticsDocument extends Document {
  urlId: mongoose.Schema.Types.ObjectId; // Reference to the URL
  visitedAt: Date;
  browser: string;
  device: string;
  location: string;
}

export { UrlModel, UrlAnalytics };
