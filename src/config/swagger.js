const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Planner API',
      version: '1.0.0',
      description: 'Een Node.js/Express API voor het beheren van gebruikers en taken',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    tags: [
      {
        name: 'Users',
        description: 'Gebruikers beheer endpoints',
      },
      {
        name: 'Tasks',
        description: 'Taken beheer endpoints',
      },
      {
        name: 'Health',
        description: 'Health check endpoints',
      },
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          required: ['firstname', 'lastname', 'email'],
          properties: {
            id: {
              type: 'integer',
              description: 'Unieke gebruiker ID',
              example: 1,
            },
            firstname: {
              type: 'string',
              description: 'Voornaam van de gebruiker',
              example: 'Jan',
            },
            lastname: {
              type: 'string',
              description: 'Achternaam van de gebruiker',
              example: 'Janssen',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email adres van de gebruiker',
              example: 'jan.janssen@example.com',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Aanmaak datum',
            },
          },
        },
        Task: {
          type: 'object',
          required: ['title', 'description', 'user_id', 'due_date'],
          properties: {
            id: {
              type: 'integer',
              description: 'Unieke taak ID',
              example: 1,
            },
            title: {
              type: 'string',
              description: 'Titel van de taak',
              example: 'Backend API ontwikkelen',
            },
            description: {
              type: 'string',
              description: 'Beschrijving van de taak',
              example: 'REST API bouwen met Express en SQLite',
            },
            due_date: {
              type: 'string',
              format: 'date',
              description: 'Deadline van de taak',
              example: '2026-01-15',
            },
            status: {
              type: 'string',
              enum: ['open', 'in_progress', 'done'],
              description: 'Status van de taak',
              example: 'in_progress',
            },
            user_id: {
              type: 'integer',
              description: 'ID van de toegewezen gebruiker',
              example: 1,
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Aanmaak datum',
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'Laatste update datum',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Foutmelding',
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js', './src/index.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
