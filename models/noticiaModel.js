const mongoose = require('mongoose');

    // Creamos el esquema (el molde) de la noticia
    const noticiaSchema = new mongoose.Schema({
      titulo: {
        type: String,
        required: [true, 'El título es obligatorio'],
        trim: true, // Elimina espacios en blanco al inicio y al final
      },
      slug: { // El slug es la parte de la URL amigable (ej: "fefita-lanza-nuevo-tema")
        type: String,
        required: [true, 'El slug es obligatorio'],
        unique: true, // No puede haber dos noticias con el mismo slug
      },
      resumen: {
        type: String,
        required: [true, 'El resumen es obligatorio'],
      },
      contenido: {
        type: String,
        required: [true, 'El contenido es obligatorio'],
      },
      imagenUrl: {
        type: String,
        required: [true, 'La URL de la imagen es obligatoria'],
      },
      categoria: {
      type: String,
      required: [true, 'La categoría es obligatoria'],
      // CORRECCIÓN: Lista de categorías actualizada
      enum: [
        'General',
        'Nacionales',
        'Internacionales',
        'Espectáculo',
        'Tecnología',
        'Economía',
        'Deportes',
        'Salud',
        'Chisme',
        'Música',
        'Urbano'
      ],
      default: 'General',
    },
    }, {
      timestamps: true, // Esto añade automáticamente los campos createdAt y updatedAt
    });

    // Creamos el modelo a partir del esquema
    const Noticia = mongoose.model('Noticia', noticiaSchema);

    // Exportamos el modelo para poder usarlo en otras partes de la aplicación
    module.exports = Noticia;