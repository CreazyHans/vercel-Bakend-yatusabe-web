const bcrypt = require('bcryptjs');
const password = 'admin123'; // La contraseña que quieres encriptar
const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync(password, salt);
console.log("Tu contraseña encriptada es:");
console.log(hash);