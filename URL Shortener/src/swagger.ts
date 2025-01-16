import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// Swagger definition
const swaggerDefinition = {
  openapi: '3.0.0',  // OpenAPI version
  info: {
    title: 'URL Shortener API',  // API title
    version: '1.0.0',  // API version
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
const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: any) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log('Swagger UI is available at http://localhost:3000/api-docs');
};
