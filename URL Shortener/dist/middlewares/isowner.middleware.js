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
exports.isOwner = void 0;
const url_model_1 = require("../models/url.model");
const isOwner = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { hash } = req.params; // The short hash of the URL
    const userId = req.userId; // The user ID from the decoded JWT
    try {
        let url;
        // If hash is provided, check ownership by shortHash
        if (hash) {
            url = yield url_model_1.UrlModel.findOne({ shortHash: hash });
        }
        // If no hash is provided, check ownership by userId
        else if (userId) {
            url = yield url_model_1.UrlModel.findOne({ userId });
        }
        // If no URL found for either condition, return an error
        if (!url) {
            return res.status(404).json({ error: "URL not found or user does not own any URLs" });
        }
        // Check if the user is the owner, either by hash or userId
        if (url.userId.toString() !== userId) {
            return res.status(403).json({ error: "You are not authorized to access this URL" });
        }
        next(); // The user is the owner, continue to the next middleware/controller
    }
    catch (error) {
        return res.status(500).json({ error: "Error checking URL ownership" });
    }
});
exports.isOwner = isOwner;
