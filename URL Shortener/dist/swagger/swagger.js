"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSwagger = void 0;
var swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
var swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
// Swagger definition
var swaggerDefinition = {
    openapi: '3.0.0', // OpenAPI version
    info: {
        title: 'My API', // API title
        version: '1.0.0', // API version
        description: 'A service to shorten long URLs and track usage analytics such as location, device, and browser.',
    },
    servers: [
        {
            url: 'http://localhost:3000/api', // Base URL for your API
        },
    ],
};
// Options for swagger-jsdoc
var options = {
    swaggerDefinition: swaggerDefinition,
    apis: ['../src/routes/url.route.ts',], // Path to the API docs (update the path based on your project structure)
};
// Initialize swagger-jsdoc
var swaggerSpec = (0, swagger_jsdoc_1.default)(options);
var setupSwagger = function (app) {
    app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
    console.log('Swagger UI is available at http://localhost:3000/api-docs');
};
exports.setupSwagger = setupSwagger;
