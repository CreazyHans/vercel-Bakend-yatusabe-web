const Noticia = require('../models/noticiaModel');

// @desc    Obtener todas las noticias
const obtenerNoticias = async (req, res) => {
  try {
    const noticias = await Noticia.find({}).sort({ createdAt: -1 });
    res.status(200).json(noticias);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
};

// @desc    Obtener una sola noticia por su slug
const obtenerNoticiaPorSlug = async (req, res) => {
  try {
    const noticia = await Noticia.findOne({ slug: req.params.slug });
    if (noticia) {
      res.status(200).json(noticia);
    } else {
      res.status(404).json({ message: 'Noticia no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
};

// @desc    Obtener noticias por categoría
const obtenerNoticiasPorCategoria = async (req, res) => {
  try {
    const noticias = await Noticia.find({ categoria: { $regex: req.params.categoryName, $options: 'i' } }).sort({ createdAt: -1 });
    res.status(200).json(noticias);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
};

// @desc    Crear una nueva noticia
const crearNoticia = async (req, res) => {
  try {
    const { titulo, slug, resumen, contenido, imagenUrl, categoria } = req.body;
    const nuevaNoticia = new Noticia({
      titulo, slug, resumen, contenido, imagenUrl, categoria,
    });
    const noticiaGuardada = await nuevaNoticia.save();
    res.status(201).json(noticiaGuardada);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear la noticia', error: error.message });
  }
};

// @desc    Actualizar contenido de una noticia (para el editor HTML)
const actualizarNoticia = async (req, res) => {
  try {
    const { contenido } = req.body; // Solo aceptamos el contenido
    const noticia = await Noticia.findById(req.params.id);
    if (noticia) {
      noticia.contenido = contenido || noticia.contenido;
      const noticiaActualizada = await noticia.save();
      res.json(noticiaActualizada);
    } else {
      res.status(404).json({ message: 'Noticia no encontrada' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar la noticia', error: error.message });
  }
};


// @desc    Eliminar una noticia
const eliminarNoticia = async (req, res) => {
  try {
    const noticia = await Noticia.findByIdAndDelete(req.params.id);
    if (!noticia) {
      return res.status(404).json({ message: 'Noticia no encontrada' });
    }
    res.status(200).json({ message: 'Noticia eliminada exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la noticia', error: error.message });
  }
};

module.exports = {
  obtenerNoticias,
  obtenerNoticiaPorSlug,
  obtenerNoticiasPorCategoria,
  crearNoticia,
  actualizarNoticia, // Mantenemos esta para el editor HTML
  eliminarNoticia,
};