const express = require('express');
const router = express.Router();

// Voorbeeld routes - voeg hier je eigen routes toe
router.get('/example', (req, res) => {
  res.json({ message: 'This is an example route' });
});

module.exports = router;
