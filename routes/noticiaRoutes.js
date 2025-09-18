const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  obtenerNoticias,
  obtenerNoticiaPorSlug,
  obtenerNoticiasPorCategoria,
  crearNoticia,
  actualizarNoticia, // Mantenemos esta para el editor HTML
  eliminarNoticia,
} = require('../controllers/noticiaController');

// Rutas públicas
router.route('/').get(obtenerNoticias);
router.route('/categoria/:categoryName').get(obtenerNoticiasPorCategoria);
router.route('/:slug').get(obtenerNoticiaPorSlug);

// Rutas privadas para el admin
router.route('/').post(protect, crearNoticia);
router.route('/:id').put(protect, actualizarNoticia).delete(protect, eliminarNoticia);

module.exports = router;