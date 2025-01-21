"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || "r9j5$w2wQ2nd!Bk7d28ZdA8Gtf8$6%G98D85vpt2dF6d6vMy3K8p";
const authMiddleware = (req, res, next) => {
    var _a;
    const token = (_a = req.header("Authorization")) === null || _a === void 0 ? void 0 : _a.replace("Bearer ", "");
    if (!token) {
        return res.status(401).json({ error: "Access denied, no token provided" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.userId = decoded.userId; // Attach user ID to request
        next();
    }
    catch (error) {
        return res.status(401).json({ error: "Invalid or expired token" });
    }
};
exports.authMiddleware = authMiddleware;
