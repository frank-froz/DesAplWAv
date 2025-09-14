const express = require('express');
const router = express.Router();
const animeController = require('../controllers/animeController');

// Rutas para animes
router.get('/', animeController.index);
router.get('/create', animeController.create);
router.post('/store', animeController.store);
router.post('/delete/:id', animeController.delete);

module.exports = router;