"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/route.ts
const express_1 = __importDefault(require("express"));
const url_route_1 = __importDefault(require("./routes/url.route")); // Import URL-specific routes
const user_route_1 = __importDefault(require("./routes/user.route"));
const router = express_1.default.Router();
// Mount the URL routes under "/api"
router.use("/url", url_route_1.default);
router.use("/user", user_route_1.default);
exports.default = router;
