const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Nomad Tax API Documentation',
      version: '1.0.0',
      description: 'The API documentation for the Nomad Tax application, providing tax and residency tracking for global nomads.',
      contact: {
        name: 'Developer Support',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            email: { type: 'string', format: 'email' },
            name: { type: 'string' },
            avatar: { type: 'string', nullable: true },
          },
        },
        Stay: {
          type: 'object',
          required: ['countryCode', 'countryName', 'arrivalDate', 'departureDate'],
          properties: {
            id: { type: 'string', format: 'uuid' },
            countryCode: { type: 'string', description: 'ISO code or SCH for Schengen' },
            countryName: { type: 'string' },
            arrivalDate: { type: 'string', format: 'date-time' },
            departureDate: { type: 'string', format: 'date-time' },
            notes: { type: 'string', nullable: true },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            token: { type: 'string' },
            user: { $ref: '#/components/schemas/User' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./server.js'], // Path to the API docs
};

const specs = swaggerJsdoc(options);

module.exports = specs;
