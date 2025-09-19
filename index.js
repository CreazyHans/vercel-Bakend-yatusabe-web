// backend/server.js (o el nombre original de tu archivo de backend)

// 1. Importaciones
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const noticiaRoutes = require('./routes/noticiaRoutes');
const userRoutes = require('./routes/userRoutes'); // Asegúrate de importar las rutas de usuario

// 2. Configuración inicial
dotenv.config({ path: './routes/.env' }); // Asume que .env está en la raíz de la carpeta que ejecuta el servidor

console.log('DOTENV loaded: ', process.env.MONGO_URI ? 'MONGO_URI is loaded' : 'MONGO_URI is UNDEFINED');
console.log('All .env variables:', process.env);

// 3. Conexión a la Base de Datos
const conectarDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Base de Datos conectada exitosamente');
  } catch (error) {
    console.error(`Error conectando a la DB: ${error.message}`);
    process.exit(1);
  }
};
conectarDB();

// 4. Inicialización de la App
const app = express();

// 5. Middlewares
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://localhost:3000',
    // Aquí es donde deberías poner las URLs de tu frontend desplegado
    // Por ahora, solo las de localhost y las originales que tenías
    'https://yatusabetvrd.online',
    'https://www.yatusabetvrd.online',
    'https://vercel-fronted-yatusabe-web.vercel.app/'
  ],
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());

// 6. Rutas
app.use('/api/noticias', noticiaRoutes);
app.use('/api/users', userRoutes); // Asegúrate de tener la ruta para el login

// 7. Servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en modo desarrollo en el puerto ${PORT}`);
});