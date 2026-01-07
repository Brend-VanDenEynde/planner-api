const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const app = express();
const db = require('./config/database');

const PORT = process.env.PORT || 3000;

// CORS configuratie voor localhost
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[API] ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${req.method} ${req.path} - ${err.message}`);
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
  console.log('[SERVER] Applicatie gestart');
  console.log(`[SERVER] Poort: ${PORT}`);
  console.log(`[SERVER] Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('[SERVER] API endpoints beschikbaar op /api');
  console.log('[SERVER] Swagger documentatie beschikbaar op /');
});
