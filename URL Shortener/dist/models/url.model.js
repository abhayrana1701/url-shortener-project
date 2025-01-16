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
exports.UrlAnalytics = exports.UrlModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
// Define the URL schema with the added userId field
const urlSchema = new mongoose_1.Schema({
    originalUrl: { type: String, required: true, unique: true },
    shortHash: { type: String, required: true, unique: true },
    expirationDate: { type: Date, default: null },
    createdAt: { type: Date, default: Date.now },
    visitCount: { type: Number, default: 0 }, // Track visit count
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User", required: true }, // New userId field
});
// Create and export the model for URLs 
const UrlModel = mongoose_1.default.model("Url", urlSchema);
exports.UrlModel = UrlModel;
// Define the schema for analytics (to track visits)
const urlAnalyticsSchema = new mongoose_1.Schema({
    urlId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Url", required: true }, // Reference to the URL
    visitedAt: { type: Date, default: Date.now }, // Time of the visit
    browser: { type: String }, // Browser used for the visit
    device: { type: String }, // Device type (mobile, desktop, etc.)
    location: { type: String }, // Location (e.g., city, country)
}, { timestamps: true });
// Create and export the model for URL analytics
const UrlAnalytics = mongoose_1.default.model("UrlAnalytics", urlAnalyticsSchema);
exports.UrlAnalytics = UrlAnalytics;
