// backend/index.js (o backend/api/index.js, según donde Vercel lo espere)

// 1. Importaciones
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const noticiaRoutes = require('./routes/noticiaRoutes'); // Asume que routes está en ./routes
const userRoutes = require('./routes/userRoutes');       // Asume que routes está en ./routes

// 2. Configuración inicial de dotenv
// ¡IMPORTANTE! Comenta o elimina esta línea para despliegue en Vercel.
// Vercel inyecta las variables de entorno directamente desde el dashboard.
// dotenv.config({ path: './routes/.env' }); // <-- COMENTA O ELIMINA ESTA LÍNEA para Vercel
// Si necesitas dotenv para desarrollo LOCAL, puedes hacer esto:
// if (process.env.NODE_ENV !== 'production') {
//   dotenv.config({ path: './routes/.env' }); // O la ruta correcta para tu .env local
// }


// 3. Conexión a la Base de Datos (con cache para Serverless)
let cachedDb = null;
const connectDB = async () => {
  if (cachedDb && cachedDb.connections[0].readyState === 1) {
    console.log('=> Usando conexión de DB cacheada');
    return cachedDb;
  }
  try {
    console.log('=> Conectando a una nueva instancia de DB');
    const db = await mongoose.connect(process.env.MONGO_URI);
    cachedDb = db;
    console.log('Base de Datos conectada exitosamente');
    return db;
  } catch (error) {
    console.error(`Error conectando a la DB: ${error.message}`);
    // En serverless, no hacemos process.exit(1); simplemente lanzamos el error
    throw error;
  }
};

// 4. Inicialización de la App Express
const app = express();

// 5. Middlewares CORS
const corsOptions = {
  origin: [
    'http://localhost:3000',                            // Tu frontend local
    'https://localhost:3000',                           // Tu frontend local (HTTPS)
    'https://yatusabetvrd.online',                      // Tu dominio de producción
    'https://www.yatusabetvrd.online',                  // Tu dominio de producción con www
    'https://vercel-fronted-yatusabe-web.vercel.app',   // <<< ¡TU URL REAL DEL FRONTEND EN VERCEL!
    /https:\/\/[a-zA-Z0-9-]+\.vercel\.app$/,            // Para cubrir previews genéricas de Vercel
    /https:\/\/[a-zA-Z0-9-]+\-creazyhans-projects\.vercel\.app$/, // Para previews específicas de tu usuario/proyecto
  ],
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());

// 6. Rutas
// Asegúrate de que los archivos './routes/noticiaRoutes' y './routes/userRoutes'
// exporten routers de Express (ej. `module.exports = router;`).
app.use('/api/noticias', noticiaRoutes);
app.use('/api/users', userRoutes);

// 7. ¡CRÍTICO! EXPORTA LA APLICACIÓN EXPRESS COMO UNA FUNCIÓN SERVERLESS.
// Vercel buscará esta exportación como el entry point para invocar tu código.
module.exports = async (req, res) => {
  // --- LÍNEAS DE DEBUGGING (manténlas por ahora) ---
  console.log('Serverless Function Invoked!');
  console.log(`Request URL: ${req.url}`);
  console.log(`Request Method: ${req.method}`);
  // --- FIN DE LÍNEAS DE DEBUGGING ---

  // Esto es un "health check" simple para la raíz de la función
  if (req.url === '/') {
    return res.status(200).send('API de Noticias está funcionando!');
  }
  
  // Conecta la DB (usará caché) y luego pasa la solicitud a tu app Express
  await connectDB();
  return app(req, res);
};

// 8. ¡CRÍTICO! COMENTA O ELIMINA COMPLETAMENTE EL BLOQUE app.listen().
// NO DEBE HABER UN app.listen() en una función serverless.
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Servidor corriendo en modo desarrollo en el puerto ${PORT}`);
// });