"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSwagger = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
// Swagger definition
const swaggerDefinition = {
    openapi: '3.0.0', // OpenAPI version
    info: {
        title: 'URL Shortener API', // API title
        version: '1.0.0', // API version
        description: 'A service to shorten long URLs, track usage analytics such as location, device, and browser, and provide seamless redirection to the original link when clicked.',
    },
    servers: [
        {
            url: 'http://localhost:3000/api', // Base URL for your API
        },
    ],
};
// Options for swagger-jsdoc
const options = {
    swaggerDefinition,
    apis: ['./src/routes/*.ts',], // Path to the API docs (update the path based on your project structure)
};
// Initialize swagger-jsdoc
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
const setupSwagger = (app) => {
    app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
    console.log('Swagger UI is available at http://localhost:3000/api-docs');
};
exports.setupSwagger = setupSwagger;
