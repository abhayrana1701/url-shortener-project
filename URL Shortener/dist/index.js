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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_service_1 = require("./services/database.service"); // Import MongoDB service
const routes_1 = __importDefault(require("./routes")); // Import the central router
const swagger_1 = require("./swagger");
// Load environment variables from .env file
dotenv_1.default.config();
// Initialize Express app
const app = (0, express_1.default)();
// Load port and base URL from .env, with fallback defaults
const port = process.env.PORT || 3000; // Default to 3000 if not defined in .env
const baseUrl = process.env.BASE_URL || '/api'; // Default to '/api' if not defined
// Middleware setup
app.use(express_1.default.json()); // Body parsing middleware
// Use Swagger
(0, swagger_1.setupSwagger)(app); // Add Swagger UI
// Use the MongoDB connection service before starting the server
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Wait for MongoDB connection
        yield database_service_1.MongoService.connect(); // Ensure MongoDB is connected before starting the server
        console.log('MongoDB Initialized');
        // Use the central router for all API routes
        app.use(baseUrl, routes_1.default); // Use dynamic base URL for routes
        // Start the Express server after MongoDB is connected
        app.listen(port, () => {
            console.log(`Server is running at http://localhost:${port}`);
        });
    }
    catch (error) {
        console.error('Failed to start server:', error);
    }
});
startServer();
