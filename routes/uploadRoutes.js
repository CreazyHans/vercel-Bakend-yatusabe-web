 // en backend/routes/uploadRoutes.js
    const express = require('express');
    const upload = require('../config/cloudinary');
    const router = express.Router();

    router.post('/', upload.single('image'), (req, res) => {
      res.status(200).json({
        message: 'Imagen subida exitosamente',
        imageUrl: req.file.path, // La URL segura de Cloudinary
      });
    });

    module.exports = router;