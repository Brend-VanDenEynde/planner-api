const express = require('express');
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

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to Planner API',
    status: 'running',
    endpoints: {
      health: '/api/health',
      tasks: '/api/tasks'
    }
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API Routes
const apiRoutes = require('./routes');
app.use('/api', apiRoutes);

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
