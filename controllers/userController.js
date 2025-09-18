const jwt = require('jsonwebtoken');

// Controlador de autenticación SIN BCRYPT
const authUser = async (req, res) => {
  const { email, password } = req.body;

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (email === adminEmail && password === adminPassword) {
    const token = jwt.sign({ id: 'admin' }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Email o contraseña inválidos' });
  }
};

module.exports = { authUser };