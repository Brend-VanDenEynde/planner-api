const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const app = express();
const db = require('./config/database');

const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message });
});

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health check endpoint
 *     description: Controleert of de API draait
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is operationeel
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 timestamp:
 *                   type: string
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API Routes
const apiRoutes = require('./routes');
app.use('/api', apiRoutes);

// Swagger Documentation op root (moet na API routes)
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
